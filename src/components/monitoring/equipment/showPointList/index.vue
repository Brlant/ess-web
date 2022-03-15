<style lang="scss" scoped>

.content-sp {
    overflow: hidden;
    font-size: 14px;
}
.d-table{ background:none; }  
.d-table > div.d-table-right {
    padding: 0;
}

.d-table > div.d-table-left {
    padding-left: 10px;
    padding-right: 0;
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

.container.d-table.f-w {
    width: 100%;
}
</style>
<template>
    <div>
        <div class="container d-table f-w">
            <!-- <div v-if="loadingDataLoca">
                <oms-loading :loading="loadingDataLoca"></oms-loading>
            </div> -->
            <!-- <div class="empty-info" v-if="!currentArea.id">
                暂无信息
            </div> -->
            <div>
                <div class="form-header-part">
                    <el-row v-if="!isHidden">
                        <el-col class="text-right">
                            <span class="btn-search-toggle open" style="margin-right: 10px">
                                <single-input @click.stop="" placeholder="请输入名称搜索点位" style="width: 180px"
                                            v-model='keyWord'></single-input>
                                <i class="el-icon-t-search"></i>
                            </span>
                            <el-button-group>
                                <!-- 
                                    yxh 后台不需要编辑库区功能
                                    <el-button :plain="true" @click="editArea" v-has="'ccs-point-warehouse-area-edit'">
                                        编辑
                                    </el-button> 
                                -->
                                <el-button :plain="true" @click="addTemp" v-has="'ccs-point-warehouse-dev-add'">
                                    新增监控点位
                                </el-button>
                                <el-button :plain="true" @click="ruleAllConfig(form.id)"
                                            v-has="'ccs-point-warehouse-dev-rulecfg'">
                                    配置规则
                                </el-button>
                            </el-button-group>
                        </el-col>
                    </el-row>
                    <div class="content">
                        <div class=" mt-10">
                            <el-table :data="tempList" :max-height="tableHeight"
                                        header-row-class-name="table-header-color"
                                        style="width: 100%;" v-loading="loadingDataTemp">
                                <el-table-column label="点位名称" min-width="120" prop="pointName"></el-table-column>
                                <!-- <el-table-column label="备注" min-width="120" prop="remark"></el-table-column> -->
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
                                        <div>
                                            <el-tooltip content="设备编号" placement="right">
                                                <span>{{ scope.row.ccsDevNo }}</span>
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
                                <!-- <el-table-column label="监控状态" min-width="80" prop="monitorStatus">
                                    <template slot-scope="scope">
                                        {{ scope.row.monitorStatus | formatMonitoringStatus }}
                                    </template>
                                </el-table-column> -->
                                <!--<el-table-column prop="monitorStatus" label="位置" min-width="80">-->
                                <!--<template slot-scope="scope">-->
                                <!--<div v-show="scope.row.positionX">X：{{scope.row.positionX}}</div>-->
                                <!--<div v-show="scope.row.positionY">Y：{{scope.row.positionY}}</div>-->
                                <!--</template>-->
                                <!--</el-table-column>-->
                                <el-table-column label="操作" min-width="300" prop="">
                                    <template slot-scope="scope">
                                        <div class="opera-btn-bidder">
                                            <des-btn v-if="!isHidden" @click="monitorTemp(scope.row)"
                                                        icon="start" v-has="'ccs-point-warehouse-dev-switch'"
                                                        v-show="scope.row.ccsMonitorRelationId&&(!scope.row.monitorStatus || scope.row.monitorStatus==='0')">
                                                开启监控
                                            </des-btn>
                                            <!-- <des-btn @click="cancelMonitorTemp(scope.row)" icon="forbidden"
                                                        v-has="'ccs-point-warehouse-dev-switch'"
                                                        v-show="scope.row.ccsMonitorRelationId&&scope.row.monitorStatus==='1'">
                                                取消监控
                                            </des-btn>
                                            <des-btn @click="ruleConfig('s,' + scope.row.ccsMonitorRelationId)"
                                                        v-show="scope.row.ccsMonitorRelationId"
                                                        icon="edit" v-has="'ccs-point-warehouse-dev-rulecfg'">配置规则
                                            </des-btn> -->
                                            <des-btn v-if="!isHidden" @click="editTemp(scope.row)" icon="edit"
                                                        v-has="'ccs-point-warehouse-dev-edit'">编辑点位
                                            </des-btn>
                                            <des-btn v-if="!isHidden" @click="addBandingDev(scope.row)" icon="edit"
                                                        v-has="'ccs-point-warehouse-dev-bind'">绑定设备
                                            </des-btn>
                                            <des-btn v-if="!isHidden" @click="deleteTemp(scope.row)" icon="delete"
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
        <page-right :css="{'width':'900px','padding':0}" v-if="showIndex !== -1" :show="showIndex !== -1" @right-close="resetRightBox">
            <temp-part :area="currentArea" :tempItem="tempItem" :form="form" :action="action" :index="showIndex" @refresh="refresh"
                       v-show="showIndex=== 0" />
            <temp-export :activeId="activeId" :index="showIndex" v-show="showIndex=== 2"/>
            <banding-dev :formItem="tempItem" :action="action" :index="showIndex" @refresh="refresh"
                         v-show="showIndex=== 3"/>
        </page-right>
    </div>
</template>
<script>
import TempPart from './form/temp';
import {CcsWarehouse, MonitoringObjGroup, Point} from '@/resources';
import TempExport from './form/temp-export';
import BandingDev from './form/banding-dev';

export default {
    components: {BandingDev, TempPart, TempExport},
    props : {
        form : {
            type : Object,
            default : () => {}
        },
        typeList : {
            type : Array,
            default : () => []
        },
        isHidden : {
            type : Boolean,
            default : false
        }
    },
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
            tempItem: {}
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
        // console.error( '点位' ) ;
    },
    watch: {
        keyWord() {
            this.queryTemp();
        },
        form : {
            handler( val ){
                this.queryTemp(1); // 请求 点位信息列表 默认请求第 1 页数据
            },
            immediate : true // 创建的时候开始执行 
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
            // console.error( 666 ) ;
            // 如果 this.currentArea 有 id 则是编辑库区, 否则添加库区
            this.$emit('open', this.currentArea, '2');
        },
        addTemp() {
            // console.error( this.typeList, 889 ) ;
            let typeObj = this.typeList.filter( v => v.id === this.form.monitordevType )[0] ;
            let typeTxt = typeObj ? typeObj['title'] : '';
            // 之前逻辑
            // if (this.currentArea.activeFlag === '0') {
            if (this.form.activeFlag === '0') {
                this.$notify.info({
                    message: `${ typeTxt }【${ this.form.monitordevCode }】已停用，无法新增点位。`
                });
                return;
            }
            this.showIndex = 0;
            this.action = 'add';
            this.tempItem = {};
        },
        editTemp(item) {
            this.showIndex = 0;
            this.$nextTick( () => {
                this.action = 'edit';
                this.tempItem = item;
            } ) ;
        },
        addBandingDev(item) {
            let typeObj = this.typeList.filter( v => v.id === this.form.monitordevType )[0] ;
            let typeTxt = typeObj ? typeObj['title'] : '';

            if (this.currentArea.activeFlag === '0') {
                this.$notify.info({
                    message: `${ typeTxt }【${ this.form.monitordevCode }】已停用，无法绑定设备。`
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
            // console.error( 88 ) ;
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
            this.currentArea = item;
            this.queryTemp(1);
        },
        ruleConfig(id) {
            this.$store.commit('initUnitId', id);
        },
        ruleAllConfig(id) {
            // let id = '42NclUwm4y45lkd2Snj' ;
            // this.currentArea.id = id ;

            // 判断是否所有点位都配置了设备
            let params = Object.assign({}, {
                ccsWarehouseId: this.currentArea.id,
                keyWord: this.keyWord
            });
            let unbandingFlag = false;

            
            // yxh 之前逻辑
            // Point.queryPointList(this.currentArea.id, params).then(res => {
            Point.queryPointList(this.form.id, params).then(res => {
                let pointList = res.data;
                
                if (pointList && Array.isArray( pointList ) && !pointList.length) {
                    this.$notify.info({
                        message: '点位信息列表为空，无法进行配置规则的操作。'
                    });
                    return;
                }

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
                keyWord: this.keyWord
                // pointType : this.form.monitordevType
            });
            this.loadingDataTemp = true;

            // yxh 之前参数
            // Point.queryWareHousePointList(this.currentArea.id, params).then(res => {
            Point.queryWareHousePointList(this.form.id, params).then(res => {
                if( res && res.data ){
                    this.tempList = res.data.list || [];
                    this.pager.count = res.data.count;
                    this.loadingDataTemp = false; 
                }
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
        }
        
    }
};
</script>
