<style lang="scss" scoped>
  @import "../../../../../assets/scss/mixins";

  .d-table > div.d-table-right {
    padding: 0;
  }

  .p-r-20 {
    padding-left: 20px;
    padding-right: 20px;
  }

  .container.d-table.f-w {
    width: 100%;
  }

  .show-list .list-item {
    padding: 0 10px;
    line-height: 40px;
  }

  .alarm-sign {
    font-size: 30px;
    margin-left: 10px;

    &.normal {
      color: $activeColor;
    }

    &.danger {
      color: $error-color;
    }
  }

  /*.d-table-left_scroll_content {*/
  /*padding-right: 15px;*/
  /*}*/

  .des-btn__position {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    /*.btn-circle {*/
    /*background: #fff;*/
    /*&:hover {*/
    /*background: #409EFF;*/
    /*}*/
    /*}*/
  }

  .d-table > div.d-table-left {
    width: 180px;
    min-width: 180px;
  }
</style>
<template>
  <div>
    <div class="container d-table f-w">
      <div class="d-table-left">
        <h2 class="header">
          <!--<span class="pull-right" v-has="'ccs-warehouse-dev-bind'">-->
          <!--<a v-has="'show'" href="#" class="btn-circle" @click.stop.prevent="addGraph">-->
          <!--<i class="el-icon-t-plus"></i>-->
          <!--</a>-->
          <!--</span>-->
          分布图列表
        </h2>
        <el-scrollbar :style="'height:'+ (bodyHeight-20) + 'px'" class="d-table-left_scroll" tag="div">
          <div class="d-table-left_scroll_content">
            <div v-if="loadingDataWare">
              <oms-loading :loading="loadingDataWare"></oms-loading>
            </div>
            <div class="empty-info mini" v-else-if="graphList.length===0">
              暂无信息
            </div>
            <div v-else>
              <ul class="show-list">
                <li :class="{'active':item.backgroundId===currentGraph.backgroundId}" :key="index"
                    @click="showWarehouseDetail(item)"
                    class="list-item"
                    v-for="(item,index) in graphList">
                  {{item.backgroundName}}
                  <span class="des-btn__position" v-show="item.backgroundId===currentGraph.backgroundId">
                     <!--<des-btn v-has="'ccs-warehouse-dev-unbind'" icon="delete" @click="deleteGraph(item)"></des-btn>-->
                    <span class="des-btn">
                      <a @click.stop.prevent="showBigMap" class="btn-circle" href="#">
                      <i class="el-icon-zoom-in"></i></a>
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="d-table-right">
        <el-scrollbar :style="'height:'+ (bodyHeight+20) + 'px'" class="d-table-left_scroll" tag="div">
          <div v-if="loadingDataTemp">
            <oms-loading :loading="loadingDataTemp"></oms-loading>
          </div>
          <!--<div v-else-if="!currentGraph.backgroundId" class="empty-info">-->
          <!--暂无信息-->
          <!--</div>-->
          <div class="content-right" v-else="">
            <!--<div class="form-header-part part-bg p-r-20">-->
            <!--<el-row>-->
            <!--<el-col :span="18">-->
            <!--<div class="header">-->
            <!--<div class="sign f-dib"></div>-->
            <!--<h3 class="tit f-dib index-tit">绑定仓库</h3>-->
            <!--</div>-->
            <!--</el-col>-->
            <!--<el-col :span="6" align="right"></el-col>-->
            <!--</el-row>-->
            <!--<div class="content clearfix">-->
            <!--<oms-row label="仓库编码" :span="3" style="font-size: 14px">{{warehouseList.join('，')}}</oms-row>-->
            <!--</div>-->
            <!--</div>-->
            <div class="form-header-part part-bg p-r-20">
              <el-row>
                <el-col :span="18">
                  <div class="header">
                    <div class="sign f-dib"></div>
                    <h3 class="tit f-dib index-tit">{{currentGraph.backgroundName}}</h3>
                    <span style="font-size: 14px;margin-left: 15px">仓库编码: {{warehouseList.join('，')}}</span>
                    <f-a :class="['alarm-sign', alarmSignClass]" name="alarm" v-show="isAlarming"></f-a>
                    <audio hidden id="alarmMusic" src="/static/audio/alarm.mp3"></audio>
                  </div>
                </el-col>
                <!--<el-col :span="6" align="right" v-has="'ccs-warehouse-dev-edit'" v-show="tmData.length">-->
                <!--<el-button size="mini" type="primary" plain="" round="" @click="doEditPos" v-if="!editPosition">编辑设备位置-->
                <!--</el-button>-->
                <!--<div v-else>-->
                <!--<el-button size="mini" type="primary" plain="" round="" @click="savePos">保存-->
                <!--</el-button>-->
                <!--<el-button size="mini" type="primary" plain="" round="" @click="cancelEditPos">取消-->
                <!--</el-button>-->
                <!--</div>-->
                <!--</el-col>-->
              </el-row>
              <div class="content clearfix">
                <div :style="svgFrameStyle" id="svgPart" style="position: relative">
                  <tm :color="item.color" :item="item.devDetail" :key="index" :position="item.position"
                      :read-only="!editPosition"
                      :size="12" :tmData="tmData" ref="tm-part" v-for="(item, index) in tmData">
                    {{item.text}}
                  </tm>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <page-right :css="{'width':'900px','padding':0}" :show="showIndex !== -1" @right-close="resetRightBox">
      <form-part :form-item="currentGraph" :index="showIndex" @refresh="refresh"></form-part>
    </page-right>
    <el-dialog :fullscreen="true" :title="currentGraph.backgroundName" :visible.sync="isShowBigMap"
               custom-class="custom-dialog-dev"
               width="100%">
      <div :style="svgFrameStyle" style="position: relative">
        <tm :color="item.color" :iconScale="1.2" :item="item.devDetail" :key="index" :position="item.position"
            :read-only="true" :size="12" :tmData="tmData" ref="tm-big-part" v-for="(item, index) in tmData">
          {{item.text}}
        </tm>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    import Tm from '@/components/common/tm';
    import Bg from '@/assets/img/empty-type.png';
    import Bg1 from '@/assets/img/empty.png';
    import TimeMixins from '@/mixins/timeMixin';
    import FormPart from './form/edit-form';

    export default {
        components: {Tm, FormPart},
        mixins: [TimeMixins],
        data: function () {
            return {
                editPosition: false,
                loadingDataWare: false,
                loadingDataLocaList: false,
                loadingDataTemp: false,
                graphList: [],
                areaList: [],
                tempList: [],
                showIndex: -1,
                currentGraph: {},
                pager: {
                    currentPage: 1,
                    count: 0,
                    pageSize: 10
                },
                activeId: '',
                accordionId: '',
                deleteStore: this.$parent.deleteStore,
                ary: [Bg, Bg1],
                scaling: 1,
                currentHeight: 0,
                currentWidth: 0,
                alarmSignClass: {
                    normal: true,
                    danger: false
                },
                isAlarm: false,
                alarmMusic: null,
                isShowBigMap: false
            };
        },
        computed: {
            bodyHeight: function () {
                return parseInt(this.$store.state.bodyHeight, 10) - 20;
            },
            tmData() {
                this.tempList.filter(f => !f.positionX || !f.positionY).map((m, index) => {
                    m.initPositionX = (index - Math.floor(index / 16) * 16 + 1) * 50;
                    m.initPositionY = (Math.floor(index / 16) + 1) * 25;
                    m.isNotAlloat = true;
                });
                return this.tempList.map((m) => {
                    if (m.warnFlag) {
                        this.isAlarm = true;
                    }
                    return {
                        color: this.getColor(m),
                        position: {
                            x: m.isNotAlloat ? m.initPositionX : (m.positionX * this.scaling),
                            y: m.isNotAlloat ? m.initPositionY : (m.positionY * this.scaling)
                        },
                        text: m.devType === '4' ? m.humidity + '%' : m.temperature + '℃',
                        devDetail: m
                    };
                }) || [];
            },
            svgFrameStyle() {
                let height = this.currentHeight ? this.currentHeight + 'px' : (this.bodyHeight) + 'px';
                let width = this.currentWidth ? this.currentWidth + 'px' : '866px';
                return {
                    height,
                    width,
                    backgroundImage: `url(${this.currentGraph.backgroundUrl})`,
                    'background-repeat': 'no-repeat',
                    'background-size': 'contain'
                };
            },
            warehouseList() {
                let wSet = new Set();
                this.tempList.forEach(i => {
                    wSet.add(i.warehouseCode);
                });
                return [...wSet];
            },
            isAlarming() {
                return this.tempList.some(s => s.warnFlag);
            }
        },
        watch: {
            isShowBigMap(val) {
                if (val) return;
                this.currentHeight = 0;
                this.currentWidth = 0;
                this.setScaling();
                this.tempList = [];
            }
        },
        mounted() {
            this.clearAllTimes();
            this.queryGraphList();
            this.switchAlarm();
            this.alarmAudio();
            this.setTimes(setTimeout(this.loopQueryDevs, 10000));
            let id = this.$route.params.id;
            if (id === ':id') this.$router.push(this.$route.path.replace(':', ''));
        },
        methods: {
            getColor(m) {
                if (m.monitorStatus !== '1') return '#666';
                if (!m.warnFlag) return '#0f0';
                if (m.warnTypes && m.warnTypes.includes(4)) return '#26d6dd';
                return '#f00';
            },
            setScaling() {
                let url = this.currentGraph.backgroundUrl;
                if (!url) {
                    this.scaling = 1;
                    this.currentHeight = 0;
                    this.currentWidth = 0;
                    return;
                }
                let width = 866;
                let image = new Image();
                image.src = url;
                image.onload = () => {
                    let l = width / image.width;
                    this.currentHeight = image.height * l;
                    this.scaling = l;
                    // 设置完缩放值后，在查询
                    this.queryDevs();
                };
            },
            setBigScaling(width, height) {
                let url = this.currentGraph.backgroundUrl;
                if (!url) {
                    this.scaling = 1;
                    this.currentHeight = 0;
                    this.currentWidth = 0;
                    return;
                }
                let image = new Image();
                image.src = url;
                image.onload = () => {
                    // 宽比
                    let wp = width / image.width;
                    // 高比
                    let hp = height / image.height;
                    // 定宽, 求高
                    let ch = image.height * wp;
                    // 定高, 求宽
                    let cw = image.width * hp;
                    // 定高, 求宽差
                    let dw = width - cw;
                    // 定宽, 高差
                    let dh = height - ch;
                    // 两种情况都符定宽符合，则定宽
                    if (!(dw < 0) && !(dh > 0) || (!(dh < 0) && dw < 0)) {
                        this.currentWidth = width;
                        this.currentHeight = ch;
                        this.scaling = wp;
                    }
                    // 定高符合, 则定高
                    if (dh < 0 && !(dw < 0)) {
                        this.currentWidth = cw;
                        this.currentHeight = height;
                        this.scaling = hp;
                    }
                    // 都不符合, 则定宽 出现滚动
                    if (dw < 0 && dh < 0) {
                        this.currentWidth = width;
                        this.currentHeight = ch;
                        this.scaling = wp;
                    }
                };
            },
            switchAlarm() {
                let {alarmSignClass, isAlarm, switchAlarm, alarmMusic, alarmAudio} = this;
                if (isAlarm) {
                    alarmSignClass.normal = false;
                    alarmSignClass.danger = !alarmSignClass.danger;
                } else {
                    alarmMusic && alarmMusic.pause();
                    alarmSignClass.normal = true;
                    alarmSignClass.danger = false;
                }
                this.setTimes(setTimeout(switchAlarm, 500));
            },
            alarmAudio() {
                let {alarmAudio, isAlarm, alarmMusic} = this;
                !alarmMusic && (alarmMusic = document.getElementById('alarmMusic'));
                if (isAlarm) {
                    if (alarmMusic) {
                        alarmMusic.currentTime = 0;
                        alarmMusic.play();
                    }
                } else {
                    alarmMusic && alarmMusic.pause();
                }
                this.setTimes(setTimeout(alarmAudio, 2000));
            },
            resetRightBox() {
                this.showIndex = -1;
            },
            addGraph() {
                this.showIndex = 1;
            },
            showWarehouseDetail(item) {
                this.currentGraph = item;
                this.activeId = item.backgroundId;
                this.tempList = [];
                this.isAlarm = false;
                this.setScaling();
                this.$router.push(`/monitoring/org-distribution/${item.backgroundId ? item.backgroundId : 'id'}`);
            },
            showBigMap() { // 显示大图
                let width = document.body.clientWidth;
                let height = document.body.clientHeight - 44;
                this.setBigScaling(width, height);
                setTimeout(() => {
                    this.editPosition = false;
                    this.isShowBigMap = true;
                });
            },
            refresh() {
                this.queryGraphList();
                this.resetRightBox();
            },
            queryGraphList: function () {
                this.loadingDataWare = true;

                // yxh 修改所有带请求路径 /warehouseDevImage 的地址修改为 /warehousePointImage
                // this.$http.get('/warehouseDevImage/org-images').then(res => {
                this.$http.get('/warehousePointImage/org-images').then(res => {
                    this.currentGraph = {};
                    this.graphList = res.data.ccsWarehouseImageDTOS;
                    let id = this.$route.params.id;
                    if (id !== ':id' && this.graphList.some(i => i.backgroundId === id)) {
                        this.activeId = id;
                        this.graphList.forEach(i => {
                            if (i.backgroundId === id) {
                                this.showWarehouseDetail(i);
                            }
                        });
                    } else {
                        this.activeId = this.graphList.length ? this.graphList[0].backgroundId : '';
                        this.graphList.length && this.showWarehouseDetail(this.graphList[0]);
                    }
                    this.loadingDataWare = false;
                });
            },
            queryDevs: function () {
                if (!this.activeId) return;
                // this.tempList = [];

                // yxh 修改所有带请求路径 /warehouseDevImage 的地址修改为 /warehousePointImage
                // this.$http.get(`/warehouseDevImage/org/${this.activeId}`).then(res => {
                this.$http.get(`/warehousePointImage/org/${this.activeId}`).then(res => {
                    let list = res.data.ccsWarehouseImageDevRelationDTOList;
                    if (list.length && list[0].backgroundId !== this.activeId) return;
                    this.tempList = list;
                });
            },
            loopQueryDevs() {
                this.queryDevs();
                this.setTimes(setTimeout(this.loopQueryDevs, 10000));
            },
            doEditPos() {
                this.editPosition = true;
                this.tmData.push({});
                this.tmData.pop();
                this.clearAllTimes();
            },
            cancelEditPos() {
                this.editPosition = false;
                this.switchAlarm();
                this.alarmAudio();
                this.loopQueryDevs();
            },
            savePos() {
                let dataArr = [];
                this.$refs['tm-part'].forEach(item => {
                    dataArr.push(item.getTmInfo());
                });
                this.onSubmit(dataArr);
            },
            refreshTemp() {
                this.queryDevs();
                this.resetRightBox();
            },
            // 删除分布图
            deleteGraph(item) {
                this.$confirmOpera('是否删除分布图' + item.backgroundName, () => {
                    this.$httpRequestOpera(this.$http({
                        method: 'delete',

                        // yxh 修改所有带请求路径 /warehouseDevImage 的地址修改为 /warehousePointImage
                        // url: 'warehouseDevImage',
                        url: 'warehousePointImage',

                        data: [item.backgroundId]
                    }), {
                        successTitle: '删除成功',
                        errorTitle: '删除失败',
                        success: () => {
                            this.queryGraphList();
                        }
                    });
                });
            },
            // 批量保存设备位置
            onSubmit(dataArr) {
                const form = dataArr.map(m => ({
                    id: m.id,
                    positionX: m.x / this.scaling,
                    positionY: m.y / this.scaling
                }));

                // yxh 修改所有带请求路径 /warehouseDevImage 的地址修改为 /warehousePointImage
                // const http = this.$http.put('/warehouseDevImage', form);
                const http = this.$http.put('/warehousePointImage', form);
                this.$httpRequestOpera(http, {
                    successTitle: '编辑成功',
                    errorTitle: '编辑失败',
                    success: res => {
                        this.cancelEditPos();
                    },
                    error: () => {

                    }
                });
            }
        }
    };
</script>
