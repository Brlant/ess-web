<template>
    <div class="order-page">
         <search-template :isShow="showSearch" :isShowAdvance="false" :midSpan="0" @isShow="isShow" @reset="reset"
                     @search="search">
            <template slot="btn">
                <el-button @click="add" plain size="small">
                    <f-a class="icon-small" name="plus"></f-a>
                    添加
                </el-button>
            </template>
        <template slot="title">环控设备管理</template>
        <template slot="content">
            <el-form class="advanced-query-form" onsubmit="return false">
                <el-col :span="8">
                    <oms-form-row :span="8" label="设备编码devCode">
                        <oms-input @keyup.native.enter="search" placeholder="请输入设备编码devCode"
                                   v-model.trim="searchCondition.devCode"></oms-input>
                    </oms-form-row>
                </el-col>
                <el-col :span="8">
                    <oms-form-row :span="8" label="设备编号devNo">
                        <oms-input @keyup.native.enter="search" placeholder="请输入设备编号devNo"
                                   v-model.trim="searchCondition.devNo"></oms-input>
                    </oms-form-row>
                </el-col>
                <el-col :span="8">
                    <oms-form-row :span="4" label="名称">
                        <oms-input @keyup.native.enter="search" placeholder="请输入名称"
                                   v-model.trim="searchCondition.devName"></oms-input>
                    </oms-form-row>
                </el-col>
                <el-col :span="8">
                    <oms-form-row :span="8" label="类型">
                        <el-select @change="search" placeholder="请选择设备类型" v-model="searchCondition.devType">
                            <el-option :key="index"
                                    :label="item.productName"
                                    :value="item.productId"
                                    v-for="(item, index) in tempTypeList"></el-option>
                        </el-select>
                    </oms-form-row>
                </el-col>
            </el-form>
        </template>
    </search-template>
        <div class="order-list" style="margin-top: 20px">
            <el-row class="order-list-header">
                <el-col :span="5">设备编码devCode</el-col>
                <el-col :span="3">设备编号devNo</el-col>
                <el-col :span="4">名称</el-col>
                <el-col :span="4">类型</el-col>
                <el-col :span="3">状态</el-col>
                <el-col :span="2">操作</el-col>
            </el-row>
            <el-row v-if="loadingData">
                <el-col :span="24">
                    <oms-loading :loading="loadingData"></oms-loading>
                </el-col>
            </el-row>
            <el-row v-else-if="!dataList.length">
                <el-col :span="24">
                    <div class="empty-info">
                        暂无信息
                    </div>
                </el-col>
            </el-row>
            <div class="order-list-body flex-list-dom">
                <div>
                    <div class="order-list-item" v-for="(item,index) in dataList" :key="index"  @click="showItemDetail(item)">
                        <el-row>
                            <el-col :span="5" class="R">{{ item.devCode }}</el-col>
                            <el-col :span="3" class="R">{{ item.devNo }}</el-col>
                            <el-col :span="4" class="R">{{ item.devName }}</el-col>
                            <el-col :span="4">{{ item.devTypeName }}</el-col>
                            <el-col :span="3">
                                {{ formatStatus(item.devStatus, item.devType !== '1' ? orderType : wifiType) }}
                            </el-col>
                            <el-col :span="2 " class="opera-btn">
                                <des-btn @click="edit(item)" icon="edit">编辑</des-btn>
                            </el-col>
                        </el-row>
                    </div>
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

        <page-right :css="defaultPageRight" :show="showIndex !== -1" @right-close="resetRightBox">
            <component :batchType="batchType" :formItem="form" :index="showIndex" :is="currentPart"
                       :statusType="statusType" :typeName="currentType"
                       @change="change"
                       @right-close="resetRightBox"/>
        </page-right>

    </div>
