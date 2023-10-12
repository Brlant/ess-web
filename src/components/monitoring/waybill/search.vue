<template>
  <search-template class="custom-search" :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">运单监控查询</template>
    <template slot="btn">
      <slot name="btn">
        <el-button @click="exportSearchFile" plain size="small">
          <f-a class="icon-small" name="export"></f-a>
          导出Excel
        </el-button>
        <!--<el-button @click="exportSearchZip" plain size="small">
          <f-a class="icon-small" name="export"></f-a>
          导出Zip
        </el-button>-->
        <el-dropdown>
          <el-button class="custom-button" plain size="small">
            <f-a class="icon-small" name="export"></f-a>
            导出Zip
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="exportWithoutCarriageRecordsZip">导出zip(不含车厢温度记录)</el-dropdown-item>
            <el-dropdown-item @click.native="exportRecordsContainingCarriagesZip">导出zip(含车厢温度记录)</el-dropdown-item>
            <el-dropdown-item @click.native="exportThermometerRecordsZip">导出zip(温度计记录)</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="4" label="运单编号">
              <oms-input @keyup.native.enter="search" placeholder="请输入运单编号"
                         v-model.trim="searchCondition.orderCode"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="货主">
              <org-select :list="dhsOrgList" :remoteMethod="queryDhsOrgId"
                          placeholder="请输入名称搜索货主信息" v-model="searchCondition.ownnerId"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="客户">
              <org-select :list="customerOrgList" :remoteMethod="queryCustomerDhsOrgId"
                          placeholder="请输入名称搜索客户信息" v-model="searchCondition.customerId"></org-select>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="4" label="车牌号">
              <oms-input @keyup.native.enter="search" placeholder="请输入车牌号"
                         v-model.trim="searchCondition.plateNumber"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="交接数据">
              <el-radio-group @change="search" size="small" v-model="searchCondition.handoverDataDone">
                <el-radio-button label="true">已交接</el-radio-button>
                <el-radio-button label="false">未交接</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="监控状态">
              <el-radio-group @change="search" size="small" v-model="searchCondition.activeFlag">
                <el-radio-button label="1">激活</el-radio-button>
                <el-radio-button label="0">停止</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <oms-form-row :required="true" :span="3" label="创建时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="search" placeholder="请选择创建时间"
                              type="datetimerange" v-model="times"/>
            </oms-form-row>
          </el-col>
          <el-col :span="12">
            <oms-form-row :required="true" :span="3" label="启运时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="search" placeholder="请选择启运时间"
                              type="datetimerange" v-model="departTimes"/>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
      <!--  导出温度计记录弹窗  -->
      <el-dialog
          class="export-dialog"
          title="导出模板"
          :visible.sync="exportDialog"
          width="30%"
          center>
        <el-radio-group v-model="exportForm.type">
          <el-radio :label="1">国控生物模板</el-radio>
          <el-radio :label="2">阿里模板</el-radio>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="exportDialog = false">取 消</el-button>
          <el-button type="primary" @click="exportFile(exportForm.id, exportForm.type)" :loading="exportDisabled" :disabled="exportDisabled">下 载</el-button>
        </span>
      </el-dialog>
    </template>
  </search-template>
