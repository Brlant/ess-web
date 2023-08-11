<template>
    <dialog-template :btnSavePosition="100">
        <template slot="title">{{ actionType }}</template>
        <template slot="btnSave">
            <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
        </template>
        <template slot="content">
            <el-form :model="form" :rules="rules" label-width="140px" ref="tempForm">
                <el-form-item label="名称" prop="devName">
                    <oms-input placeholder="请输入名称" type="text" v-model="form.devName"/>
                </el-form-item>
                <el-form-item label="设备编码devCode" prop="devCode">
                    <oms-input placeholder="请输入编码" type="text" v-model="form.devCode"/>
                </el-form-item>
                <el-form-item label="设备编号devNo">
                    <oms-input placeholder="请输入设备编号" type="input" v-model="form.devNo"/>
                </el-form-item>
                <!--<template slot="right">-->
                <!--<el-form-item label="监控状态">-->
                <!--<el-switch active-text="激活" active-value="1" inactive-value="0" v-model="form.monitorStatus"-->
                <!--inactive-text="未激活"></el-switch>-->
                <!--</el-form-item>-->
                <!--</template>-->
                <el-form-item label="校准期" prop="createTime" v-if="type === 2">
                    <el-date-picker placeholder="请选择" type="date" v-model="form.createTime" value-format="timestamp"/>
                </el-form-item>
                <el-form-item label="备注">
                    <oms-input placeholder="请输入备注" type="textarea" v-model="form.comment"/>
                </el-form-item>
                <el-form-item label="状态">
                    <!-- <el-switch active-text="启用" active-value="1" inactive-text="停用" inactive-value="0"
                               v-if="type !== 2" v-model="form.devStatus"></el-switch> -->
                    <el-select placeholder="请选择状态"  v-model="form.devStatus" @change="changeDevStatus">
                        <el-option :key="key" :label="item.title" :value="item.status"
                                   v-for="(item, key) in statusType" v-show="item.status !== null"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="type === 2&&actionType == '编辑'" label="最后一次使用单位">
                  <el-select
                      v-model="form.usingOffice"
                      clearable
                      filterable
                      remote
                      placeholder="请输入最后一次使用单位"
                      popperClass="good-selects"
                      @click.native.once="queryOrg('')"
                      :remote-method="queryOrg"
                      @change="changeUsingOffice">
                    <el-option :value="org.dhsOrgId" :key="org.id" :label="org.name" v-for="org in orgList">
                      <slot :row="org">
                        <div style="overflow: hidden">
                          <span class="pull-left" style="clear: right">{{org.name}}</span>
                        </div>
                        <div style="overflow: hidden">
                          <span class="select-other-info pull-left">
                            <span>系统代码:</span>{{org.manufacturerCode}}
                          </span>
                        </div>
                      </slot>
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
        </template>
    </dialog-template>
</template>
<script>
import {TempDev} from '@/resources';
import { BaseInfo } from '@/resources';

export default {
    data() {
        return {
            form: {},
            doing: false,
            rules: {
                devCode: [
                    {required: true, message: '请输入编码', trigger: 'blur'}
                ],
                devName: [
                    {required: true, message: '请输入名称', trigger: 'blur'}
                ],
                temp: [
                    {required: true, message: '请输入当前温度', trigger: 'blur'}
                ],
                voltage: [
                    {required: true, message: '请输入当前电压', trigger: 'blur'}
                ],
                createTime: [
                    {required: true, message: '请选择校准期', trigger: 'change'}
                ],
                devNo: [
                    {required: true, message: '请输入设备编号', trigger: 'blur'}
                ]
            },
            actionType: '添加',
            orgList: [],
        };
    },
    props: {
        formItem: Object,
        type: Number,
        statusType: Object,
        index: Number
    },
    watch: {
        index: function (val) {
            this.$refs['tempForm'].clearValidate();
            if (this.formItem.ccsDevId) {
                this.form = Object.assign({}, this.formItem);
                this.actionType = '编辑';
            } else {
                this.form = {
                    devCode: null,
                    devName: null,
                    devStatus: '1',
                    devType: null,
                    monitorStatus: '0',
                    comment: null,
                    createTime: null,
                    devNo: null,
                    usingOffice: null,
                };
                this.actionType = '添加';
            }
        }
    },
  mounted() {
      // this.queryOrg('')
  },
  methods: {
        // 修改状态时
        changeDevStatus(val) {
          if (val == 3 || !this.devCode) {
            this.form.usingOffice = null;
          }
        },
        save(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && this.doing === false) {
                    // this.form.createTime = this.form.createTime ? this.$moment(this.form.createTime).format('YYYY-MM-DD') : '';
                    if (!this.form.id) {
                        this.form.devType = '' + (this.type - 1);
                        this.doing = true;
                        this.$httpRequestOpera(TempDev.save(this.form), {
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
                        this.$httpRequestOpera(TempDev.update(this.form.id, this.form), {
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

        // 查询使用单位
        queryOrg(query) {
          let params = { orgtype: '0', pageSize: 2000,};
          if (typeof query === 'string') {
            Object.assign(params, {keyWord: query});
          } else if (typeof query === 'object') {
            Object.assign(params, query);
          }

          BaseInfo.query(params).then(res => {
            this.orgList = res.data.list;
          });
        },

        // 改变最后一次使用单位
        changeUsingOffice(val) {
          if (!val) {
            this.form.usingOffice = null
          }
        }
    }
};
</script>
