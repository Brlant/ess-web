<template>
    <div class="order-page">
        <search-part @search="searchResult">
            <template slot="btn">
                    <el-button @click="handleShowTask()" v-has="'ccs-auto-check-config'" plain size="small">
                        自动任务设置
                    </el-button>
                    <el-button @click="showEdit=true" plain size="small" v-has="'ccs-check-task-add'">
                        添加任务
                    </el-button>
            </template>
        </search-part>

        <div class="order-list" style="margin-top: 20px">
            <el-row class="order-list-header">
                <el-col :span="4">添加时间 </el-col>
                <el-col :span="7">任务名称</el-col>
                <el-col :span="3">添加人</el-col>
                <el-col :span="4">查询时间</el-col>
                <el-col :span="3">状态</el-col>
                <el-col :span="3">操作</el-col>
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
                        <el-col :span="4">{{formatMsToTime(item.createTime)}} </el-col>
                        <el-col :span="7">{{item.taskName}}
                            <el-tag v-show="item.taskType==1" type="warning">自动任务</el-tag>
                        </el-col>
                        <el-col :span="3">{{item.creator}}</el-col>
                        <el-col :span="4">{{item.taskDate}}</el-col>
                        <el-col :span="3">{{item.taskStatus==1?'查询中':item.taskStatus==2?'完成':''}}</el-col>
                        <el-col :span="3">
                            <el-button type="text" size="small"   v-if="item.taskStatus=='2'"  class="text-button" @click="handleShowDetail(item)" icon="detail"  v-has="'ccs-check-result'">查看</el-button>
                            <el-popconfirm  title="是否刷新该任务查询结果？"  v-if="item.taskStatus=='2'"   @confirm="handleRefresh(item)" >
                                <el-button type="text" size="small"  class="text-button" slot="reference" v-has="'ccs-check-task-refresh'">刷新</el-button>
                            </el-popconfirm>

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
            <editForm ref="editFormRef" @change="editChange" :options="options" @right-close="resetRightBox"/>
        </page-right>
        <page-right :css="{'width':'900px','padding':0}" :show="showTask" @right-close="resetRightBox">
            <taskSetForm ref="taskSetFormRef" :options="options" @right-close="resetRightBox"/>
        </page-right>
    </div>
</template>

<script>
import SearchPart from './search';
import editForm from './form/editForm.vue';
import taskSetForm from './form/taskSetForm.vue';
import {WarehouseTemp} from '@/resources';
import CommonMixin from '@/mixins/commonMixin';
import utils from '@/tools/utils';
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
            loadingData:false,
            options:[],
        }
    },
    created() {
        this.searchResult(this.filters);
        WarehouseTemp.gainWarehouseWithChildList().then(res=>{
            this.options=res.data['warehouseList']
        })
    },
    methods: {
        searchResult: function (search) {
            this.filters = Object.assign({} ,this.filters, search);
            this.filters.pageSize=this.pager.pageSize;
            this.filters.pageNo=this.pager.pageNo;
            this.queryList(1)
        },
        queryList(pageNo){
            this.loadingData=true;
            this.filters.pageNo=pageNo;
            WarehouseTemp.getTask(this.filters).then(res=>{
                this.tableData=res.data.currentList
                this.pager.count=res.data.count
                this.loadingData=false;
            }).catch(err=>{
                this.loadingData=false;
            })
        },
        formatMsToTime(val){
            return val==''?val:this.$moment(val).format('YYYY-MM-DD HH:mm:ss')
        },
        resetRightBox() {
            this.showEdit=false;
            this.showTask=false;
            this.$refs.taskSetFormRef.restForm();
            this.$refs.editFormRef.resetForm();
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
        },
        handleCurrentChange(val) {
            this.queryList(val);
        },
        editChange(){
            this.resetRightBox();
            this.queryList(1)

        },
        handleShowTask(){
            this.showTask=true;
            this.$refs.taskSetFormRef.initConfig();
        }
    }
}
</script>

<style scoped>
  .text-button{
      font-size: 14px;
  }
</style>
