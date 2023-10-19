<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">告警通知</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!detail">暂无数据</div>
      <div v-else>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content" style="overflow: hidden">
            <oms-col :isShow="true" :rowSpan="rowSpan" label="通知时间">{{detail.createTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="设备名称">{{detail.devName}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="消息类型">
              <span class="info-type" :class="detail.recordType === '0' ? 'warning-type' : detail.recordType === '1' ? 'recovery-type' : detail.recordType === '2' ?'early-warning-type' : ''">
                {{detail.recordType === '0' ? '告警' : detail.recordType === '1' ? '恢复' : detail.recordType === '2' ? '预警' : ''}}
              </span>
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="设备编号/编码">{{detail.devNo}}/{{detail.devCode}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="监控对象">{{formatTitle(detail)}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="事件编号">{{detail.eventNo }}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="发生时间">{{detail.createTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="通知内容">{{detail.warnHisInfo}}</oms-col>
          </div>
        </div>
        <div class="form-header-part mt-10">
          <el-row>
            <el-col :span="6">
              <div class="header">
                <div class="sign f-dib"></div>
                <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
                  {{pageSets[1].name}}</h3>
              </div>
            </el-col>
            <el-col :span="18">
              <el-form ref="searchCondition" :model="searchCondition">
                <el-row>
                  <el-col :span="10">
                    <oms-form-row :span="4" class="m0" label="">
                      <el-radio-group @change="onSearch" size="small" v-model="searchCondition.notifyType">
                        <el-radio-button label="1">短信</el-radio-button>
                        <el-radio-button label="2">邮箱</el-radio-button>
                        <el-radio-button label="3">微信</el-radio-button>
                      </el-radio-group>
                    </oms-form-row>
                  </el-col>
                  <el-col :span="7">
                    <oms-form-row :span="2" class="m0 custom-input" label="">
                      <oms-input @keyup.native.enter="onSearch" placeholder="请输入名称"
                                 v-model.trim="searchCondition.userName"></oms-input>
                    </oms-form-row>
                  </el-col>
                  <el-col :span="7">
                    <oms-form-row :span="2" class="m0" label="">
                      <el-button type="primary" size="small" @click="onSearch">查找</el-button>
                      <el-button type="plain" size="small" @click="onReset">重置</el-button>
                    </oms-form-row>
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
          </el-row>

          <div class="content mt-10" style="overflow: hidden" v-for="(item, index) in filterList">
            <oms-col :isShow="true" :rowSpan="rowSpan" label="通知对象">{{formatTitle(item)}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="通知类型">
              {{checkList[Number(item.notifyType) - 1].label }}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="通知人员">{{ item.userName }}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="发送状态">
              {{item.sendStatus === '1' ? '成功' : item.sendStatus === '0' ? '失败' : item.sendStatus === '2' ? '发送中': item.sendStatus}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="接口报文">{{item.backMessage}}</oms-col>
          </div>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
    import {NotifyRecord} from '@/resources';
    import AlarmEventMixin from '@/mixins/alarmEventMixin';

    export default {
        props: {
            index: Number,
            formItem: Object
        },
      mixins: [AlarmEventMixin],
        data() {
            return {
                rowSpan: 8,
                loading: false,
                pageSets: [
                    {name: '详细信息', key: 0},
                    {name: '通知列表', key: 0},
                ],
                checkList: this.$parent.$parent.checkList,
                currentTab: {},
                detail: {},
                searchCondition: {
                  notifyType: null,
                  userName: null
                },
                list: [],
                filterList: [],
            };
        },
        watch: {
            index(val) {
                if (val !== 0) return;
                this.onReset();
                this.queryDetail();
            }
        },
        methods: {
            selectTab(item) {
                this.currentTab = item;
            },
            close() {
                this.$emit('right-close');
            },
            queryDetail() {
                this.loading = true;
                const {ccsWarnRecordId, recordType, createTime} = this.formItem;
                const params = {
                  ccsWarnRecordId: ccsWarnRecordId,
                  recordType: recordType,
                  createTime: this.$moment(createTime).format('YYYY-MM-DD HH:mm:ss'),
                }
                NotifyRecord.gainNotifyRecordInfoNew(params).then(res => {
                    this.detail = res.data;
                    this.list = res.data.list || [];
                    this.filterList = res.data.list || [];
                    this.loading = false;
                });
            },

            // 查找
            onSearch() {
              let filtered = JSON.parse(JSON.stringify(this.list));
              if (this.searchCondition.notifyType) {
                filtered = filtered.filter(item => item.notifyType == this.searchCondition.notifyType);
              }
              if (this.searchCondition.userName) {
                filtered = filtered.filter(item => item.userName&&item.userName.toLowerCase().includes(this.searchCondition.userName.toLowerCase()));
              }
              this.filterList = filtered;
            },

            // 重置
            onReset() {
              this.searchCondition = {
                notifyType: null,
                userName: null
              }
              this.onSearch();
            }
        }
    };
</script>
<style lang="scss" scoped>
.info-type {
  width: 50px;
  height: 20px;
  line-height: 20px;
}
.oms-form-row.el-row.m0 {
  margin: 0;
  ::v-deep.el-input__inner {
    height: 34px;
  }
}

</style>