</template>
<script>
    import methodsMixin from '@/mixins/methodsMixin';
    import {http} from '@/resources';
    import utils from '@/tools/utils';

    export default {
        mixins: [methodsMixin],
        data: function () {
            return {
                searchCondition: {
                    orderCode: '',
                    ownnerId: '',
                    customerId: '',
                    createStartTime: '',
                    createEndTime: '',
                    startTime: '',
                    endTime: '',
                    activeFlag: '',
                    plateNumber: '',
                    handoverDataDone: ''
                },
                showSearch: false,
                list: [],
                times: [],
                departTimes: [],
                exportDialog: false,
                exportForm: {
                  type: 1,
                  id: null
                },
                exportDisabled: false
            };
        },
        mounted() {
            this.initSearchParams();
        },
        methods: {
            // 导出zip(不含车厢温度记录)
            exportWithoutCarriageRecordsZip() {
              this.$store.commit('initPrint', {
                isPrinting: true,
                moduleId: '/monitoring/waybill/id',
                text: '正在导出'
              });
              /**
               * 是否包含车载温度计信息(carThermometer) 0: 不包含; 1: 包含;
               * 导出模板类型(templateType) 1: 国控生物; 2: 阿里;
               */
              let params = Object.assign({}, {carThermometer: 0, templateType: 1}, this.searchCondition);
              http.get('/ccsOrder/temperature-log/export-zip/condition', {params}).then(res => {
                utils.download(res.data.path, '运单设备温度表(不含车厢温度记录)');
                this.$store.commit('initPrint', {
                  isPrinting: false,
                  moduleId: '/monitoring/waybill/id'
                });

              }).catch(error => {
                this.$store.commit('initPrint', {
                  isPrinting: false,
                  moduleId: '/monitoring/waybill/id'
                });
                this.$notify.error({
                  message: error.response && error.response.data && error.response.data.msg || '导出失败'
                });
              });
            },

            // 导出zip(含车厢温度记录)
            exportRecordsContainingCarriagesZip() {
              this.$store.commit('initPrint', {
                isPrinting: true,
                moduleId: '/monitoring/waybill/id',
                text: '正在导出'
              });
              /**
               * 是否包含车载温度计信息(carThermometer) 0: 不包含; 1: 包含;
               * 导出模板类型(templateType) 1: 国控生物; 2: 阿里;
               */
              let params = Object.assign({}, {carThermometer: 1, templateType: 1}, this.searchCondition);
              http.get('/ccsOrder/temperature-log/export-zip/condition', {params}).then(res => {
                utils.download(res.data.path, '运单设备温度表(含车厢温度记录)');
                this.$store.commit('initPrint', {
                  isPrinting: false,
                  moduleId: '/monitoring/waybill/id'
                });

              }).catch(error => {
                this.$store.commit('initPrint', {
                  isPrinting: false,
                  moduleId: '/monitoring/waybill/id'
                });
                this.$notify.error({
                  message: error.response && error.response.data && error.response.data.msg || '导出失败'
                });
              });
            },

            exportThermometerRecordsZip(ccsOrderId) {
              this.exportDialog = true;
              this.exportForm.id = ccsOrderId;
            },

            // 选择模板后导出
            exportFile(billWayId, type) {
              this.exportDisabled = true;
              this.$store.commit('initPrint', {
                isPrinting: true,
                moduleId: '/monitoring/waybill/id',
                text: '正在导出'
              });
              /**
               * 是否包含车载温度计信息(carThermometer) 0: 不包含; 1: 包含;
               * 导出模板类型(templateType) 1: 国控生物; 2: 阿里;
               */
              let params = Object.assign({}, {carThermometer: 0, templateType: type}, this.searchCondition);
              http.get(`/ccsOrder/temperature-log/export-zip/condition`, {params}).then(res => {
                utils.download(res.data.path, '温度计记录');
                this.$store.commit('initPrint', {
                  isPrinting: false,
                  moduleId: '/monitoring/waybill/id'
                });
                this.exportDialog = false;
                this.exportDisabled = false;
              }).catch(error => {
                this.exportDialog = false;
                this.exportDisabled = false;
                this.$store.commit('initPrint', {
                  isPrinting: false,
                  moduleId: '/monitoring/waybill/id'
                });
                this.$notify.error({
                  message: error.response && error.response.data && error.response.data.msg || '导出失败'
                });
              });
            },

            exportSearchZip: function () {
                this.$store.commit('initPrint', {
                    isPrinting: true,
                    moduleId: '/monitoring/waybill/id',
                    text: '正在导出'
                });
                let params = Object.assign({}, this.searchCondition);
                http.get('/ccsOrder/temperature-log/export-zip', {params}).then(res => {
                    utils.download(res.data.path, '运单设备温度表');
                    this.$store.commit('initPrint', {
                        isPrinting: false,
                        moduleId: '/monitoring/waybill/id'
                    });

                }).catch(error => {
                    this.$store.commit('initPrint', {
                        isPrinting: false,
                        moduleId: '/monitoring/waybill/id'
                    });
                    this.$notify.error({
                        message: error.response && error.response.data && error.response.data.msg || '导出失败'
                    });
                });
            },
            exportSearchFile: function () {
                this.$store.commit('initPrint', {
                    isPrinting: true,
                    moduleId: '/monitoring/waybill/id',
                    text: '正在导出'
                });
                let params = Object.assign({}, this.searchCondition);
                http.get('/ccsOrder/export/temperature-info', {params}).then(res => {
                    utils.download(res.data.path, '运单设备温度表');
                    this.$store.commit('initPrint', {
                        isPrinting: false,
                        moduleId: '/monitoring/waybill/id'
                    });

                }).catch(error => {
                    this.$store.commit('initPrint', {
                        isPrinting: false,
                        moduleId: '/monitoring/waybill/id'
                    });
                    this.$notify.error({
                        message: error.response && error.response.data && error.response.data.msg || '导出失败'
                    });
                });
            },
            initSearchParams() {
                let query = this.$route.query;
                if (!query.code) return;
                this.searchCondition.orderCode = query.code;
                this.search();
            },
            search() {
                this.searchCondition.createStartTime = this.formatTimeAry(this.times, 0);
                this.searchCondition.createEndTime = this.formatTimeAry(this.times, 1);
                this.searchCondition.startTime = this.formatTimeAry(this.departTimes, 0);
                this.searchCondition.endTime = this.formatTimeAry(this.departTimes, 1);
                this.$emit('search', this.searchCondition);
            },
            formatTimeAry(times, index) {
                if (!times) return;
                return this.formatTime(times[index]);
            },
            formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
                return time ? this.$moment(time).format(str) : '';
            },
            reset() {
                this.searchCondition = {
                    orderCode: '',
                    ownnerId: '',
                    customerId: '',
                    createStartTime: '',
                    createEndTime: '',
                    startTime: '',
                    endTime: '',
                    activeFlag: '',
                    plateNumber: '',
                    handoverDataDone: ''
                };
                this.times = [];
                this.departTimes = [];
                this.$emit('search', this.searchCondition);
            },
            isShow(val) {
                this.showSearch = val;
            }
        }
    };
</script>
<style lang="scss">

  .custom-search.opera-btn-group {
    .opera-icon {
      line-height: 1;
      .custom-button{
        border-color: #DCDFE6;
      }
    }
  }

</style>
