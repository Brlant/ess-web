<template>
    <div class="order-page">
        <search-part @search="searchResult">
        </search-part>

        <status-list :activeStatus="activeStatus" :checkStatus="checkStatus" :statusList="statusType"/>

        <div class="order-list" style="margin-top: 20px">
            <el-row class="order-list-header">
                <el-col :span="2">仓库名称</el-col>
                <el-col :span="2">点位名称</el-col>
                <el-col :span="4">设备名称/编码</el-col>
                <el-col :span="2">类型</el-col>
                <el-col :span="4">启用时间</el-col>
                <el-col :span="4">截止时间</el-col>
                <el-col :span="2">状态</el-col>
                <el-col :span="4">操作</el-col>
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
            <div class="order-list-body flex-list-dom" v-else="">
                <div :class="[formatRowClass(item.status, statusType) ,{'active':currentItemId===item.pointRelationId}]"
                     @click="showItemDetail(item)" class="order-list-item"
                     v-for="item in dataList">
                    <el-row>
                        <el-col :span="2">{{ item.warehouseName }}</el-col>
                        <el-col :span="2">{{ item.pointName }}</el-col>
                        <el-col :span="4">
                            <div>
                                <el-tooltip content="设备名称" placement="right">
                                    <span> {{ item.devName }}</span>
                                </el-tooltip>
                            </div>
                            <div>
                                <el-tooltip content="设备编码" placement="right">
                                    <span> {{ item.devCode }}</span>
                                </el-tooltip>
                            </div>
                        </el-col>
                        <el-col :span="2" v-if="item.pointType=='1'">
                            仓库
                        </el-col>
                        <el-col :span="2" v-else-if="item.pointType=='2'">
                            车辆
                        </el-col>
                        <el-col :span="2" v-else-if="item.pointType=='3'">
                            冰柜
                        </el-col>
                        <el-col :span="2" v-else>
                            
                        </el-col>
                        <el-col :span="4">
                            {{ item.startTime |time }}
                        </el-col>
                        <el-col :span="4">
                            {{ item.endTime |time }}
                        </el-col>
                        <el-col :span="2">{{ item.status | formatAuditStatus }}</el-col>
                        <!--<el-col :span="3">{{item.warnStatus | formatAlarmStatus}}</el-col>-->
                        <el-col :span="4" class="opera-btn">
                            <!--<des-btn @click="monitorTemp(item)" icon="start" v-has="'ccs-monitordev-switch'"
                                     v-show="item.monitorFlag==='0'">开启监控
                            </des-btn>
                            <des-btn @click="cancelMonitorTemp(item)"
                                     icon="forbidden" v-has="'ccs-monitordev-switch'" v-show="item.monitorFlag==='1'">
                                取消监控
                            </des-btn>-->
                            <des-btn @click="auditItem(item)" icon="check" v-has="'ccs-point-relation-audit'"
                                     v-show="item.status==='0'">审核
                            </des-btn>
                            <des-btn @click="deleteItem(item)" icon="delete" v-has="'ccs-point-relation-delete'">删除</des-btn>
                            <!--<des-btn v-has="'ccs-monitordev-rulecfg'" icon="edit" @click="ruleConfig(`d,${item.id}`)">配置规则</des-btn>-->
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

        <page-right :css="{'width':'900px','padding':0}" :show="showIndex !== -1" @right-close="resetRightBox">
            <component :formItem="form" :index="showIndex" :is="currentPart" @change="change"
                       @right-close="resetRightBox"/>
        </page-right>

    </div>
</template>
<script>
import utils from '@/tools/utils';
import SearchPart from './search';
import showForm from './form/show-form.vue';
import auditForm from './form/audit-form.vue';
import CommonMixin from '@/mixins/commonMixin';
import {MonitoringObjGroup, PointRelation} from '@/resources';

export default {
    components: {
        SearchPart
    },
    mixins: [CommonMixin],
    data() {
        return {
            statusType: utils.auditStatus,
            filters: {
                status: '0'
            },
            dialogComponents: {
                1: showForm,
                2: auditForm
            },
            typeList: [
                {title: '车辆', id: '1'},
                {title: '冷柜', id: '2'}
            ]
        };
    },
    watch: {
        filters: {
            handler: function () {
                this.queryList(1);
            },
            deep: true
        }
    },
    mounted() {
        this.queryList(1);
    },
    methods: {
        searchResult: function (search) {
            this.filters = Object.assign({}, this.filters, search);
        },
        checkStatus(item, key) {
            this.filters.status = item.status;
            this.activeStatus = key;
        },
        resetRightBox() {
            this.showIndex = -1;
        },
        showPart(index) {
            this.currentPart = this.dialogComponents[index];
            this.$nextTick(() => {
                this.showIndex = index;
            });
        },
        queryList(pageNo) {
            const http = PointRelation.queryPointRelationPage;
            const params = this.queryUtilWithStatus(http, pageNo);
            this.queryStatusNum(params);
        },
        queryStatusNum(params) {
            const pm = Object.assign({}, params, {status: null});
            const http = PointRelation.queryStateNum;
            const res = {};
            this.queryStatusNumUtil(http, pm, this.statusType, res);
        },
        add() {
            this.form = {};
            this.showPart(0);
        },
        auditItem(item) {
            this.currentItem = item;
            this.currentItemId = item.pointRelationId;
            this.form = item;
            this.showPart(2);
        },
        edit(item) {
            this.currentItem = item;
            this.currentItemId = item.pointRelationId;
            this.form = item;
            this.showPart(0);
        },
        deleteItem(item) {
            this.currentItem = item;
            this.$confirmOpera(`是否删除点位【${item.pointName}】绑定的设备【${item.devName}】记录`, () => {
                this.$httpRequestOpera(PointRelation.delete(item.pointRelationId), {
                    successTitle: '删除成功',
                    errorTitle: '删除失败',
                    success: () => {
                        this.queryList(1);
                    }
                });
            });
        },
        monitorTemp(item) {
            this.$confirmOpera(`是否监控设备"${item.monitordevCode}"`, () => {
                let obj = {
                    activeFlag: '1',
                    targetId: item.id
                };
                this.$httpRequestOpera(MonitoringObjGroup.modifyMonitorStatus(obj), {
                    successTitle: '监控成功',
                    errorTitle: '监控失败',
                    success: () => {
                        item.monitorFlag = '1';
                    }
                });
            });
        },
        cancelMonitorTemp(item) {
            this.$confirmOpera(`是否取消对设备"${item.monitordevCode}"的监控`, () => {
                let obj = {
                    activeFlag: '0',
                    targetId: item.id
                };
                this.$httpRequestOpera(MonitoringObjGroup.modifyMonitorStatus(obj), {
                    successTitle: '取消成功',
                    errorTitle: '取消失败',
                    success: () => {
                        item.monitorFlag = '0';
                    }
                });
            });
        },
        showItemDetail(item) {
            this.currentItem = item;
            this.currentItemId = item.id;
            this.showPart(1);
            this.$nextTick(() => {
                this.form = item;
            });
        },
        change() {
            this.resetRightBox();
            this.queryList(1);
        }
    }
};
</script>
