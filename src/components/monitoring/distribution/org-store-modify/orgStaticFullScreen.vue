<template>
        <div :style="svgFrameStyle" class='boxContainerItem'>
            <VueDraggableResizable
                :x="v.x"
                :y="v.y"
                :w="v.width"
                :h="v.height"
                :min-width="106"
                :min-height="60"
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

            <audio hidden loop ref="alarmMusic" src="@/../static/audio/alarm.mp3"></audio>

            <!-- 添加 echarts 数据图表展示 -->
            <static-details
                v-if="drawer"
                :element="currentClickElement"
                :refreshEcharts="refreshEcharts"
                @close-drawer="handleCloseDrawer"
            ></static-details>
            

            <tm :color="item.color" :fontColor="item.fontcolor" :iconScale="1.2" :item="item.devDetail" :key="index" :position="item.position"
                @showBigMap="showBigMap"
                style="z-index:1;"
                :read-only="true" :size="12" :tmData="tmData" ref="tm-big-part" v-for="(item, index) in tmData">
            {{item.text}}
            </tm>
        </div>
</template>

<script>
import Tm from '@/components/common/tm';
import VueDraggableResizable from 'vue-draggable-resizable';

import {warehouseDevImage} from '@/resources';

import staticDetails from './warehouse/static-details';

