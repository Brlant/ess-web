<template>
    <div class="app-container">
        <div class="opera-btn-group">产品一览</div>
        <div class="search-area">
            <el-form ref="searchForm"  :inline="true" :model="searchModel">
                <el-form-item>
                    <el-input :clearable="true" placeholder="产品名称" v-model="searchModel.productName"
                              class="filter-item text-wt100"/>
                </el-form-item>
                <!-- 产品分类搜索 -->
                <el-form-item>
                     <el-input :clearable="true" placeholder="产品分类" v-model="searchModel.productCategory"
                              class="filter-item text-wt100"/>
                </el-form-item>
                <!-- 品牌搜索 -->
                <el-form-item>
                    <el-input :clearable="true" placeholder="品牌搜索" v-model="searchModel.brand"
                              class="filter-item text-wt100"/>
                </el-form-item>
                <!-- 型号搜索 -->
                <el-form-item>
                    <el-input :clearable="true" placeholder="型号搜索" v-model="searchModel.model"
                              class="filter-item text-wt100"/>
                </el-form-item>
            </el-form>
        </div>
        <div style="margin-bottom: 5px;padding-left:10px;">
            <el-button class="list_btn" type="primary" icon="el-icon-search" @click="initData">查询
            </el-button>
            <el-button class="list_btn" type="primary" icon="el-icon-refresh" @click="reset">重置
            </el-button>
                <el-button class="list_btn" type="primary" icon="el-icon-document-add" @click="addroute">新建
                </el-button>
        </div>
        <div class="order-list" style="margin-top: 20px">
            <el-row class="order-list-header">
                <el-col :span="2">序号</el-col>
                <el-col :span="5">产品名称</el-col>
                <el-col :span="5">产品分类</el-col>
                <el-col :span="5">操作</el-col>
            </el-row>
            <el-row v-if="loadingData">
                <el-col :span="24">
                   <oms-loading :loading="loadingData"></oms-loading>
                </el-col>
            </el-row>
            <el-row v-else-if="dataList.length == 0">
                <el-col :span="24">
                    <div class="empty-info">
                        暂无信息
                    </div>
                </el-col>
            </el-row> 
            <div class="order-list-body flex-list-dom">
                <div class="order-list-item" v-for="(item,index) in dataList" :key="index">
                    <el-row>
                        <el-col :span="2">{{numList(index)}}</el-col>
                        <el-col :span="5">{{item.productName}}</el-col>
                        <el-col :span="5">{{item.productCategory}}</el-col>
                        <el-col :span="5" class="opera-btn">                     
                            <des-btn icon="detail" v-has="'show'" @click="routerDetail(item.productId)" style="margin-right:10px;">详情</des-btn>
                            <des-btn icon="edit"  @click="routerEdit(item.productId)" v-has="'ccs-point-configuration-edit'" style="margin-right:10px;">修改
                            </des-btn>
                            <des-btn icon="delete" v-has="'ccs-point-warehouse-dev-delete'" @click="routerDelete(item.productId)">删除
                            </des-btn>
                        </el-col>
                    </el-row>
                    <div class="order-list-item-bg"></div>
                </div>
            </div>
        </div>

        <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
            <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                           :page-sizes="[10,20,50,100]"
                           :total="pager.count" @current-change="handleCurrentChange"
                           @size-change="handleSizeChange"
                           layout="total, sizes, prev, pager, next, jumper">
             </el-pagination>
        </div>
    </div>
