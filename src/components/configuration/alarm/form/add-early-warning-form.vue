<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{ actionType }}预警规则
    </template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="135px" ref="tempForm">
        <el-form-item label="规则名称" prop="ruleName">
          <oms-input placeholder="请输入规则名称" type="text" v-model="form.ruleName"></oms-input>
        </el-form-item>
        <el-row>
          <el-col :span="14">
            <el-form-item label="预警规则条件逻辑" prop="logicType">
              <el-radio-group size="small" v-model="form.logicType">
                <el-radio-button :key="item.key" :label="item.key" v-for="item in logicList">{{ item.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="级别" prop="warnLevel">
              <el-radio-group size="small" v-model="form.warnLevel">
                <el-radio-button :key="item.key" :label="item.key" v-for="item in levels">{{ item.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="预警延时通知时间" prop="warnKeepTime">
          <el-select placeholder="请选择延时通知时间" v-model="form.warnKeepTime">
            <el-option :key="key * 1" :label="item" :value="key * 1"
                       v-for="(item, key) in offLine">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <des-btn @click="addRule" icon="plus" v-has="'show'" v-show="isShowAddRuleBtn">添加条件</des-btn>
        </el-form-item>
        <div :key="index" class="part-border-box no-border" v-for="(item, index) in form.details">
          <el-row>
            <el-col :span="6">
              <el-form-item :prop="`details.${index}.monitorType`"
                            :rules="[{ required: true, message: '请选择监控项', trigger: 'change' }]"
                            label-width="0">
                <el-select :disabled="item.checkDisabled" @change="checkChange(item)"
                           placeholder="请选择监控项" v-model="item.monitorType">
                  <el-option :key="item.key" :label="item.label" :value="item.key"
                             v-for="item in checkList" v-show="item.show"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="4" align="center">
              <el-form-item :prop="`details.${index}.compareType`"
                            :rules="[{ required: true, message: '请选择条件', trigger: 'change' }]"
                            label-width="0">
                <el-select :disabled="item.disabled" @change="compareTypeChange(item, index)"
                           placeholder="请选择条件"
                           v-model="item.compareType">
                  <el-option :key="item.key" :label="item.label" :value="item.key"
                             v-for="item in conditions"
                             v-show="item.monitorType !== '4'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="10">
              <el-form-item :prop="`details.${index}.threshold`"
                            :rules="[{ required: true, message: '请输入阈值', trigger: 'blur' }]"
                            label-width="0"
                            v-show="item.compareType !== '5' && item.monitorType !== '4'">
                <oms-input :disabled="item.thresholdDisabled" placeholder="请输入阈值" type="text"
                           v-model="item.threshold">
                  <template slot="append" v-if="unitIcon(item)">{{ unitIcon(item) }}
                  </template>
                </oms-input>
              </el-form-item>
              <!-- 介于 -->
              <el-row v-if="item.compareType === '5'">
                <el-col :span="11">
                  <el-form-item :prop="`details.${index}.threshold`"
                                :rules="[{required: false, validator: validateRange('details', index, 'threshold', 'secThreshold', true), trigger: ['blur', 'change']}]"
                                label-width="0"
                                v-show="item.monitorType !== '4'">
                    <oms-input :disabled="item.thresholdDisabled" placeholder="最小值" type="text"
                               v-model="item.threshold">
                      <template slot="append" v-if="unitIcon(item)">{{ unitIcon(item) }}
                      </template>
                    </oms-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" align="center">
                  <el-form-item label-width="0">~</el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item :prop="`details.${index}.secThreshold`"
                                :rules="[{required: false, validator: validateRange('details', index, 'secThreshold', 'threshold', false), trigger: ['blur', 'change']}]"
                                label-width="0"
                                v-show="item.monitorType !== '4'">
                    <oms-input :disabled="item.thresholdDisabled" placeholder="最大值" type="text"
                               v-model="item.secThreshold">
                      <template slot="append" v-if="unitIcon(item)">{{ unitIcon(item) }}
                      </template>
                    </oms-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 离线时间 -->
              <el-form-item :prop="`details.${index}.threshold`"
                            :rules="[{ required: true, message: '请选择阈值', trigger: 'change' }]"
                            label-width="0"
                            v-show="item.monitorType === '4'">
                <el-select :disabled="item.thresholdDisabled" placeholder="请输入阈值"
                           v-model="item.threshold">
                  <el-option :key="key * 1" :label="item" :value="key * 1"
                             v-for="(item, key) in offLine"
                             v-show="key > 0"></el-option>
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="2" align="center" class="opera-btn">
              <des-btn @click="deleteRule(item)" icon="delete" v-has="'show'"/>
            </el-col>
          </el-row>
        </div>
        <div :key="item + index" class="part-border-box no-border" v-for="(item, index) in form.notifyDetails">
          <el-row>
            <el-col :span="10">
              <el-form-item label="预警通知方式" :prop="`notifyDetails.${index}.strategyType`"
                            :rules="[{ required: true, message: '请选择预警通知方式', trigger: 'change' }]">
                <el-select placeholder="请选择预警通知方式" v-model="item.strategyType" @change="notifyTypeChange(item, index)">
                  <el-option :key="item.key" :label="item.label" :value="item.key"
                             v-for="(item, key) in alertNotificationMethod">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="40px" :prop="`notifyDetails.${index}.notifyTypes`"
                            :rules="[{ required: true, message: '请选择推送方式', trigger: 'change' }]">
                <el-checkbox-group v-model="item.notifyTypes">
                  <el-checkbox label="1">微信</el-checkbox>
                  <el-checkbox label="2">短信</el-checkbox>
                  <el-checkbox label="3">邮箱</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label-width="0">
                <el-button v-has="'show'" v-show="isShowAddNotifyTypeBtn" @click="addNotice">添加</el-button>
                <el-button v-has="'show'" v-if="form.notifyDetails.length > 1" type="danger" size="small"
                           @click="deleteNotice(item)">删除
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item v-if="showNoticeInterval" label="预警通知间隔" prop="warnIntervalTime">
          <el-select placeholder="请选择延时通知时间" v-model="form.warnIntervalTime">
            <el-option :key="key * 1" :label="item" :value="key * 1"
                       v-for="(item, key) in offLine">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="恢复通知方式" prop="recoveryNotify">
          <el-checkbox-group v-model="form.recoveryNotify">
            <el-checkbox label="1">微信</el-checkbox>
            <el-checkbox label="2">短信</el-checkbox>
            <el-checkbox label="3">邮箱</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="通知列表" prop="ccsNotifyIdList">
          <el-select :remote-method="queryNotifyList" filterable @click.once.native="queryNotifyList('')"
                     multiple placeholder="请输入名称搜索通知列表" clearable remote v-model="form.ccsNotifyIdList">
            <el-option :key="item.id" :label="item.notifyListName" :value="item.id"
                       v-for="item in NotificationList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>

<script>
import {
  AlarmRule,
  NotifyRule
} from '@/resources';

export default {
  name: "add-early-warning-form",
  data() {
    return {
      ruleModel: {
        monitorType: '',
        compareType: '0',
        warnLevel: '1',
        startTime: '',
        endTime: '',
        threshold: '',
        checkDisabled: false,
        disabled: false,
        thresholdDisabled: false
      },
      noticeModel: {
        strategyType: '0',
        notifyTypes: [],
      },
      form: {
        recoveryNotify: [],
        ccsNotifyIdList: [],
      },
      doing: false,
      rules: {
        ruleName: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请输入类型',
            trigger: 'blur'
          }
        ],
        logicType: [
          {
            required: true,
            message: '请选择规则条件逻辑',
            trigger: 'change'
          }
        ],
        warnKeepTime: [
          {
            required: true,
            message: '请输入延时通知时间',
            trigger: 'blur'
          }
        ],
        warnIntervalTime: [
          {
            required: true,
            message: '请选择时间间隔',
            trigger: 'change'
          }
        ],
        recoveryNotify: [
          {
            required: true,
            message: '请选择恢复通知方式',
            trigger: 'change'
          }
        ],
        ccsNotifyIdList: [
          {
            required: true,
            message: '请选择通知列表',
            trigger: 'change'
          }
        ],
      },
      actionType: '添加',
      offLine: this.$parent.$parent.offLine,
      checkList: this.$parent.$parent.checkList,
      conditions: this.$parent.$parent.conditionsNew,
      levels: this.$parent.$parent.levels,
      logicList: this.$parent.$parent.logicList,
      tempDetails: [],
      alertNotificationMethod: this.$parent.$parent.alertNotificationMethod,
      NotificationList: [], //通知列表
      showNoticeInterval: false,
      // 已删除项目列表
      deletedItem: [],
      // 恢复通知返回值
      recoveryItem: {}
    };
  },
  computed: {
    isShowAddRuleBtn() {
      // 添加条件，最多是条件的种类个数
      // 种类有6种
      // 特殊情况，选择离线时间时，只能是一条规则
      let details = this.form.details || [];
      return !(details.length > 5 || details.length === 1 && details[0].monitorType === '4');
    },
    isShowAddNotifyTypeBtn() {
      // 添加预警通知方式，最多是条件的种类个数
      // 种类有2种
      let notifyDetails = this.form.notifyDetails || [];
      this.showNoticeInterval = notifyDetails.some(item => item.strategyType == '1')
      return !(notifyDetails.length > 1);
    }
  },
  props: [
    'formItem',
    'index'
  ],
  watch: {
    index: function (val) {
      if (val !== 2) {
        return;
      }
      this.$refs['tempForm'].resetFields();
      if (this.formItem.id && this.formItem.type != 'copy') {
        this.queryDetail();
        this.actionType = '编辑';
      } else if (this.formItem.type == 'copy') {
        this.actionType = '复制';
        this.queryDetail();
      } else {
        this.form = {
          ruleName: '',
          logicType: '0',
          warnLevel: '0',
          warnKeepTime: 0,
          details: [],
          notifyDetails: [],
          warnIntervalTime: 10,
          recoveryNotify: [],
          ccsNotifyIdList: [],
        };
        this.addNotice();
        this.tempDetails = JSON.parse(JSON.stringify(this.form.details));
        this.actionType = '添加';
      }
    }
  },
  methods: {
    addRule() {
      let details = this.form.details || [];
      if (!details.length) {
        details.push(Object.assign({}, this.ruleModel));
        this.tempDetails = this.form.details
                           ? JSON.parse(JSON.stringify(this.form.details))
                           : [];
        return;
      }
      let compareTypeSelected = this.form.details.map(item => item.compareType)
      let compareType = this.conditions.findIndex(item => !compareTypeSelected.includes(item.key))
      details.push(Object.assign({}, details[0], {
        threshold: '',
        checkDisabled: this.switchDisabled(),
        disabled: this.switchDisabled(),
        thresholdDisabled: false,
        // compareType: this.switchCompareType(details[0].compareType)
        compareType: compareType.toString()
      }));
      this.tempDetails = this.form.details
                         ? JSON.parse(JSON.stringify(this.form.details))
                         : [];
    },
    switchDisabled() {
      return this.form.details && this.form.details.length && this.form.details[0].disabled;
    },
    switchCompareType(val) {
      return val === '0' ? '1' : '0';
    },
    deleteRule(item) {
      let index = this.form.details.indexOf(item);
      index !== -1 && this.form.details.splice(index, 1);
      this.tempDetails = JSON.parse(JSON.stringify(this.form.details));
    },
    unitIcon(item) {
      let ary = this.checkList.filter(f => f.key === item.monitorType);
      return ary.length ? ary[0].unit : '';
    },
    checkChange(item) {
      item.disabled = item.monitorType === '4';
      item.threshold = item.disabled ? '' : '';
      //若选择离线时间，删除其他条件
      if (item.monitorType === '4') {
        item.compareType = '1';
        if (this.form.details.length > 1) {
          this.form.details = [item];
          this.tempDetails = JSON.parse(JSON.stringify(this.form.details));
        }
        return;
      }
      // 若是其他监控项， 所有条件的监控项，都设成一样
      this.form.details.forEach(i => {
        i.monitorType = item.monitorType;
      });
      this.tempDetails = JSON.parse(JSON.stringify(this.form.details));
    },
    // 条件改变时，若条件个数是2条，切换对应的另外一条数据
    compareTypeChange(item, index) {
      let details = this.form.details || [];
      if (details.length < 2) {
        return;
      }
      let compareTypeIndex = this.tempDetails.findIndex(detail => detail.compareType == item.compareType)
      if (compareTypeIndex == -1) {
        return;
      }
      let modifierIndex = compareTypeIndex;
      let modifierItem = Object.assign({}, details[modifierIndex], {
        compareType: this.tempDetails[index].compareType
      });
      details.splice(modifierIndex, 1, modifierItem);
      this.tempDetails = JSON.parse(JSON.stringify(this.form.details));
    },
    // 打开弹窗，判断监控项，离线时间，只能添加一个条件
    modifierCheckList(item) {
      let count = 0;
      this.form.details.forEach(i => {
        if (i.monitorType === '4') {
          count++;
        }
      });
      this.tempDetails = JSON.parse(JSON.stringify(this.form.details));
      this.checkList[3].show = !count || (count && item.monitorType === '4');
    },
    queryDetail() {
      this.recoveryItem = {};
      this.deletedItem = [];
      AlarmRule.get(this.formItem.id)
          .then(res => {
            this.setTime(res.data);
            res.data.details.forEach(i => {
              i.checkDisabled = this.formItem.type == 'copy' ? false : true;
              i.disabled = this.formItem.type == 'copy' ? false : true;
              i.thresholdDisabled = this.formItem.type == 'copy' ? false : true;
            });
            // this.form = res.data;
            let recoveryNotify = null;
            let warnIntervalTime = null;
            res.data.strategies.forEach(i => {
              if (i.strategyType == '1') {
                warnIntervalTime = i.warnIntervalTime
              }
              if (i.strategyType == '2') {
                recoveryNotify = i.notifyTypeList
                // 复制的页面仅需要这几个参数
                if (this.formItem.type == 'copy') {
                  this.recoveryItem = (({notifyTypes, strategyType, warnIntervalTime}) => ({notifyTypes, strategyType, warnIntervalTime}))(i);
                } else {
                  this.recoveryItem = i;
                }
                return
              }
              i.notifyTypes = i.notifyTypeList
            })
            let strategies = res.data.strategies.filter(item => (item.strategyType == '0' || item.strategyType == '1'))
            if (strategies.length == 0) {
              this.addNotice()
            }
            if (this.formItem.type == 'copy') {
              let copyStrategies = strategies.map(({notifyTypes, strategyType, warnIntervalTime}) => ({notifyTypes, strategyType, warnIntervalTime}));
              this.form = {
                ...res.data,
                recoveryNotify: recoveryNotify || [],
                notifyDetails: copyStrategies || [],
                warnIntervalTime: warnIntervalTime
              }
              delete this.form.id;
            } else {
              this.form = {
                ...res.data,
                recoveryNotify: recoveryNotify || [],
                notifyDetails: strategies || [],
                warnIntervalTime: warnIntervalTime
              };
            }
            this.tempDetails = JSON.parse(JSON.stringify(this.form.details));
            // 回显通知列表
            if (this.form.ccsNotifyIdList) {
              this.queryNotifyList('')
            }
          });
    },
    setTime(data) {
      if (!data.details) {
        return;
      }
      data.details.forEach(i => {
        let str = this.$moment().format('YYYY-MM-DD') + ' ';
        i.startTime && (i.startTime = new Date(i.startTime = str + i.startTime));
        i.endTime && (i.endTime = new Date(i.endTime = str + i.endTime));
      });
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.doing === false) {
          if (!this.form.details.length) {
            this.$notify.info({
              message: '请添加条件'
            });
            return;
          }
          const parent = this.$parent.$parent;
          // 如果有删除后再添加的项,把该项从已删除项目列表移除
          this.form.notifyDetails.forEach((i, index) => {
            let deletedIndex = this.deletedItem.findIndex(d => d.strategyType == i.strategyType)
            if (deletedIndex != -1) {
              let item = this.deletedItem.find(d => d.strategyType == i.strategyType)
              this.form.notifyDetails[index] = {
                ...item, ...i,
                delFlag: "0"
              }
              this.deletedItem.splice(deletedIndex, 1)
            }
          })
          let form = JSON.parse(JSON.stringify(this.form));
          form.ruleType = '0';
          form.details.forEach(i => {
            i.startTime = parent.formatTime(i.startTime, 'HH:mm:ss');
            i.endTime = parent.formatTime(i.endTime, 'HH:mm:ss');
          });
          // 含有离线时间
          if (form.details.some(s => s.monitorType === '4') && form.warnKeepTime !== 0) {
            form.warnKeepTime = 0;
            this.form.warnKeepTime = 0;
            this.$notify.info('离线时间预警规则，延时通知时间已经修改为不延时');
          }
          form.strategies = form.notifyDetails.concat({
            ...this.recoveryItem,
            strategyType: '2',
            notifyTypes: form.recoveryNotify
          }, this.deletedItem)
          form.strategies.forEach(i => {
            i.ccsWarnRuleId = form.id || null;
            i.notifyTypes = i.notifyTypes.toString();
            i.warnIntervalTime = i.strategyType == '0' ? form.warnKeepTime : i.strategyType == '1' ? form.warnIntervalTime : null;
            delete i.notifyTypeList;
          })
          this.doing = true;
          if (!this.form.id) {
            this.$httpRequestOpera(AlarmRule.save(form), {
              successTitle: '添加成功',
              errorTitle: '添加失败',
              success: res => {
                this.doing = false;
                this.$emit('change', res.data);
              },
              error: () => {
                this.doing = false;
              }
            });
          } else {
            this.$httpRequestOpera(AlarmRule.update(form.id, form), {
              successTitle: '修改成功',
              errorTitle: '修改失败',
              success: res => {
                this.doing = false;
                this.$emit('change', res.data);
              },
              error: () => {
                this.doing = false;
              }
            });
          }
        }
      });
    },

    // 添加预警通知方式
    addNotice() {
      let notifyDetails = this.form.notifyDetails || [];
      if (!notifyDetails.length) {
        notifyDetails.push(Object.assign({}, this.noticeModel));
        return;
      }
      notifyDetails.push(Object.assign({}, {
        strategyType: this.switchNotifyType(notifyDetails[0].strategyType),
        notifyTypes: []
      }));
      this.form.warnIntervalTime = this.form.warnIntervalTime || 10
    },

    switchNotifyType(val) {
      return val === '0' ? '1' : '0';
    },

    deleteNotice(item) {
      let index = this.form.notifyDetails.indexOf(item);
      index !== -1 && this.form.notifyDetails.splice(index, 1);
      if (this.actionType == '编辑') { // 编辑时的删除，需要把该项删除标记置为1
        let someDeteled = this.deletedItem;
        if (!someDeteled.some(e => e.strategyType == item.strategyType)) {
          someDeteled.push({
            ...item,
            delFlag: '1'
          });
        }
        this.deletedItem = someDeteled;
      }
    },

    notifyTypeChange(item, index) {
      let notifyDetails = this.form.notifyDetails || [];
      if (notifyDetails.length !== 2) {
        return;
      }
      let modifierIndex = index === 0 ? 1 : 0;
      let modifierItem = Object.assign({}, notifyDetails[modifierIndex], {
        strategyType: this.switchNotifyType(notifyDetails[modifierIndex].strategyType)
      });
      notifyDetails.splice(modifierIndex, 1, modifierItem);
    },

    // 通知列表
    queryNotifyList(query) {
      const params = {
        notifyListName: query
      };
      NotifyRule.query(params).then(res => {
        this.NotificationList = res.data.currentList || [];
      });
    },

    validateRange(source, index, params, compare, flag) {
      const lowLimit = '下限值'
      const upLimit = '上限值'
      return (rule, value, callback) => {
        if (!value || value === '0') {
          return callback(new Error(`请输入大于0的数`))
        } else if (value) {
          const paramsValue = +this.form[source][index][params]
          const compareValue = +this.form[source][index][compare]
          if (flag) {
            if (paramsValue > compareValue) {
              this.$refs.tempForm.clearValidate(`${source}.${index}.${compare}`)
              return callback(new Error(`${lowLimit}不能大于${upLimit}`))
            } else {
              this.$refs.tempForm.clearValidate(`${source}.${index}.${compare}`)
              if (!Number(this.form[source][index][compare])) {
                this.$refs.tempForm.validateField(`${source}.${index}.${compare}`)
              }
            }
            callback()
          } else {
            if (paramsValue < compareValue) {
              return callback(new Error(`${upLimit}不能小于${lowLimit}`))
            } else {
              this.$refs.tempForm.clearValidate(`${source}.${index}.${compare}`)
              if (!Number(this.form[source][index][compare])) {
                this.$refs.tempForm.validateField(`${source}.${index}.${compare}`)
              }
            }
            callback()
          }
          callback()
        } else {
          callback()
        }
      }
    },
  }
}
</script>

<style scoped>

</style>
