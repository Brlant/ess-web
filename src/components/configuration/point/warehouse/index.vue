<style lang="scss" scoped>

.content-sp {
    overflow: hidden;
    font-size: 14px;
}

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
            <div class="d-table-left">
                <scene-element-selector v-on:scene-element-change="handleSceneElementChange"/>
            </div>
            <div class="d-table-right">
                <div class="empty-info" v-if="!currentElement.scenesElementId">
                    暂无信息
                </div>
                <div class="content-right" v-else>
                    <div class="form-header-part part-bg p-r-20">
                        <div class="header">
                            <div class="sign f-dib"></div>
                            <h3 class="tit f-dib index-tit">场景对象信息</h3>
                        </div>
                        <div class="content content-sp">
                            <el-col :span="6">
                                <oms-row :span="10" label="场景对象编码">{{ currentElement.scenesElementName }}</oms-row>
                            </el-col>
                            <el-col :span="4">
                                <oms-row :span="10" label="状态">
                                    <el-tag type="success" v-show="currentElement.activeFlag === '1'">启用</el-tag>
                                    <el-tag type="danger" v-show="currentElement.activeFlag === '0'">停用</el-tag>
                                </oms-row>
                            </el-col>
                        </div>
                    </div>
                    <div class="form-header-part mt-10 p-r-20">
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
                                    <el-button :plain="true" @click="addPoint" v-has="'ccs-point-configuration-add'">
                                        新增监控点位
                                    </el-button>
                                    <!-- <el-button :plain="true" @click="ruleAllConfig(currentElement.scenesElementId)"
                                               v-has="'ccs-point-warehouse-dev-rulecfg'">
                                        配置规则
                                    </el-button> -->
                                </el-button-group>
                            </el-col>
                        </el-row>
                        <div class="content">
                            <div class=" mt-10">
                                <el-table class="table" :data="pointList" :max-height="tableHeight"
                                          header-row-class-name="table-header-color"
                                          style="" v-loading="loadingPoint">
                                    <el-table-column label="点位名称" prop="ccsPointName"></el-table-column>
                                    <el-table-column label="绑定设备个数" prop="deviceCount">
                                    </el-table-column>
                                    <el-table-column label="监控状态" prop="monitorStatus">
                                        <template slot-scope="scope">
                                            <el-tag type="success" v-show="scope.row.activeFlag+'' === '1'">启用</el-tag>
                                            <el-tag type="danger" v-show="scope.row.activeFlag+'' === '0'">停用</el-tag>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="backgroundUrl"
                                        label="图标"
                                        width="180">
                                        <template slot-scope="scope">
                                            <!-- <i style="font-size:25px" :class="showIcon(scope.row.backgroundUrl)"></i> -->
                                            <el-button-group>
                                                <img style="max-width:50px;max-height:50px;margin-right:5px;" title="正常图标" :src="scope.row.backgroundUrl">
                                                <img style="max-width:50px;max-height:50px;margin-right:5px;" title="告警图标" :src="scope.row.backgroundUrlEx">
                                                <img style="max-width:50px;max-height:50px;margin-right:5px;" title="离线图标" :src="scope.row.backgroundUrlOffline">
                                                <img style="max-width:50px;max-height:50px;margin-right:5px;" title="停止图标" :src="scope.row.backgroundUrlStop">
                                            </el-button-group>

                                        </template>
                                        </el-table-column>
                                    <el-table-column
                                        prop="createdTime"
                                        label="创建时间">
                                        <template slot-scope="scope">
                                            {{formatTime(scope.row.createdTime)}}
                                        </template>
                                        </el-table-column>
                                    <el-table-column label="操作" prop="">
                                        <template slot-scope="scope">
                                            <div class="opera-btn-bidder">
                                                <!-- <des-btn @click="monitorTemp(scope.row)"
                                                         icon="start" v-has="'ccs-point-warehouse-dev-switch'"
                                                         v-show="scope.row.ccsMonitorRelationId&&(!scope.row.monitorStatus || scope.row.monitorStatus==='0')">
                                                    开启监控
                                                </des-btn>
                                                <des-btn @click="cancelMonitorTemp(scope.row)" icon="forbidden"
                                                         v-has="'ccs-point-warehouse-dev-switch'"
                                                         v-show="scope.row.ccsMonitorRelationId&&scope.row.monitorStatus==='1'">
                                                    取消监控
                                                </des-btn> -->
                                                <des-btn @click="ruleConfig('s,' + scope.row.ccsPointId)"
                                                         v-show="scope.row.ccsPointId"
                                                         icon="edit" v-has="'ccs-point-rule-binding'">配置规则
                                                </des-btn>
                                                <des-btn @click="editPoint(scope.row)" icon="edit"
                                                         v-has="'ccs-point-configuration-edit'">编辑
                                                </des-btn>
                                                <des-btn @click="addBandingDev(scope.row)" icon="edit"
                                                         v-has="'ccs-point-dev-binding'">绑定设备
                                                </des-btn>
                                                <!--<des-btn @click="editBandingDev(scope.row)" icon="edit"
                                                         v-show="scope.row.ccsDevId"
                                                         v-has="'ccs-scene-dev-unbind'">编辑绑定设备
                                                </des-btn>-->
                                                <des-btn @click="deleteTemp(scope.row)" icon="delete"
                                                         v-has="'ccs-point-configuration-del'">删除
                                                </des-btn>
                                                <!-- <des-btn
                                                    @click="$turnPointDevDate(scope.row, $formatDevType(scope.row))"
                                                    icon="detail"
                                                    v-has="'ccs-point-warehouse-data-history'">历史数据
                                                </des-btn> -->
                                                <!--<des-btn v-has="'ccs-scene-dev-edit'" icon="edit" @click="editPointLocation(scope.row)">编辑位置</des-btn>-->
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="text-center" v-show="pointList.length">
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
           <point :element="currentElement" :scene="currentScene" :item="form" :action="action" :index="showIndex" @refresh="refresh"
                       v-if="showIndex=== 0"/>
            <!-- <temp-export :activeId="activeId" :index="showIndex" v-show="showIndex=== 2"/> -->
            <banding-dev :formItem="form" :action="action" :index="showIndex" @refresh="refresh"
                         v-if="showIndex=== 3" :element="currentElement" :scene="currentScene"/>
        </page-right>
    </div>
