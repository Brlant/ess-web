<template>
    <div style="margin: 20px">
        <div>
            <el-button style="margin: 20px 0" @click="handleReturn" type="primary">返回</el-button>
        </div>
        <div>
            <h1>统计</h1>
            <el-row style="margin: 20px 0">
                <span>点位总数：{{infoTotal.count}} </span>
                <span>缺失点位数量：{{infoTotal.defectCount}}  </span>
                <span>累计缺失点位数量：{{infoTotal.defectSum}} </span>
            </el-row>
            <el-table :data="tableAllData" v-loading="tableAllLoad" border style="width: 100%">
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="createTime" label="点位名称" width="150"/>
                <el-table-column prop="createTime" label="设备名称/编码" width="150"/>
                <el-table-column prop="configName" label="位置"/>
                <el-table-column prop="creator" label="监控状态" width="120"/>
                <el-table-column prop="creator" label="累计缺失点" width="120"/>
            </el-table>
            <div class="text-center" v-show="(tableAllData.length || pager.currentPage !== 1) && !tableAllLoad">
                <el-pagination :current-page="pagerTable.currentPage" :page-size="pagerTable.pageSize"
                               :page-sizes="[5,10,20,50,100]"
                               :total="pagerTable.count" @current-change="handleTableCurrentChange"
                               @size-change="handleTableSizeChange"
                               layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
        </div>
        <div>
            <h1>明细</h1>
            <el-table :data="tableData" v-loading="tableLoad" border style="width: 100%">
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="createTime" label="点位名称" width="150"/>
                <el-table-column prop="createTime" label="设备名称/编码" width="150"/>
                <el-table-column prop="configName" label="位置"/>
                <el-table-column prop="creator" label="监控状态" width="120"/>
                <el-table-column prop="creator" label="缺失时间" width="120"/>
            </el-table>
            <div class="text-center" v-show="(tableData.length || pagerTable.currentPage !== 1) && !tableLoad">
                <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                               :page-sizes="[10,20,50,100]"
                               :total="pager.count" @current-change="handleCurrentChange"
                               @size-change="handleSizeChange"
                               layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>

            </div>
        </div>
    </div>
</template>

<script>
import CommonMixin from '@/mixins/commonMixin';

export default {
    name: "index",
    mixins: [CommonMixin],
    data() {
        return {
            infoTotal:{

            },
            tableAllData: [],
            tableAllLoad: false,
            tableData: [],
            tableLoad: false,
            pagerTable: {},
            taskId:''
        }
    },
    mounted(){
        this.query();
    },
    methods: {
        query(){
            console.log(this.$route.params.id);
        },
        handleReturn() {
            this.$router.push('/statistics/warehouseTemp')
        },
        handleTableCurrentChange() {

        },
        handleTableSizeChange() {

        },
        handleCurrentChange() {

        },
        handleSizeChange() {

        }
    }
}
</script>

<style scoped>

</style>
