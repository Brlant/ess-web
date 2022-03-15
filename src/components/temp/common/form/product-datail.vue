<template>
    <div class="panel" style="width:100%">
        <div class="opera-btn-group" v-if="deleteFlag==false">产品一览/产品详情</div>
        <div class="opera-btn-group" v-if="deleteFlag==true">产品一览/产品删除</div>
        <div class="panel-body">
            <el-row class="tab-header">
        <span>
          <label style="font-size: 16px;font-weight:700;">产品名称：</label>
          <span class="header-text">
            {{operationModel.productName}}
          </span>
        </span>
                <el-divider direction="vertical"></el-divider>
                <span>
          <label style="font-size: 16px;font-weight:700;">产品分类：</label>
          <span class="header-text">
            {{operationModel.productCategory}}
          </span>
        </span>
            </el-row>
            <el-tabs v-model="activeName"  @tab-click="tabClick()">
                <el-tab-pane label="详细信息" name="baseInfo">
                    <!-- 详细信息 -->
                    <el-form ref="productDetailForm" :model="operationModel"
                             label-width="150px">

                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="产品名称" prop="productName">
                                    <el-input v-model="operationModel.productName" :readonly="true" maxlength="50"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="产品分类" prop="productCategoryName">
                                    <el-input v-model="operationModel.productCategory"  :readonly="true" maxlength="50"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="品牌" prop="brand">
                                    <el-input :readonly="true" v-model="operationModel.brand" maxlength="50"/>
                                </el-form-item>
                            </el-col>

                            <el-col :span="10">
                                <el-form-item label="型号" prop="model">
                                    <el-input :readonly="true" v-model="operationModel.model" maxlength="50"/>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="备注" prop="memo">
                                    <el-input type="textarea" rows="3" v-model="operationModel.remark" :readonly="true" placeholder="备注" maxlength="50"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="创建时间" prop="createTime">
                                    <el-input :value="parseDateTime(operationModel.createTime)" :readonly="true" maxlength="20"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>

                </el-tab-pane>
                <el-tab-pane label="属性模型" name="attributeInfo">
                    <div class="tab-button-div">
                       <el-button class="list_btn" type="primary" icon="el-icon-document-add"
                                   @click="showDialog('attributeSave',
                                { type:'Add', title:'属性新建',  productKey: operationModel.productKey,productId: productIds })">新建
                        </el-button>
                    </div>
                    <!-- 相关物模型 -->
                    <el-table :data="thingsModelList" border fit highlight-current-row
                              style="width: 100%;">

                        <!-- 属性名称 -->
                        <el-table-column label="属性名称" align="center">
                            <template slot-scope="scope">
                                <span>{{ scope.row.thingPropertyName }}</span>
                            </template>
                        </el-table-column>
                          <!-- 属性字段 -->
                        <el-table-column label="属性字段" align="center">
                            <template slot-scope="scope">
                                <span>{{ scope.row.thingPropertyValue }}</span>
                            </template>
                        </el-table-column>
                        <!-- 属性类型 -->
                        <el-table-column label="属性类型" align="center">
                            <template slot-scope="scope">
                                <span>{{ codeList(scope.row.thingPropertyType) }}</span>
                            </template>
                        </el-table-column>
                        <!-- 操作 -->
                        <el-table-column label="操作" align="center" width="355px"
                                         class-name="small-padding fixed-width">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-document"
                                           @click="showDialog('attributeDetail',{ type:'DETAIL', title:'属性详情', id: scope.row.thingPropertyId})">
                                    详情
                                </el-button>
                                <el-button type="success" size="mini" icon="el-icon-refresh"
                                          @click="showDialog('attributeSave',{ type:'UPDATE', title:'属性变更', id: scope.row.thingPropertyId,productId: productIds })">
                                    修改
                                </el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete"
                                           @click="showDialog('attributeDetail',{ type:'DELETE', title:'属性删除', id: scope.row.thingPropertyId })">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <div class="form-bottom-area">
                <el-button v-if="deleteFlag==true" type="danger"  size="medium" class="form-bottom-btn" @click="deleteData()">
                删除
                </el-button>
                <el-button @click.native.prevent="goFormBackPage" type="normal" class="form-bottom-btn" size="medium"> 返回
                </el-button>
            </div>
        </div>

        <!-- 模态窗口组件 -->
        <div>
            <component v-if="dialogObject.show" :is="dialogObject.componentName"
                 :dialog-show="dialogObject.show"
                 :trans-params="dialogObject.params"
                 @dialogCloseCallback="dialogCloseCallback"></component>
        </div>
    </div>
