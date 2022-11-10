<template>
    <div style="margin: 20px">
        <div>
            <el-button style="margin: 20px 0" @click="handleReturn" type="primary">返回</el-button>
            <h1>统计</h1>
            <el-row style="margin: 20px 0">
                <span>点位总数：{{ infoTotal.count }} </span>
                <span style="margin-left: 20px">缺失点位数量：{{ infoTotal.defectCount }}  </span>
                <span style="margin-left: 20px">累计缺失点数量：{{ infoTotal.defectSum }} </span>
            </el-row>
        </div>
        <el-scrollbar style="height:100%">
            <div :style="'height:'+scrollBarHeight">
                <el-table :data="tableAllData" v-loading="tableAllLoad" max-height="400px" border style="width: 100%">
                    <el-table-column type="index" label="序号" width="60"/>
                    <el-table-column prop="pointName" label="点位名称" />
                    <el-table-column label="设备名称/编码" >
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
                    <el-table-column label="监控状态" min-width="100">
                        <template slot-scope="{row}">
                            <span>{{ row.monitorStatus == '1' ? '激活' : row.monitorStatus == '0' ? '未激活' : '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="loseCount" label="累计缺失点" min-width="100"/>
                </el-table>
                <div class="text-center" v-show="(tableAllData.length || pagerTable.currentPage !== 1) && !tableAllLoad">
                    <el-pagination :current-page="pagerTable.currentPage" :page-size="pagerTable.pageSize"
                                   :page-sizes="[5,10,20,50,100]"
                                   :total="pagerTable.count" @current-change="handleTableCurrentChange"
                                   @size-change="handleTableSizeChange"
                                   layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                </div>
                <h1>明细</h1>
                <el-table :data="tableData" v-loading="tableLoad" border  style="width: 100%">
                    <el-table-column type="index" label="序号" width="60" :index="hIndex"/>
                    <el-table-column prop="pointName" label="点位名称" />
                    <el-table-column label="设备名称/编码" >
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
                    <el-table-column label="监控状态" min-width="100">
                        <template slot-scope="{row}">
                            <span>{{ row.monitorStatus == '1' ? '激活' : row.monitorStatus == '0' ? '未激活' : '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="loseTime" label="缺失时间" min-width="100"/>
                </el-table>
                <div class="text-center" v-show="(tableData.length || pagerDetailTable.currentPage !== 1) && !tableLoad">
                    <el-pagination :current-page="pagerDetailTable.currentPage" :page-size="pagerDetailTable.pageSize"
                                   :page-sizes="[10,20,50,100]"
                                   :total="pagerDetailTable.count" @current-change="handleCurrentChange"
                                   @size-change="handleSizeChange"
                                   layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>

                </div>
            </div>
        </el-scrollbar>

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
            pagerDetailTable: {
                pageSize: parseInt(window.localStorage.getItem('currentPageSize')) || 10,
                currentPage: 1,
                count: 0,
            },
            taskId: '',
            scrollBarHeight:document.documentElement.clientHeight -220 + "px;"
        }
    },
    mounted() {
        this.taskId = this.$route.query.id;
        if (this.taskId == undefined) return
        this.queryTable();
        this.queryList();
        const that = this;
        window.onresize = function temp() {
            that.scrollBarHeight = document.documentElement.clientHeight -220 + "px;";
        };
    },
    methods: {
        queryTable() {
            let param = {
                taskId: this.taskId,
                pageNo: this.pagerTable.currentPage,
                pageSize: this.pagerTable.pageSize
            }
            this.tableAllLoad = true
            this.tableAllData = [];
            this.infoTotal.defectCount = 0;
            WarehouseTemp.getResultTask(param).then(res => {
                this.tableAllData = res.data.currentList;
                this.infoTotal.defectCount = res.data.count
                this.pagerTable.count = res.data.count;
                this.infoTotal.count = 0;
                WarehouseTemp.getTaskCount(this.taskId).then(res1 => {
                    this.infoTotal.count = res1.data
                })
                this.tableAllLoad = false;
            }).catch(() => {
                this.pagerTable.count = 0
                this.tableAllLoad = false;
            })
        },
        queryList() {
            let param = {
                taskId: this.taskId,
                pageNo: this.pagerDetailTable.currentPage,
                pageSize: this.pagerDetailTable.pageSize
            }
            this.tableLoad = true;
            this.tableData = [];
            WarehouseTemp.getResultDetailTask(param).then(res => {
                this.tableData = res.data.currentList;
                this.infoTotal.defectSum = res.data.count
                this.pagerDetailTable.count = res.data.count;
                this.tableLoad = false;
            }).catch(() => {
                this.pagerDetailTable.count = 0
                this.infoTotal.defectSum = 0;
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
            this.pagerDetailTable.currentPage = val;
            this.queryList();
        },
        handleSizeChange(val) {
            this.pagerDetailTable.pageSize = val;
            window.localStorage.setItem('currentPageSize', val);
            this.queryList();
        },
        hIndex(index) {
            // index索引从零开始，index +1即为当前数据序号
            this.pagerDetailTable.currentPage <= 0 ? this.pagerDetailTable.currentPage = 1 : this.pagerDetailTable.currentPage
            // 如果当前不是第一页数据
            if (this.pagerDetailTable.currentPage != 1) {
                // index + 1 + (( 当前页 - 1) * 每页展示条数)
                // 比如是第二页数据 1 + ((2 - 1)*5) = 6,第二页数据也就是从序号6开始
                return index + 1 + ((this.pagerDetailTable.currentPage - 1) * this.pagerDetailTable.pageSize)
            }
            // 否则直接返回索引+1作为序号
            return index + 1
        }
    }
}
</script>

<style scoped>
.text-center {
    margin-top: 10px;
}

</style>
