<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">设备监控信息</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!dev.id">暂无数据</div>
      <div v-else>
        <div class="form-header-part" v-if="pageSets[0]">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content mt-10" style="overflow: hidden">
            <oms-col :isShow="true" label="编码">{{dev.monitordevCode}}</oms-col>
            <oms-col :isShow="true" label="类型">{{typeList[dev.monitordevType-1].title}}</oms-col>
            <oms-col :isShow="true" label="监控状态">{{dev.monitorFlag | formatMonitoringStatus}}</oms-col>
            <!--<oms-col label="告警状态" :isShow="true">{{dev.warnStatus | formatAlarmStatus}}</oms-col>-->
              <oms-col :isShow="true" label="开始监控时间" v-show="dev.createTime">{{dev.createTime | time}}</oms-col>
              <oms-col :isShow="true" label="状态">{{dev.activeFlag | formatUseStatus}}</oms-col>
              <oms-col :isShow="true" label="备注" v-show="dev.comment">{{dev.comment}}</oms-col>
          </div>
          <div class="hr mb-10 mt-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header" v-if="pageSets[1]">
              <div class="sign f-dib"></div>
              <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
                {{pageSets[1].name}}</h3>
          </div>
          <div class="content">
            <showPointList @open="openFn" :isHidden="true" :form="form" :typeList="typeList" class="w-part" ref="showPointList"></showPointList>
          </div>
          <!--
            之前逻辑
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
                {{pageSets[1].name}}</h3>
            </div>
            <el-table :data="dev.devs" class="mt-10" header-row-class-name="table-header-color" style="width: 100%;">
            <el-table-column label="名称" min-width="100" prop="relationName"></el-table-column>
            <el-table-column label="设备编码" min-width="100" prop="devCode">
            </el-table-column>
            <el-table-column label="设备编号" min-width="100" prop="devNo">
            </el-table-column>
            <el-table-column label="类型" min-width="120" prop="devType">
              <template slot-scope="scope">
                {{tempTypeList[scope.row.devType]}}
              </template>
            </el-table-column>
            <el-table-column label="最新数据" min-width="100" prop="devCode">
              <template slot-scope="scope">
                <el-tooltip :content="showRecordDate(scope.row.recordDate)" effect="dark" placement="top">
                  <span>{{$formatDevData(scope.row, $formatDevType(scope.row))}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120" prop="devType">
              <template slot-scope="scope">
                <des-btn @click="$turnDevDate(scope.row, $formatDevType(scope.row), true)" icon="detail"
                         v-has="'ccs-devmap-scan'">历史数据
                </des-btn>
              </template>
            </el-table-column>
          </el-table> -->
        </div>
        <div class="form-header-part"  v-if="pageSets[2]">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[2].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[2].name}}</h3>
          </div>

          <!--
            之前逻辑
            <rule-notify-scan :unitId="dev.id ? `d,${dev.id}` : ''" perm="ccs-monitordev-rulecfg"></rule-notify-scan>
          -->
          <rule-notify-info :item="form" @getChangList="getChangList" ref="ruleNotifyInfo"/>

        </div>
        <div class="form-header-part">
          <div class="header" v-if="pageSets[3]">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[3].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[3].name}}</h3>
          </div>
          <div class="content">
            <rule-change-record :changeList="changeList" ref="ruleChangeRecord"/>
          </div>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
    import {DevMonitoring} from '@/resources';

    // yxh 引入点位信息组件
    import showPointList from '@/components/monitoring/equipment/showPointList' ;
    import ruleNotifyInfo from '@/components/common/rule-notify-info';
    import ruleChangeRecord from '@/components/common/rule-change-record';

    export default {
        props: ['formItem', 'index'],
        data() {
            return {
                loading: false,
                pageSets: [
                    {name: '基本信息', key: 0},
                    {name: '点位信息', key: 1},
                    // {name: '温度计信息', key: 1},
                    {name: '规则信息', key: 2},
                    {name: '变更记录', key: 3}
                ],
                currentTab: {},
                form: {
                    details: []
                },

                dev: {},
                typeList: this.$parent.$parent.typeList,
                tempTypeList: ['有线温度计', '无线温度计', '冷柜温度计', '车载温度计', '湿度计'],
                tempList: [{
                    ccsDevId: 't1'
                }],

                type: '' ,
                changeList: [],
            };
        },
        watch: {
            formItem : {
                deep : true,
                handler( item ){
                    if( !item ){ return ; }
                    this.form = item ;
                }
            },
            index(val) {
                if (val !== 1) return;
                this.queryDetail();
            },

        },
        components : {showPointList, ruleNotifyInfo, ruleChangeRecord},
        mounted(){
          this.form = this.formItem;
        },
        methods: {
            showRecordDate: function (data) {
                return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
            },
            selectTab(item) {
                this.currentTab = item;
            },
            close() {
                this.$emit('right-close');
            },
            queryDetail() {
                this.dev = {};
                this.loading = true;
                DevMonitoring.get(this.formItem.id).then(res => {
                  if( res.data && res.data.devs && Array.isArray(res.data.devs) ){
                    res.data.devs.forEach((i, index) => {
                        i.relationName = res.data.relationNames && res.data.relationNames[index] || '';
                    });
                  }
                  this.dev = res.data;
                  this.loading = false;
                });
            },

            openFn( form, type ){
                this.form = Object.assign({}, form);
                this.type = type;
            },

            // 获取规则变更记录
            getChangList(val) {
              this.changeList = val;
            }
        }
    };
</script>
