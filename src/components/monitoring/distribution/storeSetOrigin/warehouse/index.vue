<style lang="scss" >
  @import "../../../../../assets/scss/mixins";

#myTablesInfo{
  .d-table > div.d-table-right {
    width:calc( 100% - 222px ) ;
    padding: 0;
  }

  .p-r-20 {
    padding-left: 20px;
    padding-right: 20px;
  }

  .container.d-table.f-w {
    width: 100%;
  }

  .show-list{ width:220px; overflow-x:hidden; }

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

  .des-btn_name{ text-overflow:ellipsis; overflow:hidden; white-space:nowrap; }

  .layoutList{
    .el-scrollbar__wrap{ width:100%;  }
  }

  .des-btn__position {
    /*
      之前样式信息
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    */


    /*.btn-circle {*/
    /*background: #fff;*/
    /*&:hover {*/
    /*background: #409EFF;*/
    /*}*/
    /*}*/

    padding-right:8px;
  }

  .d-table > div.d-table-left {
    width: 222px;
    /*
    min-width: 180px;
    width: 180px;
    */
  }

  .form-header-part{ width:100%; height:100%; position:relative; overflow:hidden; }
  /*.form-header-part{ height:100%;  }*/

  .form-header-part.is-mini {
    .header {
      line-height: normal;
    }

    .top {
      width:100%;
      display: flex;
      align-items: center;
    }

    .header-right {
      display: flex;
      align-items: center;
    }
  }

  .flexDis{ display:flex; }

  .flexDirV{ flex-direction:column; }
  .flexDirH{ flex-direction:row; }
  .flexContentS{ justify-content:flex-start; }
  .flexContentC{ justify-content:center; }
  .flexContentE{ justify-content:flex-end; }
  .flexContentA{ justify-content:space-around; }
  .flexContentB{ justify-content:space-between; }
  .flexContentV{ justify-content:space-evenly; }
  .flexAlignS{ align-items:flex-start; }
  .flexAlignC{ align-items:center; }
  .flexAlignE{ align-items:flex-end; }
  .flexAlignT{ align-items:stretch; }

  .applyFlex{ flex-grow:1; }

  .flexWStatic{ flex-shrink:0; }
  .flexWAuto{ flex-shrink:1; }

  #d-table-left_scroll .el-scrollbar__view, .content-right{ width:100%; height:100%; position:relative; }
  #svgPart{ width:100%!important; height:calc(100% - 28px)!important; position:relative; background-size:100% 100%!important; overflow:auto; box-sizing:border-box; }
  .imgUrlInfo{ overflow-x:auto; overflow-y:auto; 
    /*
    &::-webkit-scrollbar{ width:.4em; height:.5em; background:rgba(0,0,0,0); border-radius:1em; overflow:hidden; }
    &::-webkit-scrollbar:hover{ background:rgba(0,0,0,0); }
    &::-webkit-scrollbar-thumb{ background:rgba(24, 144, 255, 1); border:solid 1px rgba(0,0,0,.1); border-radius:1em; }
    &::-webkit-scrollbar-thumb:hover{  }
    */
  }

 }

 .content{ width:100%!important; height:100%!important; position:relative; overflow:hidden; box-sizing:border-box; }

 .titleTxt{ display:flex; justify-content:space-between; padding:.1em .7em .3em; }
    .dragContainer{ width:400px; height:auto; z-index:2!important; position:absolute; color:white; }
    .dragContainer h3{  color:white; text-shadow:1px 1px 3px black; position:absolute; z-index:3; width:100%; padding:0 0 0 .8em; overflow:hidden; }
    .dragContainer h3:hover span{ right:0; }

    .containMark{ width:100%; height:100%; left:0; top:0; position:absolute; z-index:2; }
    .dragContainer h3 span{ text-align:center; transition:right 200ms ease; cursor:pointer; font-weight:normal; font-size:1.2em; width:20px; height:20px; overflow:hidden; position:absolute; right:-20px; top:0; background:rgba(0,0,0,.7); line-height:17px; padding:0; margin:0; }
    .dragContainer h3 span:hover{ background:rgba(245, 108, 108, 1); color:white; }
    .myiframe{ width:100%; height:100%; position:absolute; left:0; top:0; z-index:0; }