</template>
<script>
import point from './form/point';
import { MonitoringObjGroup, Point} from '@/resources';
// import TempExport from './form/temp-export';
import SceneElementSelector from '@/components/common/SceneElementSelector';
import BandingDev from './form/banding-dev';
import { CcsScene,CcsSceneElement,CcsPoint } from '@/resources';

export default {
    components: {BandingDev, point,SceneElementSelector},
    data: function () {
        return {
            loadingDataSceneElement:false,
            loadingPoint:false,
            pointList:[],
            currentScene: {},
            currentElement:{},
            // activeSceneId:'',
            showIndex: -1,
            action: '',
            keyWord:'',//point filter
            pager: {
                currentPage: 1,
                count: 0,
                pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
            },
            form:{}//添加编辑使用
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
        // console.log(this.scene);
        //this.queryScene();
    },
    watch: {
        keyWord() {
            this.queryPoint(1);
        }
    },
    methods: {
        handleSceneElementChange(e,s){
            // console.log('handleSceneElementChange');
            this.currentScene = s;
            this.currentElement = e;
            this.queryPoint(1);
        },
        showIcon(icon){
              let a = {};
              a[icon] = true;
              return a;
            },
        formatTime(v) {
                return this.$moment(v).format('YYYY-MM-DD HH:mm:ss');
            },
        showRecordDate: function (data) {
            return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
        },
        addPoint() {
            if (this.currentElement.activeFlag==='0') {
                this.$notify.info({
                    message: '场景对象【' + this.currentElement.scenesElementName + '】已停用，无法新增点位。'
                });
                return;
            }
            this.showIndex = 0;
            this.action = 'add';
            this.form={};
        },
        editPoint(item) {
            this.showIndex = 0;
            this.action = 'edit';
            item.warehouseId = item.scenesId;
            this.form = item;
        },
        addBandingDev(item) {
            if (this.currentElement.activeFlag==='0') {
                this.$notify.info({
                    message: '场景对象【' + this.currentElement.scenesElementName + '】已停用，无法绑定设备。'
                });
                return;
            }

            // item.warehouseId = item.scenesId;
            // console.log(item);
            this.form = Object.assign({}, item);
            this.showIndex = 3;
            this.action = 'edit';
        },
        editBandingDev(item) {
            this.showIndex = 3;
            this.action = 'edit';
            item.warehouseId = item.scenesId;
            this.form = item;
        },
        deleteTemp(item) {
            this.$confirmOpera(`是否删除点位"${item.ccsPointName}"`, () => {
                this.$httpRequestOpera(
                    this.$http.delete(`/ccsPoint/${item.ccsPointId}`, {}), {
                        successTitle: '删除成功',
                        errorTitle: '删除失败',
                        success: () => {
                            this.refresh();
                        }
                    });
            });
        },
        refresh() {
            this.queryPoint(1);
            this.resetRightBox();
        },
        resetRightBox() {
            this.showIndex = -1;
        },
        handleSizeChange(val) {
            this.pager.pageSize = val;
            window.localStorage.setItem('currentPageSize', val);
            this.queryPoint(1);
        },
        handleCurrentChange(val) {
            this.queryPoint(val);
        },

        showElementDetail(item) {
            this.currentElement = item;
            //console.log(item)
            this.queryPoint(1);
        },
        ruleConfig(id) {
            this.$store.commit('initUnitId', id);
        },
        ruleAllConfig(id) {
            // 判断是否所有点位都配置了设备
            let params = Object.assign({}, {
                ccsWarehouseId: this.currentElement.scenesElementId,
                keyWord: this.keyWord
            });
            let unbandingFlag = false;
            Point.queryPointList(this.currentElement.scenesElementId, params).then(res => {
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

        queryPoint(pageNo) {
            // console.log(this.currentElement.scenesElementId);
            this.form = {};
            this.pager.currentPage = pageNo;
            let params = Object.assign({}, {
                // activeFlag:1,
                page: pageNo,
                size: this.pager.pageSize,
                scenesElementId: this.currentElement.scenesElementId,
                ccsPointName: this.keyWord
            });
            this.loadingPoint = true;
            CcsPoint.query(params).then(res => {
                this.pointList = res.data.data.list || [];
                // console.log(this.pointList);
                this.pager.count = res.data.data.total;
                // console.log("page total",this.pager.count);
                this.loadingPoint = false;
            });
        },
        editPointLocation(row) {
            this.form = row;
            // item.warehouseId = item.scenesId;
            this.showIndex = 1;
        },
        exportSceneTempData(row) {
            this.showIndex = 2;
        }
    }
};
</script>