</template>
<script>
import attributeSave from "./attributeSave.vue";
import attributeDetail from "./attributeDetail.vue";
import https from "../../../../https";
export default {
     components: {
      attributeSave,
      attributeDetail
    },

        data() {
                return {
                     //  产品属性 - 属性类型
                    thingPropertyType:{
                      'INTEGER':'整数型',
                      'STRING':'字符型',
                      'BOOLEAN':'布尔型',
                      'FLOAT':'浮点型'
                    },
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
                    //产品id
                    productIds:this.$route.params.id,
                    //  默认tab选择 - 详细信息
                    activeName: 'baseInfo',
                    //  属性(物模型) 数据源
                    thingsModelList: [],
                    operationModel: {
                        productKey: null,
                        // 产品名称
                        productName: '',
                        // 产品秘钥
                        productSecret: null,
                        // 节点类型
                        nodeType: '',
                        // 产品分类
                        productCategory:'',
                        // 上报周期
                        reportingCycle: null,
                        // 上报周期单位
                        reportingCycleUnit: null,
                        // 创建时间
                        createTime: null,
                        // 备注
                        memo: '',
                        // 接入方式
                        accessMode:null,
                        // 品牌搜索
                        brand:null,
                        // 型号搜索
                        model:null,
                    },
                    //  页面是否为详情页面 - 默认 true详情页面
                    deleteFlag: true
                }
            },
    created() {
            this.deleteFlag = this.$route.query.type === "DETELE";
            this.productDetail()
            if(this.$route.query.type=='ADD'){
                this.activeName = 'attributeInfo'
            }
    },
    methods: {
         codeList(code){
        return code=this.thingPropertyType[code]

        },
        //产品详情
        productDetail(){
            https.get('/ccsProduct/'+this.productIds).then(res => {
                this.operationModel=Object.assign({},res)
             })

        },
         /** 获取物模型一览, 查询数据 */
        getThingModelList(){
             var productId=this.$route.params.id;
            https.get('/ccsThingProperty/list/'+productId).then(res => {
                this.thingsModelList=res
             })
        },
             /**
         * tab切换 方法 (切换不同的 tab时调用方法)
         */
        tabClick(){
            switch(this.activeName){
                case "baseInfo":
                    // this.productDetail(this);
                    break;
                case "attributeInfo":
                    this.getThingModelList();
                    break;
            }
        },
        showDialog(componentName, params){
            this.dialogObject.componentName = componentName;
            //  传入页面参数
            this.dialogObject.params = JSON.parse(JSON.stringify(params));
            this.dialogObject.show = true;
      },
        /**
       * 模态窗口 关闭回调
       * @param callback {moduleName: '模块名称', refresh: "1 刷新|0 不刷新"}
       */
      dialogCloseCallback(callback) {
        if (callback.refresh == "0") {
          let moduleName = callback.moduleName;
          switch(moduleName){
            case "thingsModel":
              this.getThingModelList();
              break;
            case "thingsRule":
              this.getAttrRuleInfo();
              break;
            case "attributeConvertRule":
              this.getAttrRuleInfo();
              break;
            case "eventInfo":
              this.getEventList();
              break;
            case "serviceInfo":
              this.getServiceList();
              break;
            default:
              break;
          }
        }
        this.dialogObject.show = false;
      },
        //删除设备
        deleteData(){
             this.$httpRequestOpera( https.destroy('/ccsProduct/'+this.productIds), {
                            successTitle: '删除成功',
                            errorTitle: '删除失败',
                            success: res => {
                                this.$router.push({path: '/temp/product'});
                            },
                            error: () => {
                            }
                        });
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
        goFormBackPage(){
            this.$router.back(-1);
        },
    },
    watch: {
        '$route': function () {
            if (this.$route.name === "scene-static") {
                this.mode = 2;
            } else if (this.$route.name === "scene-dynamic") {
                this.mode = 1;
            }
        },
    },
};
</script>
<style scoped>
.panel{
    padding:0px 0px 0px 30px;
}
.body-title {
    margin-top: 3px;
    margin-left: 1px;
    text-align: left;
}
.opera-btn-group{
    line-height: 50px;
    height: 50px;
    border-bottom: 2px solid #eeeeee;
    font-size:16px;
    font-weight:500;
}
.text-lf{
    text-align: left;
}
.form-bottom-area{
    margin-top:20px;
    text-align: center;
}
.tab-button-div{
    text-align: left;
    margin-bottom: 10px;
    width: 100%;
    height: 40px;
}
.list_btn {
    margin-bottom: 5px;
    margin-left: 5px;
    float: left;
}
.tab-header{
    text-align: left;;
    margin-bottom: 22px;
}
.header-text{
    font-size: 14px;
    color:#a8acb3;
}
</style>
