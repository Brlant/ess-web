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

        <page-right :css="{'width':'900px','padding':0}" :show="showTask" @right-close="resetRightBox">
            <taskSetForm ref="taskSetFormRef" @right-close="resetRightBox"/>
        </page-right>

    </div>
</template>

<script>
import SearchPart from './search';

import taskSetForm from './form/taskSetForm.vue';
import CommonMixin from '@/mixins/commonMixin';
export default {
    components: {
        SearchPart,taskSetForm
    },
    name: "index",
    mixins: [CommonMixin],
    data() {
        return {
            filters: {
                status: '0'
            },
            showEdit:false,
            showTask:false,
            tableData: [],
            loadingData:false
        }
    },
    created() {
    },
    methods: {
        searchResult: function (search) {
            this.filters = Object.assign({}, this.filters, search);
        },
        resetRightBox() {
            this.showEdit=false;
            this.showTask=false;
            this.$refs.taskSetFormRef.isShow=false;
        },
        handleCurrentChange(){

        },
        handleSizeChange(){

        }
    }
}
</script>

<style scoped>

</style>
