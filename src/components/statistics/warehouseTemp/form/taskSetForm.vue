<template>
    <dialog-template :btnSavePosition="100">
        <template slot="title">自动任务设置</template>
        <template slot="content">
            <div v-show="!isShow">
                <el-row style="margin-bottom: 10px;text-align: end">
                    <el-button @click="handleAddClick()"  plain type="primary" v-has="'ccs-auto-check-config-add'" size="small">添加</el-button>
                </el-row>
                <el-table  :data="tableData" v-loading="tableLoad"  border  style="width: 100%">
                    <el-table-column    label="添加时间"    width="150">
                        <template slot-scope="{row}">
                            <span>{{formatMsToTime(row.createTime)}}</span>
                        </template>
                    </el-table-column >
                    <el-table-column   prop="configName"  label="定时任务名称"   />
                    <el-table-column   prop="creator"     label="添加人" width="120"/>
                    <el-table-column  label="操作"  width="160">
                        <template slot-scope="scope">
                            <el-button @click="handleEditClick(scope.row)" type="text" size="small"  v-has="'ccs-auto-check-config-edit'">编辑</el-button>
                            <el-popconfirm title="确定删除该条任务吗？"  @confirm="deleteConfirm(scope.row)" v-has="'ccs-auto-check-config-del'">
                                <el-button type="text" size="small" slot="reference">删除</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="isShow">
                <el-form :model="form" label-width="100px" ref="tempForm" :rules="formRules">
                    <el-form-item label="任务名称" prop="configName">
                        <oms-input placeholder="请输入任务名称" type="input" v-model="form.configName"/>
                    </el-form-item>
                    <el-form-item label="添加时间规则">
                       <span>每天一次</span>
                    </el-form-item>
                    <el-form-item label="添加人">
                        <span>{{form.creator}}</span>
                    </el-form-item>
                    <el-form-item label="库区范围" prop="configWarehouseIds">
                        <el-cascader  style="width: 100%" collapse-tags ref="refWare"  filterable popper-class="warePopperClass"  v-model="form.configWarehouseIds"  :options="options" :props="wareProp" clearable>
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="查询时间" prop="configTime">
                        <el-time-picker
                            v-model="form.configTime"
                            format="HH:mm"
                            placeholder="任意时间点">
                        </el-time-picker>
                    </el-form-item>
                </el-form>
                <el-row>
                    <el-button @click="handleSave()" :disabled="isBthDisabled" plain type="primary" size="small">保存</el-button>
                    <el-button @click="isShow=false" plain type="primary" size="small">取消</el-button>
                </el-row>
            </div>
        </template>
    </dialog-template>
</template>

<script>
import {WarehouseTemp} from '@/resources';
export default {
    name: "taskSetForm",
    props:{
        options:{
            type:Array,
            require:true,
        }
    },
    data() {
        return {
            isEdit:false,
            isBthDisabled:false,
            isShow:false,
            tableLoad:false,
            form: {
                creator:'',
                configName:'',//自动巡检任务配置名称
                configType: 1, //自动巡检任务配置时间规则：1：每天一次
                configTime: '',
                configWarehouseIds:[]
            },
            tableData: [],
            wareProp: {
                value: 'warehouseId',
                label: 'warehouseCode',
                children: 'childWarehouseList',
                multiple: true
            },
            formRules:{
                configName: [{required: true,message:'请输入自动巡检任务配置名称', trigger: 'blur'}],
                configTime: [{required: true,message:'请输入查询时间', trigger: 'change'}],
                configWarehouseIds: [{ type: 'array', required: true,message:'请选择对应的库区范围', trigger: ['blur','change']}],
            }
        }
    },
    mounted() {
        this.initConfig();
    },
    methods: {
        initConfig(){
            this.tableLoad=true;
            WarehouseTemp.queryConfigAll().then(res=>{
               this.tableData=res.data['configList'];
                this.tableLoad=false;
            }).catch(()=>{
                this.tableLoad=false;
            })
        },
        handleEditClick(val) {
            this.isEdit=true;
            WarehouseTemp.queryConfigById(val.id).then(res=>{
                let info=res.data;
                this.form=info;
                if(info.configTime){
                    let time = this.$moment().format('YYYY-MM-DD ' + this.form.configTime)
                    this.form.configTime = time
                }
                if(info.detailList&&info.detailList.length>0){
                    let list=[]
                    info.detailList.forEach(item=>{
                        if(item.areaId!=null) return  list.push([item.logisticsId,item.warehouseId,item.areaId]);
                        if(item.warehouseId!=null) return  list.push([item.logisticsId,item.warehouseId]);
                        if(item.logisticsId!=null)  return  list.push([item.logisticsId]);
                    })
                    this.form.configWarehouseIds=list;
                }
                this.isShow=true;
            })
        },
        handleAddClick() {
            this.isEdit=false;
            let time=this.$moment().format('YYYY-MM-DD 9:00')
            this.form={
                configName:'',
                configType: 1,
                configWarehouseIds:[],
                configTime:time
            }
            this.form.creator=window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')).userName : '';
            this.isShow=true;
        },
        handleSave(){
           this.$refs.tempForm.validate(validate=>{
               if(!validate) return
               this.isBthDisabled=true;
               let param=this.form;
               this.form.configTime=this.formatMsToTime(this.form.configTime)
               param.configTime=this.form.configTime.slice(11,this.form.configTime.length-3)
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
               if(this.isEdit){
                   WarehouseTemp.editConfig(param).then(res=>{
                       this.restForm();
                       this.initConfig();
                       this.$message.success('修改成功')
                   }).catch(err=>{
                       this.$message.error('修改失败'+err.msg)
                       this.isBthDisabled=false
                   })
               }else{
                   WarehouseTemp.addConfig(param).then(res=>{
                       this.restForm();
                       this.initConfig();
                       this.$message.success('保存成功')
                   }).catch(err=>{
                       this.$message.error('保存失败'+err.msg)
                       this.isBthDisabled=false
                   })
               }
           })
        },
        formatMsToTime(val){
            return val==''?val:this.$moment(val).format('YYYY-MM-DD HH:mm:ss')
        },
        deleteConfirm(item){
           if(item.id){
               WarehouseTemp.deleteConfig(item.id).then(res=>{
                   this.$message.success('删除成功');
                   this.initConfig();
               }).catch(err=>{
                   this.$message.error('删除失败'+err.msg)
               })
           }
        },
        restForm(){
            this.form={
                configName:'',
                configType: 1,
                configWarehouseIds:[],
                configTime:''
            }
            this.isBthDisabled=false
            this.isShow=false;
            this.tableData=[];
            this.$nextTick(()=>{
                if(this.$refs.tempForm){
                    this.$refs['tempForm'].resetFields();
                    this.$refs.tempForm.clearValidate();
                }
            })
        },
    }
}
</script>

<style scoped>
.warePopperClass{
    width: 600px;
}
</style>
