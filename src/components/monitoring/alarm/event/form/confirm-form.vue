<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">处理{{ earlyWarning == '1' ? '预警' : '告警'}}事件</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" label-width="100px" ref="tempForm">
        <el-form-item label="类型" prop="devName">
          <el-radio-group size="small" v-model="form.confirmType">
            <el-radio-button :key="key" :label="key"
                             v-for="(item, key) in confirmStatus">{{item}}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="情况说明" prop="confirmContent" :rules="earlyWarning == '0' ? [{required: true, message:'请输入情况说明', trigger: 'blur'}] : [{required: false}]">
          <oms-input placeholder="请输入情况说明" type="textarea" v-model="form.confirmContent"/>
        </el-form-item>
        <el-form-item label="恢复前通知" prop="circularNotification">
          <el-radio-group v-model="form.circularNotification">
            <el-radio label="1">继续通知</el-radio>
            <el-radio label="0">不再通知</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
    import {WarnRecord} from '@/resources';

    export default {
        data() {
            return {
                form: {
                    confirmType: '1',
                    confirmContent: '',
                    circularNotification: '0'
                },
                doing: false,
                earlyWarning: null,
            };
        },
        props: {
            formItem: Object,
            index: Number
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
            index: function (val) {
                this.earlyWarning = this.formItem.earlyWarning;
                this.form = {
                    confirmType: '1',
                    confirmContent: '',
                    circularNotification: '0'
                };
            }
        },
        methods: {
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid && this.doing === false) {
                        this.$httpRequestOpera(WarnRecord.update(this.formItem.id, this.form), {
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