</template>
<script>
import CommonMixin from '@/mixins/commonMixin';
import https from "../../../../https";
export default {
     mixins: [CommonMixin],
    name: "productList",
    data() {
        return {
            loadingData:false,
            //  面包屑
            listLoading: true, // 表格加载
            opts: {"moduleName": "product"}, // 一览查询处理选项参数
            tableKey: 0, // 表格列键值
            productCategoryList:[],
            //  租户下拉框
            tenantList: [],
            pager: {
                currentPage: 1,
                count: 0,
                pageSize: 10
            },
            searchModel:{
                pageNum: 0,
                pageSize: 0,
                /** 产品名称 */
                productName: null,
                /** 产品分类 */
                productCategory: null,
                /**接入方式 */
                accessMode:null,
                /**品牌搜索 */
                brand:null,
                /**型号搜索 */
                model:null, // 查询条件
          },
          dataList:[]
        };
    },
    created() {
        this.initData()
     },
    methods: {
         codeList(code){
            let codeObjStr = JSON.stringify(code).replace(/"/g, '')
            codeObjStr = codeObjStr.replace(/\{/g, '').replace(/\}/g, '')
            let codeObjAll = codeObjStr.split(',')
            let codeArr = [];
            for (let i = 0; i < codeObjAll.length; i++) {
                let codeObjEach = codeObjAll[i].split(':');
                let codeEach = {};
                codeEach.label = codeObjEach[1];
                codeEach.value = codeObjEach[0];
                codeArr.push(codeEach);

            }
            return codeArr;
        },
        //序号处理
        numList(num){  
          return (this.pager.currentPage-1)*this.pager.pageSize+num+1
        },
        //重置
        reset(){
             for(let key in this.searchModel){
                this.searchModel[key] = null;
            }
             this.pager.currentPage=1;
            this.pager.pageSize=10;
            this.initData()
        },
        handleSizeChange(val){
            this.pager.pageSize=val;
            console.log(this.pager.pageSize)
            this.initData();
        },
        handleCurrentChange(val){
              this.pager.currentPage=val;
              console.log(this.pager.currentPage)
              this.initData();
        },
        //初始化页面
        initData() {
            this.searchModel = {
            pageNo: this.pager.currentPage,
            pageSize: this.pager.pageSize,
            productName: this.searchModel.productName,
            /** 产品分类 */
            productCategory: this.searchModel.productCategory,
                /**品牌搜索 */
            brand:this.searchModel.brand,
                /**型号搜索 */
            model:this.searchModel.model, // 
            }
            var params=this.searchModel;
            https.get('/ccsProduct', params).then(res => {
                this.dataList=res.currentList
                this.pager.count=res.count
                
             })
        
        },
        addroute(){
            this.$router.push({path: '/temp/add'});
        },
        routerEdit(id){
            this.$router.push({name: 'updata',params: {id:id}});
        },
        routerDetail(id){
            this.$router.push({name: 'detail',
            params:{
                id:id
            },
            query:{type:'DETAIL'}});
        },
        routerDelete(id){
            this.$router.push({name: 'detail',
            params:{
                id:id
            },
            query:{type:'DETELE'}});
        }
    }
};
</script>

<style scoped>
.sidebar {
    height: 100%;
    background-color: rgb(84, 92, 100);
}
.order-list-item-bg{
    border-left:12px solid #fbf9f9!important;
}
.search-area{
    padding-left:10px;
}
.opera-btn-group{
    line-height: 50px;
    height: 50px;
    padding: 0 10px;
    border-bottom: 2px solid #eeeeee;
    font-size:16px;
    font-weight:500;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
}

.el-menu-vertical-demo {
    border-right: solid 0px;
}

.el-menu--collapse {
    width: auto;
}

.el-menu-item {
    min-width: 60px;
    text-align: left;
}

.font-awesome {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 16px;
    vertical-align: middle;
}

.img-div-bg{
    background:  linear-gradient(to right, #ffffffd6 ,  rgb(84, 92, 100));
}
.img-icon-bg{
    background-color: rgb(84, 92, 100);
}

.img-div{
    width: 100%;
    height: 71px;
    text-align: center;
    line-height: 71px;
}
.img-logo{
    width: 55px;
    height: 60px;
    display: inline-block;
    margin: 5px 0px;
}
.child-menu{
    padding-left: 47px !important;
}
</style>

