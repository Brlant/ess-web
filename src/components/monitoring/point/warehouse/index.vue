<style lang="scss">

.containerView{
    .containerViewInfo.d-table.f-w {

        width: 100%;
        display:flex;
        flex-direction:row;
        .d-table-left{ flex-shrink:0; box-sizing:border-box; }
        .d-table-right{ box-sizing:border-box;
            .content-right{width:100%; overflow:hidden; box-sizing:border-box;}
        }

    }
    .content-sp {
        overflow: hidden;
        font-size: 14px;
    }

    .d-table > div.d-table-right {
        padding: 0;
        flex-grow:1;
    }

    .d-table > div.d-table-left {
        padding-left: 10px;
        padding-right: 0;
        width:260px;
        flex-shrink:0;
        /*.d-table-left_scroll_content {*/
        /*padding-right: 20px;*/
        /*}*/
    }

    .part-bg {
        background: #eee;
        padding-bottom: 10px;
    }

    .p-r-20 {
        padding-left: 20px;
        padding-right: 20px;
    }

    .noDataTips{ text-align:center; min-height:300px; color:#999; display:flex; justify-content: center; align-items: center; }

    .pointPositionTable{
        width:100%!important;
        table{ width:100%!important; }
        .el-table__body-wrapper{ width:100%!important; }
        .el-table__body{ width:100%!important; }

    }

    .warehouse-tree{
        .el-collapse-item__header{ display:flex; align-items:center; flex-direction:row;
            > span{ line-height:normal; }
            .list-opera-icon{ display:flex; }
            .titleTxt{
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: 2;
            }
        }
    }

}
</style>
<template>
    <div class="containerView">
        <div class="containerViewInfo d-table f-w ">
            <div class="d-table-left">
                <el-scrollbar :style="'height:'+bodyHeight" class="d-table-left_scroll" tag="div">
                    <div class="d-table-left_scroll_content">
                        <div v-if="loadingDataWare">
                            <oms-loading :loading="loadingDataWare"></oms-loading>
                        </div>
                        <div class="empty-info mini" v-else-if="warehouseList.length===0">
                            暂无信息
                        </div>
                        <div v-else>
                            <el-collapse :key="index" @change="changeCollapse(item)" accordion
                                         class="warehouse-tree" v-for="(item, index) in warehouseList"
                                         v-model="accordionId">
                                <el-collapse-item :name="item.id">
                                    <template slot="title">
                                        <span class="pull-right list-opera-icon" v-show="activeId === item.id">

                                            <!-- v-has="'ccs-warehouse-export'" -->
                                            <des-btn @click="exportWarehouseTempData(item)" v-has="'ccs-warehouse-export'" icon="export"></des-btn>

                                            <des-btn @click="editWarehouse(item)" icon="edit" v-has="'ccs-point-warehouse-edit'"></des-btn>
                                            <des-btn @click="addArea" icon="plus" v-has="'ccs-point-warehouse-area-add'"></des-btn>
                                        </span>
                                        <span class="titleTxt" :title="item.warehouseCode">{{ item.warehouseCode }}</span>
                                        <!--<el-tag type="success" v-show="item.warnStatus === '0'">正常</el-tag>-->
                                        <!--<el-tag type="danger" v-show="item.warnStatus === '1'">告警</el-tag>-->
                                        <el-tag type="success" v-show="item.activeFlag === '1'">启用</el-tag>
                                        <el-tag type="danger" v-show="item.activeFlag === '0'">停用</el-tag>
                                    </template>
                                    <div v-if="loadingDataLocaList">
                                        <oms-loading :loading="loadingDataLocaList"></oms-loading>
                                    </div>
                                    <div class="empty-info mini" v-else-if="!areaList.length">
                                        暂无库区信息
                                    </div>
                                    <ul class="show-list" v-else="">
                                        <li :class="{'active':item.id===currentArea.id}" :key="index"
                                            @click="showAreaDetail(item)"
                                            class="list-item" v-for="(item,index) in areaList">
                                            {{ item.warehouseCode }}
                                            <!--<el-tag type="success" v-show="item.warnStatus === '0'">正常</el-tag>-->
                                            <!--<el-tag type="danger" v-show="item.warnStatus === '1'">告警</el-tag>-->
                                            <el-tag type="success" v-show="item.activeFlag === '1'">启用</el-tag>
                                            <el-tag type="danger" v-show="item.activeFlag === '0'">停用</el-tag>
                                        </li>
                                    </ul>
                                </el-collapse-item>
                            </el-collapse>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="d-table-right" >
                <div v-if="loadingDataLoca">
                    <oms-loading :loading="loadingDataLoca"></oms-loading>
                </div>
                <div class="empty-info" v-if="!currentArea.id">
                    暂无信息
                </div>
                <div class="content-right" v-else="">
                    <div class="form-header-part part-bg p-r-20">
                        <div class="header">
                            <div class="sign f-dib"></div>
                            <h3 class="tit f-dib index-tit">库区信息</h3>
                        </div>
                        <div class="content content-sp">
                            <el-col :span="6">
                                <oms-row :span="10" label="库区编码">{{ currentArea.warehouseCode }}</oms-row>
                            </el-col>
                            <el-col :span="4">
                                <oms-row :span="10" label="状态">
                                    <el-tag type="success" v-show="currentArea.activeFlag === '1'">启用</el-tag>
                                    <el-tag type="danger" v-show="currentArea.activeFlag === '0'">停用</el-tag>
                                </oms-row>
                            </el-col>
                        </div>
                    </div>
                    <div class="form-header-part mt-10 p-r-20"  >
                        <el-row>
                            <el-col :span="6">
                                <div class="header">
                                    <div class="sign f-dib"></div>
                                    <h3 class="tit f-dib index-tit">点位信息</h3>
                                </div>
                            </el-col>
                            <el-col :span="18" class="text-right ">
                  <span class="btn-search-toggle open" style="margin-right: 10px">
                    <single-input @click.stop="" placeholder="请输入名称搜索点位" style="width: 180px"
                                  v-model='keyWord'></single-input>
                    <i class="el-icon-t-search"></i>
                  </span>
                                <el-button-group>
                                    <el-button :plain="true" @click="outputDataFn" >
                                        导出数据
                                    </el-button>
                                    <el-button :plain="true" @click="editArea" v-has="'ccs-point-warehouse-area-edit'">
                                        编辑
                                    </el-button>
                                    <el-button :plain="true" @click="addTemp" v-has="'ccs-point-warehouse-dev-add'">
                                        新增监控点位
                                    </el-button>
                                    <el-button :plain="true" @click="ruleAllConfig(currentArea.id)"
                                               v-has="'ccs-point-warehouse-dev-rulecfg'">
                                        配置规则
                                    </el-button>
                                    <el-button :plain="true" @click="monitoringControlsFn(1)">
                                        一键开启监控
                                    </el-button>
                                    <el-button :plain="true" @click="monitoringControlsFn(0)">
                                        一键取消监控
                                    </el-button>
                                </el-button-group>
                            </el-col>
                        </el-row>
                        <div class="content">
                            <div class=" mt-10" >
                                <div class="noDataTips" v-if="!tempList.length" >
                                    <p>暂无数据</p>
                                </div>
                                <el-table :data="tempList" v-else :max-height="tableHeight"
                                          header-row-class-name="table-header-color"
                                          class="pointPositionTable" v-loading="loadingDataTemp">
                                    <el-table-column label="点位名称" min-width="120" prop="pointName"></el-table-column>
                                    <el-table-column label="备注" min-width="120" prop="remark"></el-table-column>
                                    <el-table-column label="设备名称/编码" min-width="140">
                                        <template slot-scope="scope">
                                            <div>
                                                <el-tooltip content="设备名称" placement="right">
                                                    <span>{{ scope.row.ccsDevName }}</span>
                                                </el-tooltip>
                                            </div>
                                            <div>
                                                <el-tooltip content="设备编码" placement="right">
                                                    <span>{{ scope.row.ccsDevCode }}</span>
                                                </el-tooltip>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="最新数据" prop="reportDateMap">
                                        <template slot-scope="scope">
                                            <el-tooltip :content="showRecordDate(scope.row.recordDate)" effect="dark"
                                                        placement="top">
                                                <span>{{ $formatDevData(scope.row, $formatDevType(scope.row)) }}</span>
                                            </el-tooltip>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="监控状态" min-width="80" prop="monitorStatus">
                                        <template slot-scope="scope">
                                            {{ scope.row.monitorStatus | formatMonitoringStatus }}
                                        </template>
                                    </el-table-column>
                                    <!--<el-table-column prop="monitorStatus" label="位置" min-width="80">-->
                                    <!--<template slot-scope="scope">-->
                                    <!--<div v-show="scope.row.positionX">X：{{scope.row.positionX}}</div>-->
                                    <!--<div v-show="scope.row.positionY">Y：{{scope.row.positionY}}</div>-->
                                    <!--</template>-->
                                    <!--</el-table-column>-->
                                    <el-table-column label="操作" min-width="300" prop="">
                                        <template slot-scope="scope">
                                            <div class="opera-btn-bidder">
                                                <des-btn @click="monitorTemp(scope.row)"
                                                         icon="start" v-has="'ccs-point-warehouse-dev-switch'"
                                                         v-show="scope.row.ccsMonitorRelationId&&(!scope.row.monitorStatus || scope.row.monitorStatus==='0')">
                                                    开启监控
                                                </des-btn>
                                                <des-btn @click="cancelMonitorTemp(scope.row)" icon="forbidden"
                                                         v-has="'ccs-point-warehouse-dev-switch'"
                                                         v-show="scope.row.ccsMonitorRelationId&&scope.row.monitorStatus==='1'">
                                                    取消监控
                                                </des-btn>
                                                <des-btn @click="ruleConfig('s,' + scope.row.ccsMonitorRelationId)"
                                                         v-show="scope.row.ccsMonitorRelationId"
                                                         icon="edit" v-has="'ccs-point-warehouse-dev-rulecfg'">配置规则
                                                </des-btn>
                                                <des-btn @click="editTemp(scope.row)" icon="edit"
                                                         v-has="'ccs-point-warehouse-dev-edit'">编辑点位
                                                </des-btn>
                                                <des-btn @click="addBandingDev(scope.row)" icon="edit"
                                                         v-has="'ccs-point-warehouse-dev-bind'">绑定设备
                                                </des-btn>
                                                <des-btn @click="deleteTemp(scope.row)" icon="delete"
                                                         v-has="'ccs-point-warehouse-dev-delete'">删除
                                                </des-btn>

                                                <!-- @click="$turnPointDevDate(scope.row, $formatDevType(scope.row))" -->
                                                <des-btn
                                                    @click="toHistoryFn(scope.row, $formatDevType(scope.row))"
                                                    icon="detail"
                                                    v-has="'ccs-point-devdata-scan'">历史数据
                                                </des-btn>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>

                            </div>
                            <div class="text-center" v-show="tempList.length">
                                <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                                               :page-sizes="[10,20,50,100]"
                                               :total="pager.count" @current-change="handleCurrentChange"
                                               @size-change="handleSizeChange"
                                               layout="total, sizes, prev, pager, next, jumper">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <page-right :css="{'width':'900px','padding':0}" :show="showIndex !== -1" @right-close="resetRightBox">
            <temp-part :area="currentArea" :tempItem="tempItem" :action="action" :index="showIndex" @refresh="refresh"
                       v-show="showIndex=== 0"/>
            <temp-export :activeId="activeId" :index="showIndex" v-show="showIndex=== 2"/>
            <banding-dev :formItem="tempItem" :action="action" :currentArea='currentArea' :index="showIndex" @refresh="refresh"
                         v-show="showIndex=== 3"/>

            <!-- 新增 - 导出数据组件 -->
            <export-data :ccsWarehouseId="ccsWarehouseId" :index="showIndex" v-show="showIndex=== 4"/>

        </page-right>
    </div>
</template>
<script>
import TempPart from './form/temp';
import {CcsWarehouse, MonitoringObjGroup, Point} from '@/resources';
import TempExport from './form/temp-export';
import exportData from './form/exportData';
import BandingDev from './form/banding-dev';

export default {
    components: {BandingDev, TempPart, TempExport, exportData},
    data: function () {
        return {
            loadingDataWare: false,
            loadingDataLocaList: false,
            loadingDataLoca: false,
            loadingDataTemp: false,
            warehouseList: [],
            areaList: [],
            tempList: [],
            showIndex: -1,
            action: '',
            currentArea: {},
            keyWord: '',
            pager: {
                currentPage: 1,
                count: 0,
                pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
            },
            activeId: '',
            accordionId: '',
            deleteStore: this.$parent.deleteStore,
            tempItem: {},
            ccsWarehouseId : ''
        };
    },
    computed: {
        bodyHeight: function () {
            let height = parseInt(this.$store.state.bodyHeight, 10);
            return (height - 20) + 'px';
        },
        tableHeight: function () {
            let height = parseInt(this.$store.state.bodyHeight, 10);
            return (height - 207);
        }
    },
    mounted() {

    },
    watch: {
        keyWord() {
            this.queryTemp();
        }
    },
    methods: {
        showRecordDate: function (data) {
            return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
        },
        editWarehouse(item) {
            this.$emit('open', item, '1');
        },
        addArea() {
            this.$emit('open', {
                parentId: this.activeId
            }, '2');
        },
        editArea() {
            this.$emit('open', this.currentArea, '2');
        },
        outputDataFn() {
            this.showIndex = 4;
        },
        addTemp() {
            if (this.currentArea.activeFlag === '0') {
                this.$notify.info({
                    message: '库区【' + this.currentArea.warehouseCode + '】已停用，无法新增点位。'
                });
                return;
            }
            this.showIndex = 0;
            this.action = 'add';
            this.tempItem = {};
        },
        editTemp(item) {
            this.showIndex = 0;
            this.action = 'edit';
            this.tempItem = item;
        },
        addBandingDev(item) {
            if (this.currentArea.activeFlag === '0') {
                this.$notify.info({
                    message: '库区【' + this.currentArea.warehouseCode + '】已停用，无法绑定设备。'
                });
                return;
            }
            this.showIndex = 3;
            this.action = 'edit';
            this.tempItem = Object.assign({}, item);
        },
        editBandingDev(item) {
            this.showIndex = 3;
            this.action = 'edit';
            this.tempItem = item;
        },
        deleteTemp(item) {
            this.$confirmOpera(`是否删除点位"${item.pointName}"`, () => {
                this.$httpRequestOpera(
                    this.$http.delete(`/ccs-point/${item.id}`, {}), {
                        successTitle: '删除成功',
                        errorTitle: '删除失败',
                        success: () => {
                            this.refresh();
                        }
                    });
            });
        },
        refresh() {
            this.queryTemp(1);
            this.resetRightBox();
        },
        resetRightBox() {
            this.showIndex = -1;
        },
        handleSizeChange(val) {
            this.pager.pageSize = val;
            window.localStorage.setItem('currentPageSize', val);
            this.queryTemp(1);
        },
        handleCurrentChange(val) {
            this.queryTemp(val);
        },
        changeCollapse(item) {
            this.activeId = item.id;
            this.queryArea();
        },
        showAreaDetail(item) {
            this.ccsWarehouseId = item.ccsWarehouseId ;
            this.currentArea = item;
            this.queryTemp(1);
        },
        ruleConfig(id) {
            this.$store.commit('initUnitId', id);
        },
        ruleAllConfig(id) {
            // 判断是否所有点位都配置了设备
            let params = Object.assign({}, {
                ccsWarehouseId: this.currentArea.id,
                keyWord: this.keyWord
            });
            let unbandingFlag = false;

            Point.queryPointList(this.currentArea.id, params).then(res => {
                let pointList = res.data;

                pointList.forEach(f => {
                    if (f.ccsDevId === null) {
                        unbandingFlag = true;
                    }
                })

                if (unbandingFlag) {
                    this.$notify.info({
                        message: '存在未绑定设备的点位，无法进行配置规则的操作。'
                    });
                    return;
                }
                this.$store.commit('initUnitId', id);
            });
        },
        monitorTemp(item) {
            this.$confirmOpera(`是否监控设备"${item.ccsDevName}"`, () => {
                let obj = {
                    activeFlag: '1',
                    ids: [item.ccsMonitorRelationId]
                };
                this.$httpRequestOpera(MonitoringObjGroup.modifyMonitorStatusSingle(obj), {
                    successTitle: '监控成功',
                    errorTitle: '监控失败',
                    success: () => {
                        item.monitorStatus = '1';
                    }
                });
            });
        },
        cancelMonitorTemp(item) {
            this.$confirmOpera(`是否取消对设备"${item.ccsDevName}"的监控`, () => {
                let obj = {
                    activeFlag: '0',
                    ids: [item.ccsMonitorRelationId]
                };
                this.$httpRequestOpera(MonitoringObjGroup.modifyMonitorStatusSingle(obj), {
                    successTitle: '取消成功',
                    errorTitle: '取消失败',
                    success: () => {
                        item.monitorStatus = '0';
                    }
                });
            });
        },
        queryWarehouse: function () {
            let param = {
                parentId: this.$route.params.id,
                warehouseType: '1',
                // activeFlag: '1'
            };
            this.loadingDataWare = true;
            CcsWarehouse.queryAllList(param).then(res => {
                this.currentArea = {};
                this.warehouseList = res.data.currentList;
                this.activeId = this.warehouseList.length ? this.warehouseList[0].id : '';
                this.accordionId = this.activeId;
                this.loadingDataWare = false;
                this.queryArea();
            });
        },
        queryArea: function () {

            let param = {
                parentId: this.activeId,
                warehouseType: '2',
                // activeFlag: '1'
            };
            this.loadingDataLocaList = true;
            CcsWarehouse.queryAllList(param).then(res => {
                // console.error( 88, res, res.data.currentList ) ;
                this.areaList = res.data.currentList;
                this.loadingDataLocaList = false;
            });
        },
        queryTemp(pageNo) {
            this.tempItem = {};
            this.pager.currentPage = pageNo;
            let params = Object.assign({}, {
                pageNo: pageNo,
                pageSize: this.pager.pageSize,

                belongObjectId: this.currentArea.id,
                // ccsWarehouseId: this.currentArea.id,

                keyWord: this.keyWord,

                pointType : '1' // 表示查询库区点位
            });
            this.loadingDataTemp = true;
            this.tempList = [] ;
            Point.queryWareHousePointList(this.currentArea.id, params).then(res => {
                this.tempList = res.data.list || [];
                this.pager.count = res.data.count;
                this.loadingDataTemp = false;
            });
        },
        editTempLocation(row) {
            this.tempItem = row;
            this.showIndex = 1;
        },
        exportWarehouseTempData(row) {
            this.showIndex = 2;
        },

        toHistoryFn( item, type ){
            let pointId = item.pointId;
            this.$router.push({path: '/monitoring/point-dev/temp', query: {pointId, type}});
        },

        monitoringControlsFn( activeFlag ){
            let params = {
                activeFlag,
                warehouseId : this.ccsWarehouseId
            } ;

            this.$confirmOpera(`是否一键${ activeFlag ? '开启' : '取消' }监控`, () => {
                 Point.pointActiveRelations(params).then(res => {
                    let { status, data } = res ;

                    if( +status === 200 ){
                        this.queryTemp(1);
                    }

                    this.$message({
                        type: +status === 200 ? 'success' : 'warning',
                        message: +status === 200 ? `${ activeFlag ? '开启' : '取消' }成功` : `${ activeFlag ? '开启' : '取消' }失败`
                    });
                });

            });



        }
    }
};
</script>