export default {
    components: {Tm, VueDraggableResizable, staticDetails},
    data(){
        return {
            svgFrameStyle : {},
            currentGraph : {},
            width: 400,
            height: 228,
            top: 0,
            left: 0,
            isActived : false, // 是否激活 iframe
            playObj : {}, // 视频播放 列表数据
            id : '',
            tempList : [],
            activeId : '',
            timer : null,
            interval : 60000,
            drawer : false,
            refreshEcharts: '',
            currentClickElement:{},
        } ;
    },
    computed : {
        tmData() {
            let height = this.currentHeight ? this.currentHeight : (this.bodyHeight);
            let width = this.currentWidth ? this.currentWidth : 866;

            // 70 为绘制一个 svg 的宽度
            let perW = ( 70 / width ) * 100 ; // 这里算出一个 svg 占容器的百分比
            let perH = ( 20 / height ) * 100 ;
            let yN = 0 ;
            let xN = 0 ;

            this.tempList.filter(f => !f.positionX || !f.positionY).map((m, index) => {
                m.initPositionX = (xN * perW) % 100 ; // 对 x 轴求模, 保证不会超过 100
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
                if (m.warnFlag || ( m.warnTypes && m.warnTypes.includes( 4 ) ) ) { // 超温 和 离线
                    this.isAlarm = true;
                }

                if( +m.isVideo !== 1 ){ // 过滤掉视频类型

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
                    // console.error( obj.position, obj.text ) ;
                    return obj;
                }
            }) || [];
        },

        isPlay(){
            // return this.tempList.some( v => this.getColor(v) === '#f00' ) ;
            return this.tempList.some( v => ( this.getColor(v) === '#f00' ) || ( this.getColor(v) === '#666' ) ) ;
        }
    },
    mounted(){
        if( this.$route.query ){
            // this.svgFrameStyle = JSON.parse( this.$route.query.svgFrameStyle ) ; // 之前逻辑
            // this.currentGraph = JSON.parse( this.$route.query.currentGraph ) ; // 之前逻辑
            // this.tmData = JSON.parse( this.$route.query.tmData ) ; // 之前逻辑

            this.svgFrameStyle = { background : this.$route.query.background } ;
            this.activeId =  this.$route.query.activeId ;

        }

        if( this.$route.params ){
            if( this.$route.params.id ){
                this.id = this.$route.params.id ;
            }
        }

        this.initFn() ;

    },
    methods : {
        initFn(){
            this.queryDevs() ; // 默认初始化
            this.reqListFn() ; // 定时请求渲染数据
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
        reqListFn(){
            this.timer && clearTimeout( this.timer ), this.timer = null ;
            this.timer = setTimeout( () => {

                this.reqListFn() ; // 开启循环模式
                this.queryDevs() ; // 请求当前场景 数据

            }, this.interval ) ;
        },

        handleCloseDrawer(){
            this.drawer=false;
        },
        //子组件slider组件input事件
        sliderChange(val) {

        },
        datePickerRangeChange(startDate, endDate) {
            // this.startDate = startDate
            // this.endDate = endDate
        },
        showBigMap( item ){ 
            // 重置
            item.x = item.x || 0 ;
            item.y = item.y || 0 ;
            item.width = item.width || 400 ;
            item.height = item.height || 228 ;

            /*
                // 之前测试地址, 需要替换为接口数据地址
                // item.src= 'https://iot-nvr.tracentsure.com:10811/play.html?device=HANGTOU&channel=55&iframe=yes&stretch=yes';
                // this.$set( this.playObj, item.pointId, item ) ;
            */

            if( +item.isVideo === 1 ){ // 如果是视频类型 
                this.drawer = false ;
                item.src= item.videoUrl;                
                this.$set( this.playObj, item.ccsDevId, item ) ;
            } else {
                // 添加 echarts 图数据展示
                this.currentClickElement= {
                    scenesElementName:item.pointName,
                    scenesElementId:item.pointId,
                    devCode:item.devCode,
                    devlist:[item]
                };
                if(this.drawer){
                    this.refreshEcharts=this.currentClickElement.scenesElementId;
                }else{
                    this.drawer=true;
                }
            }
        },
        resize(x, y, width, height, v){
            v.width = width;
            v.height = height;
            v.x = x;
            v.y = y;
        },
        drag(x, y, v) {
            v.x = x ;
            v.y = y ;
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
        },

        queryDevs() {
            if (!this.activeId) return;
            // this.tempList = [];

            // 之前逻辑
            // warehouseDevImage.get(this.activeId).then(res => {
            this.$http.get(`/warehousePointImage/org/${this.activeId}`).then(res => {

                // yxh 之前取的 ccsWarehouseImageDevRelationDTOList 字段信息
                // let list = res.data.ccsWarehouseImageDevRelationDTOList;

                let list = res.data.ccsWarehouseImagePointRelationDTOList;  // 现在取 ccsWarehouseImagePointRelationDTOList 字段信息
                if (list.length && list[0].backgroundId !== this.activeId) return;
                // console.error( this.$refs.svgPart.offsetWidth, this.currentWidth, 77 ) ;
                this.currentWidth = this.$el.offsetWidth ;
                this.currentHeight = this.$el.offsetHeight ;

                this.tempList = list;

                // // 如果有告警产生, 则播放告警音, 否则不播放告警音 
                if( this.$refs.alarmMusic ){
                    this.isPlay ? this.$refs.alarmMusic.play() : this.$refs.alarmMusic.pause() ;   
                }

                // 默认如果是摄像头类型
                if( this.tmData && Array.isArray( this.tmData ) ){
                    this.tmData.forEach( v => {
                        if( v.devDetail && v.devDetail.backgroundId === this.id ){ // 如果设备 id 一样
                            // if( +v.devDetail.devType === 1 ){ // 这里摄像头设备类型未定义, 暂时写死为 3, 后期根据接口数据来定
                            //     this.showBigMap( v.devDetail ) ;
                            // }
                        }
                    } ) ;
                }

            });
        },

    }
} ;
</script>

<style scoped>
    .txtAlignC{ text-align:center; }

    .titleTxt{ display:flex; justify-content:space-between; padding:.1em .7em .3em; }
    .dragContainer{ width:400px; height:auto; z-index:2!important; position:absolute; color:white; }
    .dragContainer h3{  color:white; text-shadow:1px 1px 3px black; position:absolute; z-index:3; width:100%; padding:0 0 0 .8em; overflow:hidden; }
    .dragContainer h3:hover span{ right:0; }

    .containMark{ width:100%; height:100%; left:0; top:0; position:absolute; z-index:2; }
    .dragContainer h3 span{ text-align:center; transition:right 200ms ease; cursor:pointer; font-weight:normal; font-size:1.2em; width:20px; height:20px; overflow:hidden; position:absolute; right:-20px; top:0; background:rgba(0,0,0,.7); line-height:17px; padding:0; margin:0; }
    .dragContainer h3 span:hover{ background:rgba(245, 108, 108, 1); color:white; }
    .myiframe{ width:100%; height:100%; position:absolute; left:0; top:0; z-index:0; }
    .boxContainerItem{ width:100vw!important; height:100vh!important; background-size:100% 100%!important; background-repeat:no-repeat; position:absolute; z-index:10; margin:0;}
</style>
