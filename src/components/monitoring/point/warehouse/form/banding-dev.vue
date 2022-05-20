<style lang="scss" scoped>
@import "../../../../../assets/scss/mixins";

$leftWidth: 0px;

.el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
}

.el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
}

.content-part {

    .content-left {
        width: $leftWidth;
    }

    .content-right {
        > h3 {
            left: $leftWidth;
        }

        left: $leftWidth;
    }
}
</style>
<template>
    <div>
        <div class="content-part">
            <div class="content-right min-gutter">
                <h3>添加点位设备绑定</h3>
                <el-form :model="form" :rules="rules" label-width="100px" ref="tempForm" style="padding-right: 20px">
                    <el-form-item label="点位名称">
                        {{ form.pointName }}
                    </el-form-item>
                    <el-form-item label="室内定位" prop="isLocation">
                        <el-switch
                            v-model="form.isLocation"
                            active-color="rgba(64, 158, 255, 1)"
                            inactive-color="rgba(220, 223, 230, 1)"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="设备类别" prop="devClass">
                        <el-radio-group v-model="form.devClass" @change="devClassChangeFn">
                            <el-radio :label="1">温湿度计</el-radio>
                            <el-radio :label="2">环控设备</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="设备类型" prop="devType">
                         <el-select v-model="form.devType" value-key="productId" filterable  @change="devTypeChangeFn" placeholder="请选择设备类型">
                            <el-option
                            v-for="(v, i) in devTypeList"
                            :key="v.productId"
                            :label="v.productName"
                            :value="v">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备" prop="devId">
                        <!-- 之前逻辑 <el-select :remote-method="reqDevFn" @click.once.native="reqDevFn('')" -->
                        <el-select 
                                   filterable
                                   placeholder="请输入名称搜索设备" popper-class="selects--custom" remote reserve-keyword
                                   v-model="form.devId" @change="setDevInfo">
                            <el-option :key="item.id" :label="item.devName" :value="item.id"
                                       v-for="(item, index) in allTempList">
                                <dev-option-info :item="item" :dev='form.devType'/>
                                <!-- {{ item.pointName }} -->
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备编码">
                        {{ form.devCode }}
                    </el-form-item>
                    <el-form-item label="启用时间" prop="startTime">
                        <el-date-picker
                            v-model="form.startTime"
                            type="datetime"
                            placeholder="请选择启用时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="截止时间" prop="endTime">
                        <el-date-picker
                            v-model="form.endTime"
                            type="datetime"
                            placeholder="请选择截止时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="是否已存在绑定的设备" class="mini-line-height-label" prop="currentDevFlag">
                        <el-radio-group v-model="form.currentDevFlag" @change="setCurrentDevFlag">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="原绑定设备" prop="oldPointRelationId" v-if="form.currentDevFlag">
                        <el-select filterable clearable placeholder="请输入名称搜索设备" popper-class="selects--custom" reserve-keyword
                                   v-model="form.oldPointRelationId" @change="setDevInfo">
                            <el-option :key="item.pointRelationId" :label="item.devName" :value="item.pointRelationId"
                                       v-for="(item, index) in pointRelationList">
                                <dev-option-info :item="item"/>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button :disabled="doing" @click="save('tempForm')" type="primary">
                            保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import methodsMixin from '@/mixins/methodsMixin';
import {PointRelation, TempDev} from '@/resources';

import https from "@/https";

