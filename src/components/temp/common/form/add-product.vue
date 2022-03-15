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
                <el-form-item label="设备编号devNo" prop="devNo">
                    <oms-input placeholder="请输入设备编号" type="input" v-model="form.devNo"/>
                </el-form-item>
                <el-form-item label="设备类型" prop="devType">
                    <!-- <el-date-picker placeholder="请选择" type="date" v-model="form.typeProduct" value-format="timestamp"/> -->
                     <el-select v-model="form.devType" placeholder="" style="display: unset;">
                                <!-- <el-option key="" label="" value=""></el-option> -->
                                <el-option
                                    v-for="(item,index) in nodeType"
                                    :key="index"
                                    :label="item.productName"
                                    :value="item.productId">
                                </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="是否有视频" prop="isVideo">                
                        <el-radio v-model="form.isVideo" label="1"  @change="changes">是</el-radio>
                        <el-radio v-model="form.isVideo" label="0"  @change="changes">否</el-radio>
                </el-form-item>
                <el-form-item label="视频地址">
                    <oms-input placeholder="请输入视频地址" type="input" v-model="form.videoUrl" :readonly="urlAble"/>
                </el-form-item>
                <el-form-item label="备注">
                    <oms-input placeholder="请输入备注" type="textarea" v-model="form.comment"/>
                </el-form-item>
                <el-form-item label="状态" prop="devStatus">
                    <el-switch active-text="启用" active-value="1" inactive-text="停用" inactive-value="0"
                               v-if="type !== 2" v-model="form.devStatus"></el-switch>
                    <el-select placeholder="请选择状态" v-if="type === 2" v-model="form.devStatus">
                        <el-option :key="key" :label="item.title" :value="item.status"
                                   v-for="(item, key) in statusType" v-show="item.status !== null"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </template>
    </dialog-template>
</template>
<script>
import {TempDev} from '@/resources';
import https from "../../../../https";

export default {
    data() {
        return {
            form: {},
            doing: false,
            nodeType:[],
            urlAble:false,
            rules: {
                devCode: [
                    {required: true, message: '请输入编码', trigger: 'blur'}
                ],
                devName: [
                    {required: true, message: '请输入名称', trigger: 'blur'}
                ],
                devNo: [
                    {required: false, message: '请输入设备编号', trigger: 'blur'}
                ],
                devType: [
                    {required: true, message: '请选择设备类型', trigger: 'blur'}
                ],
                isVideo: [
                    {required: true, message: '请选择是否有视频', trigger: 'blur'}
                ],
                devStatus: [
                    {required: true, message: '请选择状态', trigger: 'blur'}
                ]
            },
            actionType: '添加'
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
                 console.log(this.form.isVideo)
                 if(this.form.isVideo=='1'){
                     this.urlAble=false
                 }else{
                     this.urlAble=true
                    //  this.form.videoUrl=null
                 }
                this.actionType = '编辑';
            } else {
                this.form = {
                    devCode: null,
                    devName: null,
                    devStatus: '1',
                    devType: null,
                    comment: null,
                    devNo: null,
                    monitorStatus:'0',
                    //是否有视频
                    isVideo:'1',
                    //视频地址
                    videoUrl:null
                };
                this.actionType = '添加';
            }
        }
    },
    created(){
        this.typeDev()
    },
    methods: {
        changes(){
             if(this.form.isVideo=='1'){
                     this.urlAble=false
                 }else{
                     this.urlAble=true
                     this.form.videoUrl=null
                 }
        },
        //设备类型
        typeDev(){
            https.get('/ccsProduct/list/all').then(res => {
                this.nodeType=res;
                
             })
        },
        save(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && this.doing === false) {
                    // this.form.createTime = this.form.createTime ? this.$moment(this.form.createTime).format('YYYY-MM-DD') : '';
                    if (!this.form.id) {
                        // this.form.devType = '' + (this.type - 1);
                        this.actionType = '编辑';
                        this.doing = true;
                        this.$httpRequestOpera(https.post('/ccsDevice',this.form), {
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
        }
    }
};
</script>
