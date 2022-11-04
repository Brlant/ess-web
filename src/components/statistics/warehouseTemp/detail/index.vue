<template>
    <div style="margin: 20px">
        <div>
            <el-button style="margin: 20px 0" @click="handleReturn" type="primary">返回</el-button>
        </div>
        <div>
            <h1>统计</h1>
            <el-row style="margin: 20px 0">
                <span>点位总数：{{ infoTotal.count }} </span>
                <span style="margin-left: 20px">缺失点位数量：{{ infoTotal.defectCount }}  </span>
                <span style="margin-left: 20px">累计缺失点位数量：{{ infoTotal.defectSum }} </span>
            </el-row>
            <el-table :data="tableAllData" v-loading="tableAllLoad" max-height="400px" border style="width: 100%">
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="pointName" label="点位名称" width="150"/>
                <el-table-column label="设备名称/编码" width="300">
                    <template slot-scope="{row}">
                        <div>{{ row.devName }}</div>
                        <div>{{ row.devCode }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="位置">
                    <template slot-scope="{row}">
                        <span>{{ row.logisticsCode }}</span>
                        <span v-if="row.warehouseCode">{{ '-' + row.warehouseCode }}</span>
                        <span v-if="row.areaCode">{{ '-' + row.areaCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="监控状态" width="100">
                    <template slot-scope="{row}">
                        <span>{{ row.monitorStatus == '1' ? '激活' : row.monitorStatus == '0' ? '未激活' : '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="loseCount" label="累计缺失点" width="100"/>
            </el-table>
            <div class="text-center" v-show="(tableAllData.length || pagerTable.currentPage !== 1) && !tableAllLoad">
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
            <el-table :data="tableData" v-loading="tableLoad" border max-height="500px" style="width: 100%">
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="pointName" label="点位名称" width="150"/>
                <el-table-column label="设备名称/编码" width="300">
                    <template slot-scope="{row}">
                        <div>{{ row.devName }}</div>
                        <div>{{ row.devCode }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="位置">
                    <template slot-scope="{row}">
                        <span>{{ row.logisticsCode }}</span>
                        <span v-if="row.warehouseCode">{{ '-' + row.warehouseCode }}</span>
                        <span v-if="row.areaCode">{{ '-' + row.areaCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="监控状态" width="100">
                    <template slot-scope="{row}">
                        <span>{{ row.monitorStatus == '1' ? '激活' : row.monitorStatus == '0' ? '未激活' : '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="loseTime" label="缺失时间" width="150"/>
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
import {WarehouseTemp} from '@/resources';

export default {
    name: "index",
    mixins: [CommonMixin],
    data() {
        return {
            infoTotal: {
                defectCount: null,
                defectSum: null,
                count: null,
            },
            tableAllData: [],
            tableAllLoad: false,
            tableData: [],
            tableLoad: false,
            pagerTable: {
                pageSize: parseInt(window.localStorage.getItem('currentTotalPageSize')) || 5,
                currentPage: 1,
                count: 0,
            },
            taskId: ''
        }
    },
    mounted() {
        this.taskId = this.$route.query.id;
        if (this.taskId == undefined) return
        this.queryTable();
        this.queryList();
    },
    methods: {
        queryTable() {
            let param = {
                taskId: this.taskId,
                pageNo: this.pagerTable.currentPage,
                pageSize: this.pagerTable.pageSize
            }
            this.tableAllLoad = true
            WarehouseTemp.getResultTask(param).then(res => {
                this.tableAllData = res.data.currentList;
                this.infoTotal.defectCount = res.data.count
                this.pagerTable.count = this.tableAllData.length;
                WarehouseTemp.getTaskCount(this.taskId).then(res1 => {
                    this.infoTotal.count = res1.data
                })
                this.tableAllLoad = false;
            }).catch(() => {
                this.tableAllLoad = false;
            })
        },
        queryList() {
            let param = {
                taskId: this.taskId,
                pageNo: this.pager.currentPage,
                pageSize: this.pager.pageSize
            }
            this.tableLoad = true;
            WarehouseTemp.getResultDetailTask(param).then(res => {
                this.tableData = res.data.currentList;
                this.infoTotal.defectSum = res.data.count
                this.pager.count = this.tableData.length;
                this.tableLoad = false;
            }).catch(() => {
                this.tableLoad = false;
            })
        },
        handleReturn() {
            this.$router.push('/statistics/warehouseTemp')
        },
        handleTableCurrentChange(val) {
            this.pagerTable.currentPage = val;
            this.queryTable();

        },
        handleTableSizeChange(val) {
            this.pagerTable.pageSize = val;
            window.localStorage.setItem('currentTotalPageSize', val);
            this.queryTable();
        },
        handleCurrentChange(val) {
            this.pager.pageNo = val;
            this.queryList();
        },
        handleSizeChange(val) {
            this.pager.pageSize = val;
            window.localStorage.setItem('currentPageSize', val);
            this.queryList();
        }
    }
}
</script>

<style scoped>
.text-center {
    margin-top: 10px;
}

</style>
