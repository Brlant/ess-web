<template>
    <div class="order-page">
        <search-part @search="searchResult">
            <template slot="btn">
                    <el-button @click="showTask=true" plain size="small">
                        自动任务设置
                    </el-button>
                    <el-button @click="showEdit=true" plain size="small">
                        添加任务
                    </el-button>
            </template>
        </search-part>

        <div class="order-list" style="margin-top: 20px">
            <el-row class="order-list-header">
                <el-col :span="4">添加时间 </el-col>
                <el-col :span="6">任务名称</el-col>
                <el-col :span="3">添加人</el-col>
                <el-col :span="4">查询时间</el-col>
                <el-col :span="3">状态</el-col>
                <el-col :span="4">操作</el-col>
            </el-row>
            <el-row v-if="loadingData">
                <el-col :span="24">
                    <oms-loading :loading="loadingData"></oms-loading>
                </el-col>
            </el-row>
            <el-row v-else-if="tableData.length === 0">
                <el-col :span="24">
                    <div class="empty-info">
                        暂无信息
                    </div>
                </el-col>
            </el-row>
            <div class="order-list-body flex-list-dom" v-else>
                <div class="order-list-item no-pointer order-list-item-bg" v-for="item in tableData">
                    <el-row>
                        <el-col :span="4">{{item.createTime}} </el-col>
                        <el-col :span="6">{{item.taskName}}</el-col>
                        <el-col :span="3">{{item.creator}}</el-col>
                        <el-col :span="4">{{item.queryTime}}</el-col>
                        <el-col :span="3">{{item.taskStatus}}</el-col>
                        <el-col :span="4">
                            <des-btn @click="handleShowDetail(item)" icon="detail" v-has="'show'">查看</des-btn>
                            <a v-if="item.taskStatus=='2'" @click="handleRefresh(item)" style="margin-left: 10px">刷新</a>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>

        <div class="text-center" v-show="(tableData.length || pager.currentPage !== 1) && !loadingData">
            <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                           :page-sizes="[10,20,50,100]"
                           :total="pager.count" @current-change="handleCurrentChange"
                           @size-change="handleSizeChange"
                           layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>

        <page-right :css="{'width':'900px','padding':0}" :show="showEdit" @right-close="resetRightBox">
            <editForm ref="taskSetFormRef" @change="editChange" @right-close="resetRightBox"/>
        </page-right>
        <page-right :css="{'width':'900px','padding':0}" :show="showTask" @right-close="resetRightBox">
            <taskSetForm ref="taskSetFormRef" @right-close="resetRightBox"/>
        </page-right>
    </div>
</template>

<script>
import SearchPart from './search';
import editForm from './form/editForm.vue';
import taskSetForm from './form/taskSetForm.vue';
import {WarehouseTemp} from '@/resources';
import CommonMixin from '@/mixins/commonMixin';
export default {
    components: {
        SearchPart,taskSetForm,editForm
    },
    name: "index",
    mixins: [CommonMixin],
    data() {
        return {
            filters: {},
            showEdit:false,
            showTask:false,
            tableData: [],
            loadingData:false
        }
    },
    created() {
        this.tableData=[{configName:'ceshi',id:1}]
    },
    methods: {
        searchResult: function (search) {
            this.filters = Object.assign({},{
                pageNo: this.pager.pageNo,
                pageSize: this.pager.pageSize
            } ,this.filters, search);
            this.queryList(1)
        },
        queryList(pageNo){
            // this.loadingData=true;
            this.filters.pageNo=pageNo;
            console.log(this.filters,'111115555555')
            // WarehouseTemp.getTask(this.filters).then(res=>{
            //
            //     this.loadingData=false;
            // }).catch(err=>{
            //     this.loadingData=false;
            // })
        },
        resetRightBox() {
            this.showEdit=false;
            this.showTask=false;
            this.$refs.taskSetFormRef.isShow=false;
        },
        handleShowDetail(item){
            this.$router.push({name:'warehouseTempDetail',params:{id:item.id}})
        },
        handleRefresh(item){
            this.$httpRequestOpera(WarehouseTemp.updateTask(item.id), {
                successTitle: '刷新成功',
                errorTitle: '刷新失败',
                success: res => {
                    this.queryList(1)
                },
                error: () => {

                }
            });

        },
        handleSizeChange(val) {
            this.pager.pageSize = val;
            window.localStorage.setItem('currentPageSize', val);
            this.searchResult(this.filters);
            console.log(val,'handleSizeChange')
        },
        handleCurrentChange(val) {
            this.queryList(val);
        },
        editChange(){
            this.queryList(1)
        }
    }
}
</script>

<style scoped>
  a{
      color:  rgba(0, 0, 0, 0.65);
  }
  a:hover {
      color: #40a9ff;
  }
</style>