</style>
<template>
  <div id="myTablesInfo">
    <div class="container d-table f-w flexDis">
      <div class="d-table-left ">
        <h2 class="header">
            <span class="pull-right" v-has="'ccs-warehouse-dev-edit'">
              <a @click.stop.prevent="addGraph" class="btn-circle" href="#" v-has="'show'">
                <i class="el-icon-t-plus"></i>
              </a>
            </span>
          分布图列表
        </h2>
        <el-scrollbar :style="'height:'+ (bodyHeight-20) + 'px'" class="d-table-left_scroll layoutList" tag="div">
          <div class="d-table-left_scroll_content">
            <div v-if="loadingDataWare">
              <oms-loading :loading="loadingDataWare"></oms-loading>
            </div>
            <div class="empty-info mini" v-else-if="graphList.length===0">
              暂无信息
            </div>
            <div style="width:100%; overflow-x:hidden;" v-else>
              <ul class="show-list">
                <li :class="{'active':item.backgroundId===currentGraph.backgroundId}" :key="index"
                    @click="showWarehouseDetail(item)"
                    class="list-item flexDis flexWStatic"
                    v-for="(item,index) in graphList">
                  <span class="des-btn_name applyFlex" :title="item.backgroundName">{{item.backgroundName}}</span>
                  <span class="des-btn__position flexDis" v-show="item.backgroundId===currentGraph.backgroundId">
                      <des-btn @click="updateGraph(item)" icon="edit" v-has="'ccs-warehouse-dev-update'"></des-btn>
                      <des-btn @click="deleteGraph(item)" icon="delete" v-has="'ccs-warehouse-dev-edit'"></des-btn>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </el-scrollbar>
      </div>
      
      <!-- <div class="d-table-right applyFlex flexWStatic"> -->
      <div class="d-table-right">
        <!-- 
          之前标签
          <el-scrollbar :style="'height:'+ (bodyHeight+20) + 'px'" class="d-table-left_scroll" id="d-table-left_scroll" tag="div"> 
        -->
        <div :style="'height:'+ (bodyHeight+20) + 'px;'" class="d-table-left_scroll" id="d-table-left_scroll" tag="div">
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


            <!--<div class="form-header-part is-mini part-bg flexDis flexDirV flexWStatic"  ref="topRow"> -->
            <div class="form-header-part is-mini part-bg"  ref="topRow">
              <el-row class="top">
                <el-col :span="14">
                  <div class="header" >
                    <div class="sign f-dib index"></div>
                    <div class="header-right">
                      <h3 class="tit f-dib">{{currentGraph.backgroundName}}</h3>
                      <div style="font-size: 14px;margin-left: 15px">
                          <el-tooltip :content="warehouseList.join('，')" placement="right" style="width: 200px">
                              <span> 仓库编码</span>
                          </el-tooltip>
                      </div>
                      <f-a :class="['alarm-sign', alarmSignClass]" name="alarm" v-show="isAlarming"></f-a>
                      <audio hidden id="alarmMusic" ref="alarmMusic" src="@/../static/audio/alarm.mp3"></audio>
                    </div>
                  </div>
                </el-col>
                <el-col :span="10" align="right" v-has="'ccs-warehouse-dev-edit'" v-show="tmData.length">
                  <el-button-group>
                    <el-button @click="pointConfigFn" v-if='!isPointConfig' plain="" size="mini">原点设置</el-button>
                    <el-button @click="savePointConfigFn" v-if='isPointConfig' plain="" size="mini">保存原点设置</el-button>
                    <el-button @click="cancelPointConfigFn" v-if='isPointConfig' plain="" size="mini">取消原点设置</el-button>
                    <el-button @click="showBigMap" plain="" size="mini">查看大图</el-button>
                    <el-button @click="unitRight" plain="" size="mini" v-has="'ccs-org-devmap-authorized'">单位授权</el-button>
                    <!--<el-button plain="" size="mini" v-has="'ccs-org-devmap-authorized'">单位授权</el-button>-->
                    <el-button @click="doEditPos" plain="" size="mini" v-if="!editPosition">编辑设备位置
                    </el-button>
                    <template v-else>
                      <el-button @click="savePos" plain="" size="mini">保存
                      </el-button>
                      <el-button @click="cancelEditPos" plain="" size="mini">取消
                      </el-button>
                    </template>
                  </el-button-group>
                </el-col>
              </el-row>
              <!-- <div class="content clearfix applyFlex flexDis flexDirV flexWStatic" :style="{ 'width': currentWidth + 'px', 'height' : currentHeight + 'px' }"> -->
              <!-- <div class="content clearfix applyFlex flexDis flexDirV flexWStatic"> -->
              <div class="content clearfix">
                
                <VueDraggableResizable
                  :x="v.x"
                  :y="v.y"
                  :w="v.width"
                  :h="v.height"
                  :min-width="106"
                  :min-height="60"
                  :lock-aspect-ratio="true"
                  :parent="true"
                  class="dragContainer"
                  @resizing="(x, y, width, height) => { resize( x, y, width, height, v ) }"
                  @dragging="(x, y) => { drag( x, y, v ) }"
                  @activated="onActivated( v )"
                  @deactivated="onDeactivated( v )"
                  @resizestop="( x, y, width, height ) => { onResizstop( v, x, y, width, height ) }"
                  v-for="( v, n ) in playObj"
                  :key="v.pointId"
                >
                  <h3 class="titleTxt">{{ v.pointName }}{{ v.isActived }}<span @click="closeAlertFn( v.ccsDevId )">&times;</span></h3>
                  <div class="containMark" v-if="isActived"></div>
                  <iframe data-v-5a9dd0f5="" class="myiframe" ref="myiframe" :src="v.src" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen"></iframe>
                </VueDraggableResizable>

                <!-- 之前逻辑 
                  <div :style="svgFrameStyle" id="svgPart" ref="svgPart" class="svgPart applyFlex" > 
                <div id="svgPart" ref="svgPart" class="svgPart imgUrlInfo" @mousemove='e => e.preventDefault()' >
                -->
                
                  <div id="svgPart" ref="svgPart" class="svgPart applyFlex imgUrlInfo flexWStatic" @mousemove='e => e.preventDefault()' >
                  <!--
                    暂时屏蔽跳转大图功能
                    @showBigMap="showBigMap"
                  -->
                  
                  <tmPer :color="item.color" :fontColor="item.fontcolor" :item="item.devDetail" :key="index" :position="item.position" @goTo="goTo"
                      :read-only="!editPosition"
                      :size="12" :tmData="tmData" ref="tm-part" v-for="(item, index) in tmData">
                    {{item.text}}
                  </tmPer>

                  

                  <!-- 原点设置列表数据不能编辑, 但原点设置可以编辑 -->
                  <tm :color="item.color" :fontColor="item.fontcolor" :item="item.devDetail" :key="item.ccsDevId" :position="item.position" @goTo="goTo"
                      :read-only="true"
                      :size="12" :tmData="ccsWarehouseImagePointRelationDTOListData" ref="tm-point" v-for="(item, index) in ccsWarehouseImagePointRelationDTOListData">
                    {{item.text}}
                  </tm>

                  <tmconfig 
                    ref="tm-point-config"
                    :isDrag="isPointConfig"
                    :currentGraph="currentGraph"
                    @setPointConfig="setPointConfig"
                  >
                    <i class="el-icon-location" style="font-size:28px; color:red; font-weight:bold;"></i>
                  </tmconfig>

                  <img :src="imgUrl" @mousemove="() => null" style="user-select:none; pointer-events:none; z-index:-1;" :style="{ width : imgWidth + 'px', height : imgHeight + 'px' }" />

                </div>
              </div>

                <!--  静态详情展示图-->
                    <static-details
                        v-if="drawer"
                        @slider-change="sliderChange"
                        :element="currentClickElement"
                        :refreshEcharts="refreshEcharts"
                        @close-drawer="handleCloseDrawer"
                        @date-picker-range-change="datePickerRangeChange"
                    ></static-details>

            </div>



          </div>
        <!-- 
          之前标签
          </el-scrollbar> 
        -->
        </div>
      </div>
    </div>
    <page-right :css="{'width':'900px','padding':0}" :show="showIndex !== -1" @right-close="resetRightBox">
      <form-part :form-item="currentGraph" :index="showIndex" @refresh="refresh" v-show="showIndex === 1"></form-part>
        <edit-form-part :form-item="currentGraph" :index="showIndex" @refresh="refresh" v-show="showIndex === 3" ref="editForm"/>
      <right-part :form-item="currentGraph" :index="showIndex" v-show="showIndex === 2"/>
    </page-right>
    <!-- <el-dialog :fullscreen="true" :title="currentGraph.backgroundName" :visible.sync="isShowBigMap"
               custom-class="custom-dialog-dev"
               width="100%">
      <div :style="svgFrameStyle" style="position: relative">
            <tm :color="item.color" :iconScale="1.2" :item="item.devDetail" :key="index" :position="item.position"
            :read-only="true" :size="12" :tmData="tmData" ref="tm-big-part" v-for="(item, index) in tmData">
          {{item.text}}
        </tm>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
    import {warehouseDevImage} from '@/resources';
    import Tm from '@/components/common/tmPx';
    import tmPer from '@/components/common/tm';
    import tmconfig from '@/components/common/tmPointConfig';
    import Bg from '@/assets/img/empty-type.png';
    import Bg1 from '@/assets/img/empty.png';
    import TimeMixins from '@/mixins/timeMixin';
    import FormPart from './form/add-form';
    import editFormPart from './form/update-form';
    import RightPart from './rights/index';
    import Vue from "vue";
    import staticDetails from './static-details';

    import VueDraggableResizable from 'vue-draggable-resizable';

    export default {
        components: {Tm, tmPer, FormPart, RightPart,editFormPart,staticDetails, VueDraggableResizable, tmconfig},
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
                isShowBigMap: false,
                startDate: '',
                endDate: '',
                drawer: false,
                refreshEcharts: '',
                currentClickElement:{},

                isActived : false, // 是否激活 iframe
                playObj : {}, // 视频播放 列表数据

                idVal : '', // 场景 id 
                step : 1000, // 间隔
                timer : null, // 定时器引用
                positionTimer : null,
                positionTimerStep : 1000,

                flashIcon : false,

                imgWidth : 0,
                imgHeight : 0,
                ccsWarehouseImagePointRelationDTOList : [], // 定位数据列表
                isPointConfig : false, // 是否原点设置
                pointConfigObj : {}, // 原点配置对象

                currentObj : {}, // 初始化当前分布图列表对象

                

                // count : 0
            };
        },
        computed: {
            bodyHeight: function () {
                return parseInt(this.$store.state.bodyHeight, 10) - 20;
            },
            ccsWarehouseImagePointRelationDTOListData() {
              let width = this.imgWidth;
              let height = this.imgHeight;

                
              if( this.$refs.svgPart ){
                this.ccsWarehouseImagePointRelationDTOList.filter(f => !f.positionX || !f.positionY).map((m, index) => {
                    // console.error( 88, f, this.currentGraph ) ;
                    m.initPositionX = this.currentGraph.pointX ; 
                    m.initPositionY = this.currentGraph.pointY;
                    // 之前逻辑以图片宽高比进行定位 
                    // m.initPositionX = width  / 2 ; 
                    // m.initPositionY = height / 2; 

                    m.isNotAlloat = true;

                });
                  
                return this.ccsWarehouseImagePointRelationDTOList.map((m) => {
                    if (m.warnFlag) {
                      this.isAlarm = true;
                    } 

                    let obj = {
                      color: this.getColorPx(m),
                        fontcolor:m.indoorPositionSceneDTO.fontColor,
                        position: {
                            // 原点坐标设置 x 轴： ( 实际坐标 + 偏移量 ) * 坐标缩放比例
                            // 原点坐标设置 y 轴： ( 实际坐标 - 偏移量 ) * 坐标缩放比例 [ 注意: 这里的 y 轴向上为正方向, 往下为负方向 ]
                            x: m.isNotAlloat ? m.initPositionX : ( m.positionX + this.currentGraph.pointX ) * this.currentGraph.indoorPositionSceneDTO.pointRatio,
                            y: m.isNotAlloat ? m.initPositionY : ( m.positionY - this.currentGraph.pointY ) * this.currentGraph.indoorPositionSceneDTO.pointRatio
                            // x: m.isNotAlloat ? m.initPositionX : (m.positionX * this.scaling),
                            // y: m.isNotAlloat ? m.initPositionY : (m.positionY * this.scaling)
                        },
                        text: `${ m.pointName}(室内定位)`,
                        devDetail: m
                    } ;
                    if( m.pointName === this.currentClickElement.scenesElementName ){ 
                     this.currentClickElement = {
                        scenesElementName:m.pointName,
                        scenesElementId:m.pointId,
                        devCode:m.devCode,
                        devlist:[m],
                        itemValue : m
                      }
                    }
                    return obj;
                }) || [];
              }
            },
            tmData() {
              let height = this.currentHeight ? this.currentHeight : (this.bodyHeight);
              let width = this.currentWidth ? this.currentWidth : 866;


              // 70 为绘制一个 svg 的宽度
              let perW = ( 70 / width ) * 100 ; // 这里算出一个 svg 占容器的百分比
              let perH = ( 20 / height ) * 100 ;
              let yN = 0 ;
              let xN = 0 ;

                this.tempList.filter(f => !f.positionX || !f.positionY).map((m, index) => {
                    m.initPositionX = ( xN * perW ) % 100 ; // 对 x 轴求模, 保证不会超过 100
                    m.initPositionY = ( yN * perH ) ;

                    if( ( m.initPositionX + perW ) > ( 100 - perW ) ){ // x 轴坐标和一个 svg 窗口的占比 大于100 减去一个窗口的占比
                      xN = 0 ;
                      yN++ ; // 递增 y 轴坐标
                    } else {
                      xN++ ;
                    }
                    m.isNotAlloat = true;

                    /*
                      yxh 之前逻辑
                      m.initPositionX = (index - Math.floor(index / 16) * 16 + 1) * 50;
                      m.initPositionY = (Math.floor(index / 16) + 1) * 25;
                      m.isNotAlloat = true;
                    */
                });
                
                return this.tempList.map((m) => {
                    if (m.warnFlag) {
                      this.isAlarm = true;
                    } 

                    let obj = {
                      color: this.getColor(m),
                        fontcolor:m.fontColor,
                        position: {
                            // yxh 去除缩放比例设置
                            x: m.isNotAlloat ? m.initPositionX : m.positionX,
                            y: m.isNotAlloat ? m.initPositionY : m.positionY
                            // x: m.isNotAlloat ? m.initPositionX : (m.positionX * this.scaling),
                            // y: m.isNotAlloat ? m.initPositionY : (m.positionY * this.scaling)
                        },
                        text: m.devType === 4 ? 
                              m.humidity + '%' : 
                              +m.isVideo === 1 ? // 如果是视频类型
                              m.pointName :
                              m.temperature + '℃',
                        devDetail: m
                    } ;
                    // 这里的绝对坐标转变为相对百分比坐标, 用于大图展示
                    // obj.position.x = (obj.position.x / width) * 100
                    // obj.position.y = (obj.position.y / height) * 100
                    return obj;
                }) || [];
            },
            imgUrl() {
                // let height = this.currentHeight ? this.currentHeight + 'px' : (this.bodyHeight) + 'px';
                // let width = this.currentWidth ? this.currentWidth + 'px' : '866px';
                // console.error( this.currentGraph ) ;

                return `${this.currentGraph.backgroundUrl}`;
            },

            svgFrameStyle() {
                // let height = this.currentHeight ? this.currentHeight + 'px' : (this.bodyHeight) + 'px';
                // let width = this.currentWidth ? this.currentWidth + 'px' : '866px';

                
                return {
                    // height,
                    // width,
                    backgroundImage: `url(${this.currentGraph.backgroundUrl})`,

                    // 之前逻辑
                    //backgroundImage: `url(${Vue.prototype.$http.defaults.baseURL+ '/open-api/file/download?imageId=' + this.currentGraph.imageId})`,
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
            },
            isPlay(){
                return this.tempList.some( v => this.getColor(v) === '#f00' ) ;
            }
        },
        watch: {
            isShowBigMap(val) {
                if (val) return;
                this.currentHeight = 0;
                this.currentWidth = 0;
                this.setScaling();
                this.tempList = [];
            },

            idVal( n, o ){
              let staticVideo = JSON.parse( localStorage.getItem( 'staticVideo' ) ) || {} ;
              this.playObj = staticVideo[ n ] || {}  ;

            },
        },
        mounted() {
            this.clearAllTimes();
            this.queryGraphList();
            this.switchAlarm();
            this.alarmAudio();
            this.setTimes(setTimeout(this.loopQueryDevs, 10000));
            this.reqPositionById() ;
            let id = this.$route.params.id;
            if (id === ':id') this.$router.push(this.$route.path.replace(':', ''));

            // 如果 id 存在
            if( id ){ // 如果 id 存在, 取缓存视频
              this.idVal = id ;
              this.playObj = this.getPlayObj( JSON.parse( localStorage.getItem( 'staticVideo' ) ) || {} ) ;

              this.setStepVideoInfo() ;

            }

        },
        beforeDestroy(){
          // 清除定时器
          if( this.positionTimer ){ clearTimeout( this.positionTimer ) ; this.positionTimer = null ; }
        },
        methods: {
            getPlayObj( obj ){
              return obj[ this.idVal ] || {}  ;
            },
            setStepVideoInfo(){

              let staticVideo = JSON.parse( localStorage.getItem( 'staticVideo' ) ) || {} ;
              this.playObj = staticVideo[ this.idVal ] || {}  ;

              if( this.timer ){ clearTimeout( this.timer ); this.timer = null ; }
              this.timer = setTimeout( this.setStepVideoInfo, this.step ) ;
            },
            resize(x, y, width, height, v){
              v.width = width;
              v.height = height;
              v.x = x;
              v.y = y;

              let statcVideo = JSON.parse( localStorage.getItem( 'staticVideo' ) ) || {} ;
              if( statcVideo[ this.idVal ] && statcVideo[ this.idVal ][ v.ccsDevId ]){
                statcVideo[ this.idVal ][ v.ccsDevId ].width = v.width;
                statcVideo[ this.idVal ][ v.ccsDevId ].height = v.height;
                statcVideo[ this.idVal ][ v.ccsDevId ].x = v.x;
                statcVideo[ this.idVal ][ v.ccsDevId ].y = v.y;

                localStorage.setItem( 'staticVideo', JSON.stringify( statcVideo ) ) ;
              }
            },
            drag(x, y, v) {
              v.x = x ;  
              v.y = y ; 

              let statcVideo = JSON.parse( localStorage.getItem( 'staticVideo' ) ) || {} ;
              if( statcVideo[ this.idVal ] && statcVideo[ this.idVal ][ v.ccsDevId ]){
                statcVideo[ this.idVal ][ v.ccsDevId ].x = v.x; 
                statcVideo[ this.idVal ][ v.ccsDevId ].y = v.y; 

                localStorage.setItem( 'staticVideo', JSON.stringify( statcVideo ) ) ;
              }
            },
            onActivated(){
              this.isActived = true ;
            },
            onDeactivated(){
              this.isActived = false ;
            },
            onResizstop(){
              this.isActived = false ;
            },
            closeAlertFn( ccsDevId ){
              let obj = { ...this.playObj } ;
              delete obj[ ccsDevId ] ;
              // delete obj[ pointId ] ;
              this.playObj = obj ; 

              let statcVideo = JSON.parse( localStorage.getItem( 'staticVideo' ) ) || {} ;
              if( statcVideo[ this.idVal ] ){
                statcVideo[ this.idVal ] = this.playObj ;

                localStorage.setItem( 'staticVideo', JSON.stringify( statcVideo ) ) ;
              }

            },

            unitRight() {
                this.showIndex = 2;
            },
            getColor(m) {
              if (m.monitorStatus !== '1') return '#26d6dd'; // 低温
                if (!m.warnFlag) return '#0f0'; // 正常
                if (m.warnTypes && m.warnTypes.includes(4)) return '#666'; // 离线
                
                return '#f00'; // 超温

                /*
                // 之前逻辑
                // if (m.monitorStatus !== '1') return '#666'; // 离线
                // if (!m.warnFlag) return '#0f0'; // 正常
                // if (m.warnTypes && m.warnTypes.includes(4)) return '#26d6dd'; // 底温
                // return '#f00'; // 高温
                */
            },
            getColorPx(m) {
                return m.warnFlag ? '#666' : '#0f0';
            },
            setScaling() {
                // 之前逻辑
                // let url = Vue.prototype.$http.defaults.baseURL+ '/open-api/file/download?imageId=' + this.currentGraph.imageId;
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
                    this.scaling = l;
                    this.currentHeight = image.height * l; // 原来值

                    // yxh 新添加
                    // this.currentWidth = this.$refs.svgPart.offsetWidth ;
                    // this.currentHeight = this.$refs.svgPart.offsetHeight;

                    // console.error( this.currentWidth,this.$refs.svgPart.offsetHeight, 88 ) ;
                    // 设置完缩放值后，在查询
                    this.queryDevs();
                    
                    if( this.currentGraph.indoorPositionSceneDTO ){ // 如果有配置对象定位属性
                      this.imgWidth = image.width * +this.currentGraph.indoorPositionSceneDTO.backgroundRatio ; 
                      this.imgHeight = image.height * +this.currentGraph.indoorPositionSceneDTO.backgroundRatio ; 
                    } else {  // 针对新增的时候没有 indoorPositionSceneDTO 属性参数时默认显示宽高比
                      this.imgWidth = image.width;
                      this.imgHeight = image.height;
                    }

                };
            },
            setBigScaling(width, height) {
                // 之前逻辑
                // let url = Vue.prototype.$http.defaults.baseURL+ '/open-api/file/download?imageId=' + this.currentGraph.imageId;
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

                    // 设置完缩放值后，在查询
                    // this.queryDevs();
                    this.queryDevs( true );
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

                // 之前逻辑
                // if (isAlarm) {
                if ( this.isPlay ) { 
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
                this.$refs.editForm.reset()
            },
            addGraph() {
                this.showIndex = 1;
            },
            updateGraph(item) {
                this.showIndex = 3;
                this.currentGraph = item;
                
            },
            showWarehouseDetail(item) {
                this.idVal = item.backgroundId ; //更新 idVal

                let staticVideo = JSON.parse(localStorage.getItem( 'staticVideo' )) || {} ;

                if( staticVideo ){
                  if( !staticVideo[ this.idVal ] ){ // 如果没有
                    staticVideo[ this.idVal ] = {} ; // 新添加
                    localStorage.setItem( 'staticVideo', JSON.stringify( staticVideo ) )
                  }
                }

                if( item.indoorPositionSceneDTO ){
                  this.positionTimerStep = 1000 * +item.indoorPositionSceneDTO.refreshInterval ;
                  this.flashIcon = +item.indoorPositionSceneDTO.flashIcon ? true : false ;
                }

                this.currentObj = { ...item } ; // 用于恢复原点设置的分布图列表对象
                this.currentGraph = {...item} ;

                // 获取原点设置信息
                this.pointConfigObj = {
                  x : item.pointX,
                  y : item.pointY
                } ;
                // console.error( 77, item ) ;

                this.activeId = item.backgroundId;
                this.tempList = [];
                this.isAlarm = false;
                this.drawer=false;
                this.setScaling();

                // 之前逻辑 this.$router.push(`/monitoring/distribution/${item.backgroundId ? item.backgroundId : 'id'}`);
                this.$router.push(`/monitoring/distributionsetorigin/${item.backgroundId ? item.backgroundId : 'id'}`);
            },
            pointConfigFn(){
              this.isPointConfig = true ;

              // 在原点编辑状态, 暂时屏蔽更新数据
              if( this.positionTimer ){ clearTimeout( this.positionTimer ) ; this.positionTimer = null ; }
            },
            savePointConfigFn(){
              this.isPointConfig = false ;
              this.reqPositionById() ; // 恢复定位接口逻辑

              warehouseDevImage.saveConfigPoint({ 
                imageId : this.activeId,
                positionX : this.pointConfigObj.x,
                positionY : this.pointConfigObj.y,
              }).then(res => {
                let { code, msg } = res ;

                if( +code === 200 ){
                  // this.currentGraph.pointX = this.pointConfigObj.x ;
                  // this.currentGraph.pointY = this.pointConfigObj.y ;

                  this.$set( this.currentGraph, 'pointX', this.pointConfigObj.x ) ;
                  this.$set( this.currentGraph, 'pointY', this.pointConfigObj.y ) ;

                  this.currentObj = this.currentGraph ; // 赋值当前对象待下次更新数据
                }

                this.$message({
                  type: +code === 200 ? 'success' : 'warning',
                  message: msg
                });

                // this.graphList.forEach( v => {
                //   if( v.backgroundId === this.currentGraph.backgroundId ){
                //     this.showWarehouseDetail( v ) ;
                //   }
                // } ) ;

              });

              // this.$refs['tm-point-config'] && this.$refs['tm-point-config'].resetInfo() ;
              // this.onSubmit(dataArr);
            },
            cancelPointConfigFn(){
              this.isPointConfig = false ;
              this.reqPositionById() ; // 恢复定位接口逻辑

              // 重置分布图列表对象, 以恢复原点设置坐标
              this.currentGraph = { ...this.currentObj } ; 


              // this.$refs['tm-point-config'] && this.$refs['tm-point-config'].resetInfo() ;
            },
            showBigMap() { // 显示大图
                this.tempList = [];
                let width = document.body.clientWidth;
                let height = document.body.clientHeight - 44;
                this.setBigScaling(width, height);
                setTimeout(() => {
                    this.editPosition = false;
                    // this.isShowBigMap = true;

                });



                let routeData = this.$router.resolve({
                    path: `/monitoring/distribution/staticSetOriginFullScreen/${this.currentGraph.backgroundId ? this.currentGraph.backgroundId : 'id'}`,
                    query : {
                      // svgFrameStyle : JSON.stringify(this.svgFrameStyle), // 之前逻辑
                      // currentGraph : JSON.stringify(this.currentGraph), // 之前逻辑
                      // tmData : JSON.stringify(this.tmData), // 之前逻辑
                      background : this.svgFrameStyle.backgroundImage,
                      imgUrl : this.imgUrl,
                      imgWidth : this.imgWidth,
                      imgHeight : this.imgHeight,
                      positionTimerStep : this.positionTimerStep,
                      flashIcon : this.flashIcon,
                      activeId : this.activeId,
                      pointRatio : this.currentGraph.indoorPositionSceneDTO.pointRatio,
                      pointX : this.currentGraph.pointX, 
                      pointY : this.currentGraph.pointY
                    }
                });
                window.open(routeData.href, '_blank') ;


                // this.$router.push(`/monitoring/distribution/fullScreen/${this.currentGraph.backgroundId ? this.currentGraph.backgroundId : 'id'}`);
            },
            refresh() {
                this.queryGraphList();
                this.resetRightBox();
            },
            queryGraphList: function () {
                this.loadingDataWare = true;

                warehouseDevImage.query({ 
                  sceneType : 2  // 1 : 静态场景     2 : 室内定位场景
                }).then(res => {
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
            positionByIdFn(){
                if (!this.activeId) return;
                // this.tempList = [];
                warehouseDevImage.positionById(this.activeId).then(res => {
                  let { data } = res ;

                  // data.ccsWarehouseImagePointRelationDTOList.forEach( v => {
                  //   v.positionX = null ;
                  //   v.positionX = null ;
                  // } ) ;

                  this.ccsWarehouseImagePointRelationDTOList = data.ccsWarehouseImagePointRelationDTOList ;
                  // this.tempList = [ ...this.tempList, ...data.ccsWarehouseImagePointRelationDTOList ]
                 

                  //   // yxh 之前取的 ccsWarehouseImageDevRelationDTOList 字段信息
                    // let list = res.data.ccsWarehouseImageDevRelationDTOList;

                    
                  //   let list = res.data.ccsWarehouseImagePointRelationDTOList;  // 现在取 ccsWarehouseImagePointRelationDTOList 字段信息
                  //   // if (list.length && list[0].backgroundId !== this.activeId) return; 
                  //   // console.error( this.$refs.svgPart.offsetWidth, this.currentWidth, 77 ) ; 
                  //   this.currentWidth = this.$refs.svgPart.offsetWidth ; 
                  //   this.currentHeight = this.$refs.svgPart.offsetHeight ; 

                  //   this.tempList = [ ...this.tempList, ...list ]; 
                  //   if( this.$refs.alarmMusic ){
                  //       this.isPlay ? this.$refs.alarmMusic.play() : this.$refs.alarmMusic.pause();
                  //   }
                    /**/
                    
                    // debugger
                      // if( this.count % 2 === 0 ){
                      //   list.forEach( v => {
                      //     v.warnFlag = false ;
                      //   } ) ;
                      // } else {
                      //     list.forEach( v => {
                      //     v.warnFlag = true ;
                      //   } ) ;
                      // }
                    
                    
                    
                    // this.count ++ ;

                   

                    /*
                      // 暂时屏蔽掉大图跳转逻辑
                      if( isStaticFullScreen ){

                          let routeData = this.$router.resolve({
                              path: `/monitoring/distribution/staticFullScreen/${this.currentGraph.backgroundId ? this.currentGraph.backgroundId : 'id'}`,
                              query : {
                                // svgFrameStyle : JSON.stringify(this.svgFrameStyle), // 之前逻辑
                                // currentGraph : JSON.stringify(this.currentGraph), // 之前逻辑
                                // tmData : JSON.stringify(this.tmData), // 之前逻辑
                                background : this.svgFrameStyle.backgroundImage,
                                activeId : this.activeId
                              }
                          });
                          window.open(routeData.href, '_blank') ;

                      }
                    */
                });
            },

            queryDevs: function ( isStaticFullScreen ) {
                if (!this.activeId) return;
                // this.tempList = [];
                warehouseDevImage.get(this.activeId).then(res => {

                    // yxh 之前取的 ccsWarehouseImageDevRelationDTOList 字段信息
                    // let list = res.data.ccsWarehouseImageDevRelationDTOList;

                    let list = res.data.ccsWarehouseImagePointRelationDTOList;  // 现在取 ccsWarehouseImagePointRelationDTOList 字段信息
                    if (list.length && list[0].backgroundId !== this.activeId) return;
                    // console.error( this.$refs.svgPart.offsetWidth, this.currentWidth, 77 ) ;
                    this.currentWidth = this.$refs.svgPart.offsetWidth ;
                    this.currentHeight = this.$refs.svgPart.offsetHeight ;
                    
                    // debugger
                      // if( this.count % 2 === 0 ){
                      //   list.forEach( v => {
                      //     v.warnFlag = false ;
                      //   } ) ;
                      // } else {
                      //     list.forEach( v => {
                      //     v.warnFlag = true ;
                      //   } ) ;
                      // }
                    
                    this.tempList = list; 
                    
                    // this.count ++ ;

                    if( this.$refs.alarmMusic ){
                        this.isPlay ? this.$refs.alarmMusic.play() : this.$refs.alarmMusic.pause();
                    }

                    /*
                      // 暂时屏蔽掉大图跳转逻辑
                      if( isStaticFullScreen ){

                          let routeData = this.$router.resolve({
                              path: `/monitoring/distribution/staticFullScreen/${this.currentGraph.backgroundId ? this.currentGraph.backgroundId : 'id'}`,
                              query : {
                                // svgFrameStyle : JSON.stringify(this.svgFrameStyle), // 之前逻辑
                                // currentGraph : JSON.stringify(this.currentGraph), // 之前逻辑
                                // tmData : JSON.stringify(this.tmData), // 之前逻辑
                                background : this.svgFrameStyle.backgroundImage,
                                activeId : this.activeId
                              }
                          });
                          window.open(routeData.href, '_blank') ;

                      }
                    */
                });
            },
            loopQueryDevs() {
                this.queryDevs();
                this.setTimes(setTimeout(this.loopQueryDevs, 10000));
            },
            reqPositionById() {
                this.positionByIdFn();
                if( this.positionTimer ){ clearTimeout( this.positionTimer ) ; this.positionTimer = null ; }
                this.positionTimer = setTimeout( () => {
                  this.reqPositionById() ;
                }, this.positionTimerStep);
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
                const form = dataArr.map(m => {
                  return {
                      id: m.id,
                      isVideo : m.isVideo,
                      positionX: m.x,
                      positionY: m.y,
                      // positionX: m.x / this.scaling,
                      // positionY: m.y / this.scaling,
                  } ;
                });



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
            },
            goTo(value){

                // 重置
                value.x = value.x || 0 ;
                value.y = value.y || 0 ;
                value.width = value.width || 400 ;
                value.height = value.height || 228 ;

                if( +value.isVideo === 1 ){ // 如果是视频类型 
                  this.drawer = false ;

                  if( Object.keys( this.playObj ).length >= 2 ){
                      this.$message({
                        type: 'warning',
                        message: '打开超过限制'
                      });
                      return ;
                  } 

                  value.src= value.videoUrl;                
                  this.$set( this.playObj, value.ccsDevId, value ) ;

                  let staticVideo = JSON.parse( localStorage.getItem( 'staticVideo' ) ) || {} ;

                  if( staticVideo ){
                    staticVideo[ this.idVal ] = this.playObj ;
                    localStorage.setItem( 'staticVideo', JSON.stringify( staticVideo ) ) ;
                  }

                  // localStorage.setItem( 'staticVideo', JSON.stringify( { [ this.idVal ] : this.playObj } ) ) ;

                } else {
                  this.currentClickElement= {
                    scenesElementName:value.pointName,
                    scenesElementId:value.pointId,
                    devCode:value.devCode,
                    devlist:[value],
                    itemValue : value
                  };
                  
                  if(this.drawer){
                    this.refreshEcharts=this.currentClickElement.scenesElementId;
                    if( +value.isVideo ){  // 如果是视频类型则不查看 echarts 图数据
                      this.drawer=false; 
                    }
                  } else {
                    if( +value.isVideo ){  // 如果是视频类型则不查看 echarts 图数据
                      this.drawer=false; 
                    } else {
                      this.drawer=true;
                    }
                  }
                }
            },
            datePickerRangeChange(startDate, endDate) {
                this.startDate = startDate
                this.endDate = endDate
            },
            //子组件slider组件input事件
            sliderChange(val) {
              
            },
            //关闭弹窗
            handleCloseDrawer(e) {
                this.startDate = ''
                this.endDate = ''
                this.drawer = false;
            },

            setPointConfig( obj ){
              this.pointConfigObj = obj ;
            }

        }
    };
</script>