export default {
    components: {},
    props: ['formItem', 'index', 'currentArea'],
    mixins: [methodsMixin],
    data() {
        let checkStartTime = (rule, value, callback) => {
            if (!value) {
                callback();
            } else {
                if (!this.form.endTime) {
                    callback();
                }
                let startTime = new Date(value).getTime();
                let endTime = new Date(this.form.endTime).getTime();
                if (startTime >= endTime) {
                    callback("启用时间必须小于截止时间");
                } else {
                    callback();
                }
            }
        };
        let checkEndTime = (rule, value, callback) => {
            if (!value) {
                callback();
            } else {
                if (!this.form.startTime) {
                    callback();
                }
                let startTime = new Date(this.form.startTime).getTime();
                let endTime = new Date(value).getTime();
                if (endTime <= startTime) {
                    callback("截止时间必须大于启用时间");
                } else {
                    callback();
                }
            }
        };
        return {
            form: {
                devId: '',
                devCode: '',
                startTime: '',
                endTime: '',
                oldPointRelationId: '',
                currentDevFlag: '',
                pointName: '',
                isLocation : true,
                devType : '',
                devClass : 1
            },
            devTypeList : [],
            doing: false,
            rules: {
                devId: [
                    {required: true, message: '请选择设备', trigger: 'change'}
                ],
                oldPointRelationId: [
                    {required: true, message: '请选择原绑定设备', trigger: 'change'}
                ],
                currentDevFlag: [
                    {required: true, message: '请选择是否存在当前设备', trigger: 'change'}
                ],
                startTime: [
                    {required: true, message: '请选择启用时间', trigger: 'change'},
                    {validator: checkStartTime, trigger: 'blur'}
                ],
                endTime: [{validator: checkEndTime, trigger: 'blur'}]
            },
            pointRelationList: [],
            tempTypeList: [
                {  
                    productName : '有线温度计',
                    productId : 0
                }, 
                {  
                    productName : '无线温度计',
                    productId : 1
                }, 
                {  
                    productName : '冷柜温度计',
                    productId : 2
                }, 
                {  
                    productName : '车载温度计',
                    productId : 3
                }, 
                {  
                    productName : '湿度计',
                    productId : 4
                }
                
            ],
        };
    },
    computed: {},
    watch: {
        index: function (val) {
            this.allTempList = [];
            this.devTypeList = [] ;
            if (val !== 3) return;
            this.$refs['tempForm'].resetFields();
            this.form = {
                devId: '',
                devCode: '',
                startTime: '',
                endTime: '',
                oldPointRelationId: '',
                currentDevFlag: '',
                pointName: '',
                isLocation : true,
                devType : '',
                devClass : 1
            };
            this.form.devCode = '';
            this.form.pointName = this.formItem.pointName;
            
            // 查询设备
            // this.reqDevFn(); // 


            this.reqDevTypeFn() ;


            // 查询旧设备绑定记录
            this.queryPointRelationRecord();
        },
        currentArea(){
        }
    },
    mounted(){},
    methods: {
        reqDevTypeFn(){
            this.form.devType = {} ;
            this.devTypeList = [] ;
            this.form.devId = '' ;
            this.form.devCode = '' ;

            if( this.form.devClass === 1 ){
                this.devTypeList = this.tempTypeList ;
            } else {
                this.devTypeListFn() ; // 请求 环控设备
            }
        },

        devTypeListFn(){ // 请求 环控设备
            https.get('/ccsProduct/list/all').then(res => {
                this.devTypeList = res ; 
            })
        },

        reqDevFn(query){
            TempDev.queryALLTempByLike({searchVal: query}).then(res => {
                res.data.currentList.forEach(i => (i.disabled = false));
                this.allTempList = res.data.currentList;
                this.setTempListWhenEdit && this.setTempListWhenEdit();
            }) ;
        },
        setCurrentDevFlag() {
            if (!this.form.currentDevFlag && this.form.oldPointRelationId) {
                this.form.oldPointRelationId = '';
            }
        },
        setDevInfo(devId) {
            if (devId) {
                this.allTempList.forEach(i => {
                    if (i.ccsDevId === devId) {
                        this.form.devCode = i.devCode;
                    }
                })
            }
        },
        resetForm() {
            this.form = {
                pointRelationList: '',
                devCode: '',
                startTime: '',
                endTime: '',
                oldPointRelationId: '',
                currentDevFlag: '',
                pointName: ''
            };
        },
        queryPointRelationRecord() {
            let pointId = this.formItem.id;
            this.$http.get(`/ccs-point-relation/list/${pointId}`, {}).then(res => {
                this.pointRelationList = res.data;
            });
        },
        setPointRelation() {
            this.form = Object.assign({}, {
                // yxh 之前逻辑
                // ccsWarehouseId: this.formItem.warehouseId,
                ccsWarehouseId: this.currentArea.id,

                pointId: this.formItem.id,
            }, this.form);
        },
        save(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && this.doing === false) {
                    // 组装数据
                    this.setPointRelation();
                    let form = JSON.parse(JSON.stringify(this.form));
                    this.doing = true;
                    form.devType = form.devType.productId;
                    form.isLocation = form.isLocation ? 1 : 0;
                    console.error( 'save: ', form, form.isLocation ) ;
                    this.$httpRequestOpera(PointRelation.save(form), {
                        successTitle: '添加成功',
                        errorTitle: '添加失败',
                        success: res => {
                            this.doing = false;
                            this.resetForm();
                            this.$emit('refresh');
                        },
                        error: () => {
                            this.doing = false;
                        }
                    });
                }
            });

        },

        devClassChangeFn( val ){
            this.reqDevTypeFn() ;
            console.error( val ) ;
        },


        reqAllDevListByDevTypeFn( devType ){ // 请求设备
            let params = { devType } ;


            TempDev.reqAllDevListByDevType( params ).then(res => {
                let { data } = res ;

                if( data ){
                    data.forEach(v => (v.disabled = false));
                    this.allTempList = data ;
                    this.setTempListWhenEdit && this.setTempListWhenEdit();
                }

                // res.data.currentList.forEach(i => (i.disabled = false));
                // this.allTempList = res.data.currentList;
                // this.setTempListWhenEdit && this.setTempListWhenEdit();
            }) ;

        },

        devTypeChangeFn( val ){
            this.form.devId = '' ; // 重置设备
            this.form.devCode = '' ; // 重置设备编码

            this.reqAllDevListByDevTypeFn( val.productId ) ;
        },

    }
};
</script>
