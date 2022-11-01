<template>
    <dialog-template :btnSavePosition="100">
        <template slot="title">添加任务</template>
        <template slot="btnSave">
            <el-button :disabled="doing" @click="save()" plain type="primary">保存</el-button>
        </template>
        <template slot="content">
            <el-form :model="form" label-width="100px" ref="tempForm"  :rules="formRules">
                <el-form-item label="任务名称" prop="configName">
                    <oms-input placeholder="请输入任务名称" type="text" v-model="form.configName"/>
                </el-form-item>
                <el-form-item label="添加人">
                    <span>{{form.creator}}</span>
                </el-form-item>
                <el-form-item label="库区范围" prop="configWarehouseIds">
                    <el-cascader  style="width: 100%" popper-class="warePopperClass"  v-model="form.configWarehouseIds"   :options="options" :props="wareProp" clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="查询时间" prop="configTime">
                    <el-date-picker
                        v-model="form.configTime"
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
    data(){
        return{
            form:{
                creator:'',
                configName:'',
                configTime: '',
                configWarehouseIds:[]
            },
            doing:false,
            formRules:{
                configName: [{required: true,message:'请输入自动巡检任务配置名称', trigger: 'blur'}],
                configTime: [{required: true,message:'请输入查询时间', trigger: 'change'}],
                configWarehouseIds: [{ type: 'array', required: true,message:'请选择对应的库区范围', trigger: 'blur'}],
            },
            wareProp: {
                value: 'warehouseId',
                label: 'warehouseCode',
                children: 'childWarehouseList',
                multiple: true,
                checkStrictly: true
            },
            options: [],
            pickerOptions: {
                disabledDate: (time) => {
                    return this.$moment(time) > this.$moment();
                },
            },
        }
    },
    created() {
        this.form.creator=window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')).userAccount : '';
        WarehouseTemp.gainWarehouseWithChildList().then(res=>{
            this.options=res.data['warehouseList']
        })
    },
    methods:{
        save(){
            this.$refs.tempForm.validate(validate=>{
                if(!validate) return
                this.doing=true;
                let param=this.form;
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
                param.detailList = detailList
                delete param.creator;
                delete param.configWarehouseIds;
                WarehouseTemp.addTask(param).then(res => {
                    this.$message.success('保存成功')
                    this.doing = false
                }).catch(err => {
                    this.$message.error('保存失败' + err.msg)
                    this.doing = false
                })

            })
        }
    }
}
</script>

<style scoped>

</style>
