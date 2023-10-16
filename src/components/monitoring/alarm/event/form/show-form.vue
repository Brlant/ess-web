<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab" ref="selectDialog">
    <template slot="title">告警事件</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!detail.id">暂无数据</div>
      <div v-else>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content" style="overflow: hidden">
            <oms-col :isShow="true" :rowSpan="rowSpan" label="发生时间">{{detail.createTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="恢复时间">{{detail.restoreTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="持续时间">
              {{formatKeepTime(detail)}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="异常类型">
              <!--<span :key="icon" v-for="icon in detail.warnTypes && detail.warnTypes.split(',') || []"-->
              <!--:title="parent.iconClass[icon].title">-->
              <!--<f-a class="icon-danger" :name="parent.iconClass[icon].icon"></f-a>-->
              <!--</span>-->
              <el-tooltip :content="parent.iconClass[icon].title + (detail.warnLevel === '0' ? '告警，级别:低' : '告警，级别:高')"
                          :key="icon"
                          class="item" effect="dark"
                          placement="top"
                          v-for="icon in detail.warnTypes && detail.warnTypes.split(',') || []">
                <f-a :class="detail.warnLevel === '0' ? 'icon-warning' :'icon-danger'"
                     :name="parent.iconClass[icon].icon"></f-a>
              </el-tooltip>
              <!--<el-tooltip  effect="dark" content="告警级别" placement="top">-->
              <!--{{levels[detail.warnLevel].label}}-->
              <!--</el-tooltip>-->
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="监控对象">
              <span @click.stop="parent.goToRouter(detail)" class="active-text">{{parent.formatTitle(detail)}}</span>
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="设备名称">
              <el-tooltip v-if="detail.devType" :content="tempTypeList[detail.devType]" effect="dark" placement="top">
                <f-a :name="parent.DevIcon[detail.devType][1]" class="icon-danger ver-a-mid"></f-a>
              </el-tooltip>
              <span @click.stop="goToDev(detail)" class="active-text">{{detail.devName}}</span>

              <!--<span>{{detail.devName}}</span>-->
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="设备编号/编码">{{detail.devNo}}/{{detail.devCode}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="状态">{{detail.confirmStatus === '1' ? '已确认' : '未确认'}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="创建时间">{{detail.insertTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="处理时间">{{detail.confirmTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="处理人">{{detail.confirmerId}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="情况说明">{{detail.confirmContent}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="告警规则">{{detail.warnHisInfo}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="触发信息">{{detail.triggerInfo}}</oms-col>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[1].name}}</h3>
          </div>
          <div class="content" style="overflow: hidden">
            <chart-line :detail="detail" :filters="filters" :isRecord="true" chartWidth="100%"/>
          </div>

        </div>
        <!--  补充说明   -->
        <div class="form-header-part">
              <div class="header">
                  <div class="sign f-dib"></div>
                  <h3 :class="{active: pageSets[2].key === currentTab.key}" class="tit f-dib index-tit">
                      {{pageSets[2].name}}</h3>
              </div>
              <div class="content" style="overflow: hidden">
                      <el-row>
                          <el-table
                              :data="tableData"
                              border
                              ref="tableRef"
                              max-height="450px"
                              style="width: 100%">
                              <el-table-column
                                  type="index"
                                  label="序号"
                                  width="50"/>
                              <el-table-column
                                  prop="explainContent"
                                  label="内容"/>
                              <el-table-column
                                  prop="creatorName"
                                  label="操作人"
                                  width="150"/>
                              <el-table-column
                                  prop="createTime"
                                  label="操作时间"
                                  width="150">
                                  <template slot-scope="{row}">
                                      <span>{{formatTime(row.createTime)}}</span>
                                  </template>
                              </el-table-column>
                          </el-table>
                      </el-row>
                      <el-row style="text-align: end;margin: 10px 0px">
                          <el-button type="primary" @click="onAddExplain">新增说明</el-button>
                      </el-row>
                      <div v-if="isShowExplain">
                          <el-form ref="form" :model="form" label-width="0" :rules="formRules">
                              <el-form-item label="" prop="explainContent">
                                  <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}"  placeholder="请填写补充说明"  maxlength="199"
                                            show-word-limit v-model="form.explainContent"></el-input>
                              </el-form-item>
                              <el-form-item style="text-align: end;">
                                  <el-button type="primary" @click="onSubmitExplain">保存</el-button>
                                  <el-button @click="resetExplain">取消</el-button>
                              </el-form-item>
                          </el-form>
                      </div>
                  </div>
          </div>
        <!--    告警处理    -->
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[3].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[3].name}}</h3>
          </div>
          <div class="content mt-10" style="overflow: hidden">
            <div v-if="detail.confirmStatus == '0'">
              <el-form :model="alarmHandlingForm" label-width="100px" ref="alarmHandlingForm">
                <el-form-item label="类型" prop="devName">
                  <el-radio-group size="small" v-model="alarmHandlingForm.confirmType">
                    <el-radio-button :key="key" :label="key"
                                     v-for="(item, key) in confirmStatus">{{item}}
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="情况说明">
                  <oms-input placeholder="请输入情况说明" type="textarea" v-model="alarmHandlingForm.confirmContent"/>
                </el-form-item>
                <el-form-item label="恢复前通知" prop="circularNotification">
                  <el-radio-group v-model="alarmHandlingForm.circularNotification">
                    <el-radio label="1">继续通知</el-radio>
                    <el-radio label="0">不再通知</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button :disabled="doing" @click="save('alarmHandlingForm')" plain type="primary">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div v-else>
              <el-table :data="alarmHandlingList" header-row-class-name="table-header-color" style="width: 100%;">
                <el-table-column label="时间" min-width="110" prop="devName"/>
                <el-table-column label="操作人" prop="devCode"/>
                <el-table-column label="类型" prop="confirmStatus">
                  <template slot-scope="{row}">
                    {{confirmStatus[row.confirmStatus]}}
                  </template>
                </el-table-column>
                <el-table-column label="情况说明" prop="confirmContent"/>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
    import {WarnRecord,warnExplain} from '@/resources';
    import utils from '@/tools/utils';
    import ChartLine from '@/components/monitoring/temp-new/chart-line-new';
    import AlarmMixin from '@/mixins/alarmMixin';
    import AlarmEventMixin from '@/mixins/alarmEventMixin';

    const halfDay = 60 * 60 * 1000;
    export default {
        props: {
            index: Number,
            formItem: Object
        },
        components: {ChartLine},
        mixins: [AlarmMixin, AlarmEventMixin],
        data() {
            return {
                rowSpan: 8,
                loading: false,
                pageSets: [
                    {name: '详细信息', key: 0},
                    {name: '历史数据', key: 0},
                    {name: '补充说明', key: 0},
                    {name: '告警处理', key: 0},
                ],
                currentTab: {},
                tempList: [],
                detail: {},
                filters: {
                    startTime: '',
                    endTime: '',
                    devId: '',
                    devCode: '',
                    valType: ['1']
                },
                parent: this.$parent.$parent,
                isShowExplain:false,//是否显示补充说明
                tableData: [],
                form:{},
                formRules: {
                    explainContent: [
                        {required: true, message: '请输入补充说明', trigger: 'blur'},
                        { max: 199, message: '补充说明字数限制199', trigger: 'blur'}
                    ],
                },
              alarmHandlingForm: {
                confirmType: '1',
                confirmContent: '',
                circularNotification: '0'
              },
              doing: false,
              alarmHandlingList: [],
            };
        },
      computed: {
        confirmStatus() {
          return {
            1: '确认',
            2: '取消',
            0: '未确认'
          };
        }
      },
        watch: {
            index(val) {
                if (val !== 0) return;
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
            formatKeepTime(detail) {
                let formatMsToTime = utils.formatMsToTime;
                return formatMsToTime((detail.restoreTime ? detail.restoreTime : Date.now()) - detail.createTime);
            },
            queryDetail() {
                this.loading = true;
                this.resetExplain();
                WarnRecord.get(this.formItem.id).then(res => {
                    this.detail = res.data;
                    this.alarmHandlingList = [res.data]
                    this.loading = false;
                    this.$nextTick(() => {
                        this.queryTempData();
                        this.queryTableData();
                    });
                });
            },
            getValType(warnTypes) {
                let ary = warnTypes.split(',');
                // 离线时间报警显示所有类型数据
                ary.length === 1 && ary[0] === '4' && (ary = ['1', '2', '3']);
                return ary;
            },
            formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
                return time ? this.$moment(time).format(str) : '';
            },
            queryTempData() {
                let {formatTime, getValType} = this;
                let {createTime, restoreTime, devCode, ccsDevId, warnTypes} = this.formItem;
                this.filters = {
                    startTime: formatTime(createTime - halfDay),
                    endTime: formatTime(restoreTime ? restoreTime + halfDay : Date.now()),
                    devId: ccsDevId,
                    devCode: devCode,
                    valType: getValType(warnTypes)
                };
            },
            queryTableData(type){
                warnExplain.getWarnExplain(this.formItem.id).then(res => {
                  this.tableData=res.data.resultList||[];
                  if(type=='scroll'){
                      this.$refs['selectDialog'].setShowFormScrollTop()
                      this.setTableRefScrollTop();
                  }
                });
            },
            onAddExplain(){
             this.isShowExplain=true;
             this.form={
                 ccsWarnRecordId:this.formItem.id,
                 explainContent:'',
             };
             this.$refs['selectDialog'].setShowFormScrollTop()
            },
            onSubmitExplain(){
                this.$refs.form.validate((valid, obj) => {
                    if(!valid) return
                    this.$httpRequestOpera(warnExplain.addWarnExplain(this.form), {
                        successTitle: '添加成功',
                        errorTitle: '添加失败',
                        success: res => {
                            this.queryTableData('scroll');
                            this.resetExplain();
                        },
                        error: () => {
                        }
                    });
                    });
            },
            resetExplain(){
                this.form={
                    ccsWarnRecordId:this.formItem.id,
                    explainContent:'',
                };
                this.isShowExplain=false;
            },
            setTableRefScrollTop(){
                let tabelContainer=this.$refs.tableRef.bodyWrapper;
                if (!tabelContainer) return;
                this.$nextTick(()=>{
                    tabelContainer&&(tabelContainer.scrollTop =tabelContainer.scrollHeight)
                })
            },
            save() {
            this.$refs['alarmHandlingForm'].validate((valid) => {
              if (valid && this.doing === false) {
                this.$httpRequestOpera(WarnRecord.update(this.formItem.id, this.alarmHandlingForm), {
                  successTitle: '处理成功',
                  errorTitle: '处理失败',
                  success: res => {
                    this.doing = false;
                    this.$emit('change', res.data);
                  },
                  error: () => {
                    this.doing = false;
                  }
                });
              }
            });
          }
        }
    };
</script>
