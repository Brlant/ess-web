<template>
    <div class="panel" style="width:100%">
<!--        <Breadcrumb :crumbList="crumbList"/>-->
        <div class="opera-btn-group" v-if="addFlag==false">产品一览/产品变更</div>
        <div class="opera-btn-group" v-if="addFlag==true">产品一览/产品添加</div>
        <div class="panel-body">
            <el-form ref="productForm" v-loading="formLoading" :model="operationModel" :rules="productRules" 
                     label-width="150px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="产品名称" prop="productName">
                            <el-input v-model="operationModel.productName" maxlength="200"></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="10">
                        <el-form-item label="产品分类" prop="productCategory">
                            <el-input v-model="operationModel.productCategory" maxlength="50"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="10">
                        <el-form-item label="品牌" prop="brand">
                            <el-input :clearable="true" v-model="operationModel.brand" maxlength="50"/>
                        </el-form-item>
                    </el-col>

                    <el-col :span="10">
                        <el-form-item label="型号" prop="model">
                            <el-input :clearable="true" v-model="operationModel.model" maxlength="50"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20">
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" rows="3" v-model="operationModel.remark" placeholder="备注" maxlength="1000"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="!addFlag">
                    <el-col :span="10">
                        <el-form-item label="创建时间" prop="createTime">
                            <el-input :value="parseDateTime(createdtime)" :disabled="true" maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="addFlag">
                    <el-col :span="5">
                        <el-form-item label="">
                            <el-checkbox v-model="continueAdd">是否继续添加物模型</el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="form-bottom-area" style="display: flex;justify-content: center;">
                    <el-button  type="primary" class="form-bottom-btn" align="center" @click="commitForm()">
                        确定
                    </el-button>

                    <el-button @click.native.prevent="goFormBackPage" type="normal" class="form-bottom-btn"
                               align="center"> 返回
                    </el-button>

                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import https from "../../../../https";

export default {
    // name: "productSave",
    // components: { Breadcrumb },
    data() {
        return {
              //  模态窗口应用对象
                    dialogObject: {
                    //  模态窗口 显示标识
                    show: false,
                    //  模态窗口 显示组件名称
                    componentName: '',
                    //  模态窗口 传递参数
                     params: {
                        }
                    },
            //  页面是否为添加页面 - 默认 true 添加页面
            addFlag: true,
            /** 页面表单调用共同 参数  */
            opts: {
                'moduleName': 'product',
                'formName': 'productForm',
                //  添加/修改后的回调方法
                'afterFn': (res) => {
                    if(res =='response_business_error'){
                        return ;
                    }
                    //  判断是否跳转标识
                    if(this.continueAdd){
                        this.$router.push({
                            name: 'productdetail',
                            params: {
                                id: res
                            },
                            query:{ type:'PRODUCTADD' }
                        });
                    }else{
                        this.goListPage();
                    }
                },
                //  detailKey(详细接口参数)
                'detailKey': '',
                //  detail详细 回调方法
                'afterDetailFn': (res) => {this.operationModel = res}
            },
            /** 表单 刷新标志位 */
            formLoading: false,
            /** 按钮 刷新标志位 */
            btnLoading: false,
            /** 页面处理model */
            operationModel: {
                // productKey: null,
                // 产品名称
                productName: '',
                // 产品分类
                productCategory:'',
                // 备注
                remark: '',
                // 品牌搜索
                brand:null,
                // 型号搜索
                model:null,
            },
            createdtime:null,
            //  租户名称
            // tenantName: JSON.parse(localStorage.getItem("userInfo")).tenantName,
            tenantName:'111',
            /** 产品分类集合 */
            productCategoryList: [],
            //  是否继续添加物模型
            continueAdd: true,
            ruleForm:{
                productName:'',
                nodeType:'',
                reportingCycle:''
            },
            productRules:{
                productName: [
                    { required: true, message: '请输入产品名称', trigger: 'blur' },
                ],
                nodeType: [
                    { required: true, message: '请选择节点类型', trigger: 'change' }
                ],
                reportingCycle: [
                    { required: true, message: '请填写上报周期', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        let productId = this.$route.params.id;
        //  存在产品Id 则为修改, 否则为新增
        this.addFlag = productId || productId==0? false: true;
        if(!this.addFlag){
            this.opts.detailKey = productId;
            this.continueAdd = false;
            this.productUpdate()
        }else{
            //  清空form
            for(let key in this.operationModel){
                this.operationModel[key] = null;
            }
        }
    },
    methods: {
         showDialog(componentName, params){
            this.dialogObject.componentName = componentName;
            //  传入页面参数
            this.dialogObject.params = JSON.parse(JSON.stringify(params));
            this.dialogObject.show = true;
      },
        //更改页面默认数据
        productUpdate(){
           var productId=this.$route.params.id;
           https.get('/ccsProduct/'+productId).then(res => {
                 for(let key in this.operationModel){
                this.operationModel[key] = res[key];
            }
            this.createdtime=res.updateTime
             })

        },
        // 时间戳转日期
        goFormBackPage(){
            this.$router.back(-1);
        },
          //时间格式化
        parseDateTime(time, cFormat) {
            if (!time) {
                return '';
            }
            if (arguments.length === 0) {
                return null
            }
            const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
            let date
            if (typeof time === 'object') {
                date = time
            } else {
                if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
                    time = parseInt(time)
                }
                if ((typeof time === 'number') && (time.toString().length === 10)) {
                    time = time * 1000
                }
                date = new Date(time)
            }
            const formatObj = {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                i: date.getMinutes(),
                s: date.getSeconds(),
                a: date.getDay()
            }
            const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
                let value = formatObj[key]
                // Note: getDay() returns 0 on Sunday
                if (key === 'a') {
                    return ['日', '一', '二', '三', '四', '五', '六'][value]
                }
                if (result.length > 0 && value < 10) {
                    value = '0' + value
                }
                return value || 0
            })
            return time_str
        },
        /**
         * 提交form 表单
         */
        commitForm(){
            if(this.addFlag){
                this.create();
            }else{
                this.update();
            }
        },
        //添加
        create() {
            var params=this.operationModel;
             this.$httpRequestOpera( https.post('/ccsProduct',params), {
                    successTitle: '添加成功',
                    errorTitle: '添加失败',
                    success: res => {
                    console.log(res)
                        if(this.continueAdd){
                        this.$router.push({
                           name: 'detail',
                            params: {
                                id: res
                            },
                            query:{ type:'ADD' }
                            });
                        }else{             
                            this.goListPage(); 
                        }
                        
                     },
                    error: () => {
                    }
                });
        },
        //更改
        update() {
            var id={productId:this.$route.params.id};
            var params=Object.assign(this.operationModel,id)
             this.$httpRequestOpera( https.put('/ccsProduct',params), {
                            successTitle: '修改成功',
                            errorTitle: '修改失败',
                            success: res => {
                                this.goListPage()
                            },
                            error: () => {
                            }
                        });
        },
        // 保存完毕后跳转页面 
        goListPage(){
            this.$router.push({path: '/temp/product'});
         },
    }
};
</script>

<style scoped>
.opera-btn-group{
    line-height: 50px;
    height: 50px;
    padding: 0 10px;
    border-bottom: 2px solid #eeeeee;
    font-size:16px;
    font-weight:500;
}
.report-tips{
    margin-left: 150px;
    margin-bottom: 22px;
    text-align: left;
    font-size: 14px;
    color:#a8acb3;
}
/** 上报周期单位 */
.reportingCycle-unit{
    margin-left: 5px;
    text-align: left;
    line-height: 40px;
}
</style>
