<style lang="scss" scoped>
$labelWidth: 180px;
.content-part {
    .content-left {
        width: $labelWidth;
    }

    .content-right {
        > h3 {
            left: $labelWidth;
        }

        left: $labelWidth;
    }
}

.form-item-30 {
    padding-left: 30px
}
</style>
<template>
    <dialog-template :btnSavePosition="120" :pageSets="pageSets" @selectTab="selectTab">
        <template slot="title">审核点位历史设备</template>
        <template slot="btn">
            <el-button :disabled="doing" @click="submit('tempForm')" plain type="primary">审核通过</el-button>
        </template>
        <template slot="content">
            <div class="form-header-part">
                <div class="header">
                    <div class="sign f-dib"></div>
                    <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
                        {{ pageSets[0].name }}</h3>
                </div>
                <el-form id="form0" :model="form" :rules="rules" label-width="100px" ref="tempForm">
                    <div class="form-header-part">
                        <div class="content  mt-10">
                            <oms-col :isShow="true" label="仓库名称">{{ form.warehouseName }}</oms-col>
                            <oms-col :isShow="true" label="点位名称">{{ form.pointName }}</oms-col>
                            <oms-col :isShow="true" label="设备名称">{{ form.devName }}</oms-col>
                            <oms-col :isShow="true" label="设备编码">{{ form.devCode }}</oms-col>
                            <el-form-item label="启用时间" prop="startTime" class="form-item-30">
                                <el-date-picker
                                    v-model="form.startTime"
                                    type="datetime"
                                    placeholder="请选择启用时间" >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="截止时间" prop="endTime" class="form-item-30">
                                <el-date-picker
                                    v-model="form.endTime"
                                    type="datetime"
                                    placeholder="请选择截止时间" >
                                </el-date-picker>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
            </div>
            <div class="form-header-part">
                <div class="header">
                    <div class="sign f-dib"></div>
                    <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
                        {{ pageSets[1].name }}</h3>
                </div>
                <div v-show="!form.oldPointRelationId">
                    <div class="empty-info">
                        暂无信息
                    </div>
                </div>
                <el-form id="form1" :model="oldDataForm" :rules="oldRules" label-width="100px" ref="oldDataForm"
                         v-if="form.oldPointRelationId">
                    <div class="form-header-part">
                        <div class="content  mt-10">
                            <oms-col :isShow="true" label="仓库名称">{{ oldDataForm.warehouseName }}</oms-col>
                            <oms-col :isShow="true" label="点位名称">{{ oldDataForm.pointName }}</oms-col>
                            <oms-col :isShow="true" label="设备名称">{{ oldDataForm.devName }}</oms-col>
                            <oms-col :isShow="true" label="设备编码">{{ oldDataForm.devCode }}</oms-col>
                            <el-form-item label="启用时间" prop="startTime" class="form-item-30">
                                <el-date-picker
                                    v-model="oldDataForm.startTime"
                                    placeholder="请选择启用时间" type="datetime">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="截止时间" prop="endTime" class="form-item-30">
                                <el-date-picker
                                    v-model="oldDataForm.endTime"
                                    placeholder="请选择截止时间" type="datetime">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
            </div>
        </template>
    </dialog-template>
</template>
<script>
import methodsMixin from '@/mixins/methodsMixin';
import {PointRelation} from '@/resources';

export default {
    components: {},
    props: ['formItem', 'index'],
    mixins: [methodsMixin],
    data() {
        let checkStartTime = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择启用时间'));
            } else {
                if (this.form.endTime && (this.form.endTime <= this.form.startTime)) {
                    callback(new Error('启用时间必须小于截止日期'));
                } else {
                    callback();
                }
            }
        };
        let checkEndTime = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择截止日期'));
            } else {
                if (this.form.endTime && (this.form.endTime <= this.form.startTime)) {
                    callback(new Error('截止日期必须大于启用时间'));
                } else {
                    callback();
                }
            }
        };
        let checkOldStartTime = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择启用时间'));
            } else {
                if (this.oldDataForm.endTime && (this.oldDataForm.endTime <= this.oldDataForm.startTime)) {
                    callback(new Error('启用时间必须小于截止日期'));
                } else {
                    callback();
                }
            }
        };
        let checkOldEndTime = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择截止日期'));
            } else {
                if (this.oldDataForm.endTime && (this.oldDataForm.endTime <= this.oldDataForm.startTime)) {
                    callback(new Error('截止日期必须大于启用时间'));
                } else {
                    callback();
                }
            }
        };
        return {
            pageSets: [
                {name: '新设备信息', key: 0},
                {name: '旧设备信息', key: 1}
            ],
            currentTab: {},
            form: {},
            oldDataForm: {},
            doing: false,
            rules: {
                startTime: [
                    {required: true, message: '请选择新设备的启用时间', trigger: 'change'},
                    {validator: checkStartTime, trigger: 'blur'}
                ],
                endTime: [
                    {validator: checkEndTime, trigger: 'blur'}
                ]
            },
            oldRules: {
                startTime: [
                    {required: true, message: '请选择旧设备的启用时间', trigger: 'change'},
                    {validator: checkOldStartTime, trigger: 'blur'}
                ],
                endTime: [
                    {required: true, message: '请选择旧设备的截止时间', trigger: 'change'},
                    {validator: checkOldEndTime, trigger: 'blur'}
                ]
            }
        };
    },
    computed: {},
    watch: {
        index: function (val) {
            if (val !== 2) return;
            this.resetForm();
            this.form = Object.assign({}, this.formItem)
            if (this.form.oldPointRelationId) {
                this.queryOldDataInfo();
            }
        }
    },
    methods: {
        selectTab(item) {
            this.currentTab = item;
        },
        resetForm() {
            this.form = {};
        },
        queryOldDataInfo() {
            let oldPointRelationId = this.formItem.oldPointRelationId;
            if (!oldPointRelationId) return;
            this.$http.get(`/ccs-point-relation/${oldPointRelationId}`, {}).then(res => {
                this.oldDataForm = res.data;
            });
        },
        submit(formName) {
            this.$refs['tempForm'].validate((valid) => {
                if (!valid) return;
                if (this.form.oldPointRelationId) {
                    this.$refs['oldDataForm'].validate((valid) => {
                        if (valid && this.doing === false) {
                            this.save();
                        }
                    })
                } else {
                    if (valid && this.doing === false) {
                        this.save();
                    }
                }
            });
        },
        save() {
            // 组装数据
            let form = Object.assign({}, {
                pointRelationId: this.form.pointRelationId,
                devId: this.form.devId,
                pointId: this.form.pointId,
                startTime: this.form.startTime,
                endTime: this.form.endTime,
                oldPointRelationId: this.oldDataForm.pointRelationId,
                oldStartTime: this.oldDataForm.startTime,
                oldEndTime: this.oldDataForm.endTime
            });
            if (form.pointRelationId) {
                this.doing = true;
                this.$httpRequestOpera(PointRelation.audit(form.pointRelationId, form), {
                    successTitle: '审核成功',
                    errorTitle: '审核失败',
                    success: res => {
                        this.doing = false;
                        this.resetForm();
                        this.$emit('change', res.data);
                    },
                    error: () => {
                        this.doing = false;
                    }
                });
            }
        }
    }
};
</script>
