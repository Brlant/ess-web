<style lang="scss" scoped>
  .form-part {
    background: #ffffff;

    .el-form {
      width: 800px;
      margin-left: auto;
      margin-right: auto;
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }
</style>
<template>
  <div class="form-part">
    <el-form class="advanced-query-form" label-width="80px" onsubmit="return false">

        <el-form-item label="货主">
                <org-select :list="orgList" :remoteMethod="queryOrg" @change="orgChange"
                            placeholder="请输入名称搜索货主信息" v-model="searchCondition.orgId"></org-select>
        </el-form-item>
      <el-form-item label="设备">
        <el-select :remote-method="queryAllTempNew" filterable multiple
                   placeholder="请输入名称搜索设备" popper-class="selects--custom" remote v-model="searchCondition.devIds">
          <el-option :key="item.id" :label="item.devName" :value="item.id"
                     v-for="(item, index) in allTempList">
            <dev-option-info :item="item"/>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间段">
        <el-date-picker :default-time="['00:00:00', '23:59:59']" end-placeholder="结束时间" start-placeholder="开始时间"
                        type="datetimerange"
                        v-model="searchCondition.times"/>
      </el-form-item>
      <el-form-item label="时间间隔">
        <el-input placeholder="请输入" style="width: 180px" type="number" v-model.number="searchCondition.statPiece">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="doing" @click="exportData" type="primary" v-has="'show'">
          {{doing ? '正在导出': '导出'}}
        </el-button>
          <el-button :loading="doing2" @click="exportSamplingOneData" type="primary" v-has="'warehouse-cold-dev-data-export'">
              {{doing1 ? '正在导出': '2-8℃导出'}}
          </el-button>
          <el-button :loading="doing3" @click="exportSamplingTwoData" type="primary" v-has="'warehouse-freeze-dev-data-export'">
              {{doing1 ? '正在导出': '-20℃导出'}}
          </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
    import methodsMixin from '@/mixins/methodsMixin';
    import qs from 'qs';
    import utils from '@/tools/utils';
    import axios from 'axios';

    export default {
        mixins: [methodsMixin],
        data: function () {
            return {
                searchCondition: {
                    devIds: [],
                    times: [],
                    statPiece: 5,
                    orgId: ''
                },
                showSearch: false,
                doing: false,
                doing1: false,
                doing2: false,
                doing3: false,
                orgList: []
            };
        },
        mounted() {
            this.queryAllTemp();
        },
        methods: {
          queryOrgList(query) {
            let params = {
              monitorRelationType: 3,
              activeFlag: 1,
              keyWord: query
            };
            this.$http.get('/ccsMonitorRelation', {params}).then(res => {
              this.orgList = res.data.currentList;
            })
          },
          queryAllTempNew(query) {
            this.queryAllTemp(query);
          },
           orgChange(val) {
             this.searchCondition.devIds = [];
            if(!val) return;
             let params = {
               monitorRelationType: 3,
               activeFlag: 1,
               monitorTargetId: val,
               pageSize: 10000
             };
             this.$http.get('/ccsMonitorRelation', {params}).then(res => {
               this.allTempList = res.data.currentList.map(m => ({
                 devName: m.devName,
                 devType: m.devType,
                 devCode: m.devCode,
                 id: m.ccsDevId
               }));
               this.searchCondition.devIds = res.data.currentList.map(m => m.ccsDevId);
             })
           },
            exportData() {
                let {devIds, times, statPiece} = this.searchCondition;
                let {$moment, $notify} = this;
                if (!devIds.length) {
                    return $notify.info({
                        message: '请选择设备'
                    });
                }
                if (statPiece && statPiece <= 0) {
                    return $notify.info({
                      message: '时间间隔必须大于0'
                    });
                }
                let params = {
                    devIds, statPiece,
                    startDate: times && $moment(times[0]).format('YYYY-MM-DD HH:mm:ss'),
                    endDate: times && $moment(times[1]).format('YYYY-MM-DD HH:mm:ss')
                };
                this.doing = true;
                const httpAxios = axios.create();
                httpAxios.defaults.timeout = 120000;
                httpAxios({
                    methods: 'get',
                    url: `${process.env.VUE_APP_API}/mcc-data/ccsWarehouse/export/dev-report`,
                    params,
                    paramsSerializer(params) {
                        return qs.stringify(params, {indices: false});
                    },
                    timeout: 120000
                }).then(res => {
                    this.$notify.success({
                        duration: 2000,
                        message: '导出成功'
                    });
                    this.doing = false;
                    utils.download(res.data.path);
                }).catch(e => {
                    this.$notify.error({
                        duration: 2000,
                        message: e.response && e.response.data && e.response.data.msg || '导出失败'
                    });
                    this.doing = false;
                });
            },
            exportSamplingOneData () {
              let {devIds, times, statPiece, orgId} = this.searchCondition;
              let {$moment, $notify} = this;
            if (!devIds.length) {
              return $notify.info({
                message: '请选择设备'
              });
            }
              if (statPiece && statPiece <= 0) {
                return $notify.info({
                  message: '时间间隔必须大于0'
                });
              }
            let params = {
              statPiece,
              devIds,
              startDate: times && $moment(times[0]).format('YYYY-MM-DD HH:mm:ss'),
              endDate: times && $moment(times[1]).format('YYYY-MM-DD HH:mm:ss')
            };
            this.doing2 = true;
            this.$httpRequestOpera(this.$http({
              url: '/mcc-data/ccsWarehouse/export/warehouse-cold-dev-data',
              params,
              paramsSerializer(params) {
                return qs.stringify(params, {indices: false});
              }
            }), {
              successTitle: '导出成功',
              errorTitle: '导出失败',
              success: res => {
                this.doing2 = false;
                utils.download(res.data.path);
              },
              error: () => {
                this.doing2 = false;
              }
            });
          },
            exportSamplingTwoData () {
            let {devIds, times, statPiece, orgId} = this.searchCondition;
            let {$moment, $notify} = this;
            if (!devIds.length) {
              return $notify.info({
                message: '请选择设备'
              });
            }
              if (statPiece && statPiece <= 0) {
                return $notify.info({
                  message: '时间间隔必须大于0'
                });
              }
            let params = {
              statPiece,
              devIds,
              startDate: times && $moment(times[0]).format('YYYY-MM-DD HH:mm:ss'),
              endDate: times && $moment(times[1]).format('YYYY-MM-DD HH:mm:ss')
            };
            this.doing3 = true;
            this.$httpRequestOpera(this.$http({
              url: '/mcc-data/ccsWarehouse/export/warehouse-freeze-dev-data',
              params,
              paramsSerializer(params) {
                return qs.stringify(params, {indices: false});
              }
            }), {
              successTitle: '导出成功',
              errorTitle: '导出失败',
              success: res => {
                this.doing3 = false;
                utils.download(res.data.path);
              },
              error: () => {
                this.doing3 = false;
              }
            });
          },
            reset() {
                this.searchCondition = {
                    devIds: [],
                    times: [],
                    statPiece: 5,
                    orgId: ''
                };
            },
            isShow(val) {
                this.showSearch = val;
            }
        }
    };
</script>