</template>
<script>
import utils from '@/tools/utils';
import addProduct from './add-product.vue';
import CommonMixin from '@/mixins/commonMixin';
import https from "../../../../https";
import showForm from './circle-detail';
export default {
    components: {
        // SearchPart
    },
    mixins: [CommonMixin],
    data() {
        return {
             searchCondition: {
                devCode: null,
                devName: null,
                devType: null,
                status: null,
                devNo: null
            },
            showSearch: false,
            list: [],
            times: [],
            loadingData:false,
            statusType: JSON.parse(JSON.stringify(utils.orderType)),
            wifiType: utils.wifiType,
            orderType: utils.orderType,
            filters: {
                status: '1',
                devCode: '',
                devName: ''
            },
            dataList:[],
            dialogComponents: {
                0: addProduct,
                1: showForm,
                // 2: LeadForm
            },
            tempTypeList:[],
            // tempTypeList: ['有线温度计', '无线温度计', '冷柜温度计', '车载温度计', '湿度计'],
            defaultPageRight: {'width': '700px', 'padding': 0},
            batchType: '0',
            pager: {
                currentPage: 1,
                count: 0,
                pageSize: 10
            },
        };
    },
    computed: {
        typeName() {
            const typeName = this.$route.meta.type;
            this.init(typeName);
            return typeName;
        },
        perms() {
            return this.$route.meta.perms;
        },
        currentType() {
            return this.form.id ? this.form.devType * 1 + 1 : this.type;
        },
        
    },
    watch: {
        filters: {
            handler: function (val) {
                // this.queryList(1);
            },
            deep: true
        }
    },
    mounted() {
        this.filters.status = this.typeName === 2 ? '4' : '1';
          let devCode = this.$route.query.devCode;
        if (!devCode) return;
        this.searchCondition.devCode = devCode;
        this.searchCondition.devNo = this.$route.query.devNo;
        this.search();
        // this.queryList(1);
    },
    created(){
        this.initData();
        this.typeDev()
    },
    methods: {
           //设备类型
        typeDev(){
            https.get('/ccsProduct/list/all').then(res => {
                this.tempTypeList=res;
                console.log(this.tempTypeList)
                
             })
        },
           showItemDetail(item) {
            this.statusType = item.devType !== '1' ? this.orderType : this.wifiType;
            // this.currentItem = item;
            // this.currentItemId = item.id;
            this.showPart(1);
            this.defaultPageRight.width = '900px';
            this.$nextTick(() => {
                this.form = item;
            });
        },
         search() {
             console.log(this.searchCondition.devType)
            this.initData()
        },
        reset() {
            this.searchCondition = {
                devCode: null,
                devName: null,
                devType: null,
                status: null,
                devNo: null
            };
            this.pager.currentPage=1;
            this.pager.pageSize=10;

            this.initData()
            
        },
        isShow(val) {
            this.showSearch = val;
        },
        //每页条数
        handleSizeChange(val){
            this.pager.pageSize=val
            this.initData()
        },
        //当前页数
        handleCurrentChange(val){
            this.pager.currentPage=val
            this.initData()
        },
        //初始化表格
        initData() {
            var page={
            pageNo: this.pager.currentPage,
            pageSize: this.pager.pageSize,
        }
        var params=Object.assign( this.searchCondition,page)
        https.get('/ccsDevice/other/list', params).then(res => {
                this.dataList=res.currentList || []
                this.pager.count = res.count;
             })

        },
        showRecordDate: function (data) {
            if (!data) return '';
            return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
        },
        init(val) {
            this.activeStatus = 0;
            this.statusType = utils[val === 2 ? 'wifiType' : 'orderType'];
            this.filters = {
                status: '1',
                devCode: '',
                devName: ''
            };
            this.$nextTick(() => {
                this.filters.status = val === 2 ? null : '1';
            });
        },
        searchResult: function (search) {
            this.filters = Object.assign({}, this.filters, search);
        },
        checkStatus(item, key) {
            this.filters.status = item.status;
            this.activeStatus = key;
        },
        resetRightBox() {
            this.defaultPageRight.width = '700px';
            this.showIndex = -1;
        },
        showPart(index) {
            this.currentPart = this.dialogComponents[index];
            this.$nextTick(() => {
                this.showIndex = index;
            });
        },
        edit(item) {
            this.statusType = item.devType !== '1' ? this.orderType : this.wifiType;
            this.form = item;
            console.log(this.form)
            this.showPart(0);
        },
        add(){
            this.form={}
            this.showPart(0);
        },
        change() {
            this.resetRightBox();
            this.initData()
        }
    }
};
</script>
<style scoped>
.el-form::after {
    content: '';
    clear: both;
    display: table;
}
</style>
