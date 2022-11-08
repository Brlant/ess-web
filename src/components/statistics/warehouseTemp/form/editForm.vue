<template>
    <dialog-template :btnSavePosition="100">
        <template slot="title">添加任务</template>
        <template slot="btnSave">
            <el-button :disabled="doing" @click="save()" plain type="primary">保存</el-button>
        </template>
        <template slot="content">
            <el-form :model="form" label-width="100px" ref="tempForm" :rules="formRules">
                <el-form-item label="任务名称" prop="taskName">
                    <oms-input placeholder="请输入任务名称" type="text" v-model="form.taskName"/>
                </el-form-item>
                <el-form-item label="添加人">
                    <span>{{ form.creator }}</span>
                </el-form-item>
                <el-form-item label="库区范围" prop="configWarehouseIds">
                    <el-cascader style="width: 100%" ref="refWare" collapse-tags popper-class="warePopperClass"
                                 v-model="form.configWarehouseIds"  filterable :options="options"
                                 :props="wareProp" clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="查询时间" prop="taskDate">
                    <el-date-picker
                        v-model="form.taskDate"
                        type="date"
                        :picker-options="pickerOptions"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </template>
    </dialog-template>
</template>

<script>
import {WarehouseTemp} from '@/resources';

export default {
    name: "editForm",
    props: {
        options: {
            type: Array,
            require: true,
        }
    },
    data() {
        return {
            form: {
                creator: '',
                taskName: '',
                taskDate: '',
                taskType: 2,
                configWarehouseIds: []
            },
            doing: false,
            formRules: {
                taskName: [{required: true, message: '请输入自动巡检任务配置名称', trigger: 'blur'}],
                taskDate: [{required: true, message: '请输入查询时间', trigger: 'change'}],
                configWarehouseIds: [{type: 'array', required: true, message: '请选择对应的库区范围', trigger: ['blur','change']}],
            },
            wareProp: {
                value: 'warehouseId',
                label: 'warehouseCode',
                children: 'childWarehouseList',
                multiple: true
            },
            pickerOptions: {
                disabledDate: (time) => {
                    let newTime = this.$moment().startOf('day').add(-1);
                    return this.$moment(time) > newTime;
                },
            },
            userName: '',
        }
    },
    created() {
        this.userName = window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')).userName : '';
        this.form.creator = this.userName;

    },
    methods: {
        save() {
            this.$refs.tempForm.validate(validate => {
                if (!validate) return
                this.doing = true;
                let param = this.form;
                let detailList = [];
                this.form.configWarehouseIds.forEach(item => {
                    let detailInfo = {};
                    if (this.isEdit) {
                        detailInfo.configId = this.form.id;
                    }
                    if (item.length > 0) {
                        detailInfo.logisticsId = item[0];
                        detailInfo.warehouseId = item[1] || null;
                        detailInfo.areaId = item[2] || null;
                    }
                    detailList.push(detailInfo)
                })
                param.taskDate = this.$moment(this.form.taskDate).format('YYYY-MM-DD')
                param.detailList = detailList
                delete param.creator;
                delete param.configWarehouseIds;
                WarehouseTemp.addTask(param).then(res => {
                    this.$message.success('保存成功')
                    this.$emit('change')
                    this.doing = false
                }).catch(err => {
                    this.$message.error('保存失败' + err.msg)
                    this.doing = false
                })

            })
        },
        resetForm() {
            this.form = {
                creator: this.userName,
                taskName: '',
                taskDate: '',
                taskType: 2,
                configWarehouseIds: []
            }
            this.$nextTick(() => {
                if (this.$refs.tempForm) {
                    this.$refs['tempForm'].resetFields();
                }
            })

        },
    }
}
</script>

<style scoped>

</style>
