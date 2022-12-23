<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">通知列表</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!notify.id">暂无数据</div>
      <div v-else>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content" style="overflow: hidden">
            <oms-col :isShow="true" label="名称">{{notify.notifyListName}}</oms-col>
            <!--<oms-col label="创建时间" :isShow="true">{{notify.createTime | time}}</oms-col>-->
          </div>
          <div class="hr mb-10 mt-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[1].name}}</h3>
          </div>
          <div class="content">
              <el-row>
                  <el-col class="text-right mb-10">
                      <el-button @click="exportPdf">导出PDF</el-button>
                      <el-button @click="exportWord">导出word</el-button>
                  </el-col>
              </el-row>
              <el-table :data="notify.details" border>
                  <el-table-column type="index" label="NO" width="45"></el-table-column>
                  <el-table-column
                      label="联系人类型"
                      min-width="140"
                  >
                      <template slot-scope="{row,$index}">
                          <span>{{typeList[row.memberSource].label}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column
                      label="联系人"
                      min-width="120"
                  >
                      <template slot-scope="{row,$index}">
                          <span>{{ row.notifyUser }}</span>
                      </template>
                  </el-table-column>
                  <el-table-column
                      label="通知类型"
                      min-width="145"
                  >
                      <template slot-scope="{row,$index}">
                          <span>{{checkList[row.notifyType-1].label}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column
                      label="TEL/微信号/邮箱"
                      min-width="210"
                  >
                      <template slot-scope="{row,$index}">
                          <span>{{ (row.notifyType === '1' || row.notifyType === '3') ? row.phone : row.notifyType === '2' ? row.email : '' }}</span>
                      </template>
                  </el-table-column>
                  <el-table-column
                      label="部门"
                      min-width="85"
                  >
                      <template slot-scope="{row,$index}">
                          <span>{{ row.orgName }}</span>
                      </template>
                  </el-table-column>
                  <el-table-column
                      label="角色"
                      min-width="85"
                  >
                      <template slot-scope="{row,$index}">
                          <span>{{ row.roleName }}</span>
                      </template>
                  </el-table-column>

                  <el-table-column
                      label="备注"
                      min-width="130"
                  >
                      <template slot-scope="{row,$index}">
                          <span>{{row.comment}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column
                      label="通知状态"
                  >
                      <template slot-scope="{row,$index}">
                          <span>{{row.notifyStatus ? notifyStatusList[row.notifyStatus].label : ''}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column
                      label="维护时间"
                  >
                      <template slot-scope="{row,$index}">
                          <span>{{ row.operationTime }}</span>
                      </template>
                  </el-table-column>
                  <el-table-column
                      label="操作人"
                  >
                      <template slot-scope="{row,$index}">
                          <span>{{ row.operatorName }}</span>
                      </template>
                  </el-table-column>
              </el-table>
<!--            <div class="order-list clearfix" style="padding-top: 10px">
              <el-row class="order-list-header">
                <el-col :span="4">人员类型</el-col>
                <el-col :span="4">通知类型</el-col>
                <el-col :span="8">联系方式</el-col>
                <el-col :span="8">备注</el-col>
              </el-row>
              <div class="empty-info mini" v-if="!notify.details.length">
                暂无信息
              </div>
              <div class="order-list-body flex-list-dom" v-else>
                <div :key="index" class="order-list-item no-pointer order-list-item-bg"
                     v-for="(item, index) in notify.details">
                  <el-row>
                    <el-col :span="4">{{typeList[item.memberSource].label}}</el-col>
                    <el-col :span="4">{{checkList[item.notifyType-1].label}}</el-col>
                    <el-col :span="8">
                      <span class="R" v-show="item.memberSource === '1' ">{{item.targetStr}}</span>
                      <span v-show="item.memberSource === '0' ">
                        {{item.name}}
                        <span v-show="item.notifyType !== '3'">({{item.targetStr}})</span>
                      </span>
                    </el-col>
                    <el-col :span="8">{{item.comment}}</el-col>
                  </el-row>
                </div>
              </div>
            </div>-->
          </div>
          <div class="hr mb-10"></div>
        </div>
        <!--     操作日志     -->
        <div class="form-header-part">
            <div class="header">
                <div class="sign f-dib"></div>
                <h3 :class="{active: pageSets[2].key === currentTab.key}" class="tit f-dib index-tit">
                    {{pageSets[2].name}}</h3>
            </div>
            <div class="content">
                <el-row>
                    <el-col class="text-right mb-10">
                        <el-button @click="exportExcel">导出Excel</el-button>
                    </el-col>
                </el-row>
<!--                <el-table :data="operationList" border>-->
                <el-table :data="notify.details">
                <el-table-column type="index" label="NO" width="45"></el-table-column>
                    <el-table-column
                        label="操作人"
                    >
                        <template slot-scope="{row,$index}">
                            <span>{{ row.operatorName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作时间"
                    >
                        <template slot-scope="{row,$index}">
                            <span>{{ row.operationTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作类型"
                    >
                        <template slot-scope="{row,$index}">
                            <span>{{ }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table :data="notify.details" border>
                                <el-table-column type="index" label="NO" width="45"></el-table-column>
                                <el-table-column
                                    label="联系人类型"
                                >
                                    <template slot-scope="{row,$index}">
                                        <span>{{ }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="联系人"
                                >
                                    <template slot-scope="{row,$index}">
                                        <span>{{ }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="字段"
                                >
                                    <template slot-scope="{row,$index}">
                                        <span>{{ }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="新值"
                                >
                                    <template slot-scope="{row,$index}">
                                        <span>{{ }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="旧值"
                                >
                                    <template slot-scope="{row,$index}">
                                        <span>{{ }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
          </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
    import {NotifyRule, User} from '@/resources';
    import utils from '@/tools/utils';
    import qs from "qs";

    export default {
        props: ['formItem', 'index'],
        data() {
            return {
                loading: false,
                pageSets: [
                    {name: '基本信息', key: 0},
                    {name: '通知方式', key: 1},
                    {name: '操作日志', key: 2},
                ],
                currentTab: {},
                notify: {},
                checkList: [
                    {label: '短信', key: '1'},
                    {label: '邮箱', key: '2'},
                    {label: '微信', key: '3'}
                ],
                typeList: [
                    {label: '系统联系人', key: '0'},
                    {label: '外部联系人', key: '1'}
                ],
                notifyStatusList: [
                    {label: '停用', key: '0'},
                    {label: '启用', key: '1'}
                ],
                doing: false,
                operationList: []
            };
        },
        watch: {
            index: function (val) {
                if (val !== 1) return;
                this.queryDetail();
            }
        },
        methods: {
            formatContactWay(item) {
                if (item.memberSource === '1') return;
                User.get(item.targetStr).then(res => {
                    item.name = res.data.name;
                    item.targetStr = item.notifyType === '1' ? res.data.phone : res.data.email;
                });
            },
            selectTab(item) {
                this.currentTab = item;
            },
            close() {
                this.$emit('right-close');
            },
            queryDetail() {
                this.notify = {};
                this.loading = true;
                NotifyRule.get(this.formItem.id).then(res => {
                    res.data.details.forEach(i => {
                        this.formatContactWay(i);
                    });
                    this.notify = res.data;
                    this.loading = false;
                });
            },
            // 导出PDF
            exportPdf() {
                let params = {};
                /*this.doing = true;
                this.$httpRequestOpera(this.$http({
                    url: '',
                    params,
                    paramsSerializer(params) {
                        return qs.stringify(params, {indices: false});
                    }
                }), {
                    successTitle: '导出成功',
                    errorTitle: '导出失败',
                    success: res => {
                        this.doing = false;
                        utils.download(res.data.path);
                    },
                    error: () => {
                        this.doing = false;
                    }
                });*/
            },
            // 导出word
            exportWord() {
                let params = {};
                /*this.doing = true;
                this.$httpRequestOpera(this.$http({
                    url: '',
                    params,
                    paramsSerializer(params) {
                        return qs.stringify(params, {indices: false});
                    }
                }), {
                    successTitle: '导出成功',
                    errorTitle: '导出失败',
                    success: res => {
                        this.doing = false;
                        utils.download(res.data.path);
                    },
                    error: () => {
                        this.doing = false;
                    }
                });*/
            },
            // 导出Excel
            exportExcel() {
                let params = {};
                /*this.doing = true;
                this.$httpRequestOpera(this.$http({
                    url: '',
                    params,
                    paramsSerializer(params) {
                        return qs.stringify(params, {indices: false});
                    }
                }), {
                    successTitle: '导出成功',
                    errorTitle: '导出失败',
                    success: res => {
                        this.doing = false;
                        utils.download(res.data.path);
                    },
                    error: () => {
                        this.doing = false;
                    }
                });*/
            }
        }
    };
</script>
