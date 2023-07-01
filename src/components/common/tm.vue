<template>
    <!-- <svg :style="`left:${currentPos.x}px;top:${currentPos.y}px;height: ${iconScale !== 1 ? '30px' : '20px'}`" -->
    <!-- <svg  :style="`left:${currentPos.x}px;top:${currentPos.y}px;height: ${iconScale !== 1 ? '30px' : '20px'}`" -->
    <!-- :style="`left:${currentPos.x}%;top:${currentPos.y}%;height: ${iconScale !== 1 ? '55px' : '55px'};`"  大图小图显示同样的数据-->   
    <svg :style="
        `left:${currentPos.x}%;top:${currentPos.y}%;height: ${iconScale !== 1 ? '30px' : '20px'};`  
    "    style="overflow: visible"
         @click="goTo"
         @mousedown="dragPosition"
         @mouseenter="showDetail" @mouseleave="hideDetail" @mouseup="isDraging = false" class="tm-container" :class="{ ani : item.indoorPositionSceneDTO && +item.indoorPositionSceneDTO.flashIcon  }">
        <circle :cx="r" :cy="r" :fill="color"
                :r="r"
                :stroke="color"
                stroke-linecap="round"
                stroke-width="0" v-show="item.devType === '3'"></circle>
        
        <!--
            // 之前字段
             v-if="item.imageId" 
        -->
        <image
            x="0"
            y="0"
            class="image"
            :xlink:href="getImageURL(item)"
            v-if="item.imageUrl"
        ></image>

        <image
            x="0"
            y="0"
            class="image"
            xlink:href="@/assets/img/video_icon.gif"
            v-else-if="+item.isVideo"
        ></image>
        <use :height="getDevIconWH(item, 3)" :style="'fill:'+ color" :width="getDevIconWH(item, 2)"
             :xlink:href="getDevIcon(item)" v-show="item.devType !== '3'" v-else></use>
        <!-- <text :font-size="12" :x="getDevIconOffset(item).x" :y="getDevIconOffset(item).y"
              :fill="fontColor" text-anchor="start" class="text">
            <slot></slot>
        </text> -->
        <text v-for="(item1,index) in standby" :font-size="12" :key="index" :fill="fontColor" :x="getDevIconOffset(item).x+5" :y="getDevIconOffset(item).y+(index*12)-2">
            {{item1.key == 'temperature'?item1.value+'℃':item1.value}}</text>
        <!-- <text :x="getDevIconOffset(item).x" :y="getDevIconOffset(item).y">111111</text>
        <text :x="getDevIconOffset(item).x" :y="getDevIconOffset(item).y+10">111111</text>
        <text :x="getDevIconOffset(item).x" :y="getDevIconOffset(item).y+22">111111</text>
        <text :x="getDevIconOffset(item).x" :y="getDevIconOffset(item).y+34">111111</text> -->
    </svg>
</template>

<script>
import iconfont from '../../assets/fonts/iconfont';
import Utils from '@/tools/utils';
import Vue from 'vue';

const {DevIcon} = Utils;
export default {
    name: 'tm',
    data() {
        return {
            currentPos: {x: '', y: ''},
            currentScale: 1,
            isDraging: false,
            iconfont,
            parentNodeWidth : 0,
            parentNodeHeight : 0
        };
    },
    computed: {
        r() { // 半径
            return this.size / 2;
        },
        labelId() {
            return this.item.ccsWarehouseImagePointRelationId + this.iconScale + '';
        },
    },
    props: {
        size: {
            type: Number,
            default: 12
        },
        width : {
            type : Number,
            default : 0
        },
        height : {
            type : Number,
            default : 0
        },
        position: {
            type: Object,
            default: {x: 0, y: 0}
        },
        color: {
            type: String,
            default: '#333'
        },
        fontColor: {
            type: String,
            default: '#000000'
        },
        readOnly: {
            type: Boolean,
            default: true
        },
        scale: {
            type: Number,
            default: 1
        },
        item: Object,
        iconScale: {
            type: Number,
            default: 1
        },
        tmData: Array,
        standby: Array,

    },
    watch : {
        position( v ){
            this.currentPos = v ;
        },
        // tmData:{
        //     handler(){
        //         // 备用一个数组，为了展示svg返回过来的显示信息
        //         this.tmData.forEach(item=>{
        //             let standby = []
        //             debugger
        //             if(item.devDetail.devPointName){   //设备名称
        //                 standby.push({devType:item.devDetail.devType,x:item.position.x,y:item.position.y,value:item.devDetail.devPointName})
        //             }
        //             if(item.devDetail.voltage){ // 电量  
        //                 standby.push({devType:item.devDetail.devType,x:item.position.x,y:item.position.y,value:item.devDetail.voltage})
        //             }
        //             if(item.devDetail.temperature){ // 温度  
        //                 standby.push({devType:item.devDetail.devType,x:item.position.x,y:item.position.y,value:item.devDetail.temperature})
        //             }
        //             if(item.devDetail.humidity){ // 湿度  
        //                 standby.push({devType:item.devDetail.devType,x:item.position.x,y:item.position.y,value:item.devDetail.humidity})
        //             }
        //             item.standby = standby
        //         })
        //     },
        //     deep:true,
        //     immediate:true
        // },
    },
    methods: {
        getVideoImageURL(item){
            return `@/assets/img/3-1.png`
        },
        getImageURL(item){
            return `${item.imageUrl}`
            // 之前逻辑
            // return `${Vue.prototype.$http.defaults.baseURL}/open-api/file/download?imageId=${item.imageId}`
        },
        getDevIcon(item) {
            // yxh 之前逻辑 DevIcon[item.devType] 可能为 undefined
            // return '#el-icon-t-' + DevIcon[item.devType][item.warnFlag ? 1 : 0];
            return '#el-icon-t-' + ( DevIcon[item.devType] ? DevIcon[item.devType][item.warnFlag ? 1 : 0] : '' );
        },
        getDevIconWH(item, index) {
            // yxh 之前逻辑 DevIcon[item.devType] 可能为 undefined
            // return DevIcon[item.devType][index] * this.iconScale;

            return DevIcon[item.devType] ? DevIcon[item.devType][index] * this.iconScale : this.iconScale ;
        },
        getDevIconOffset(item) {
            if (item.devType === '3') return {x: 2 * this.r + 20, y: this.r + 5};
            // if (item.devType === '1') return {x: DevIcon[item.devType][2] * this.iconScale + 18, y: this.r + 8};
            return {x: 18, y: this.r + 8};
        },
        showDetail(e) {
            let event = event ? event : window.event;
            let target = e.target || event.srcElement;
            // let el = document.getElementById(this.labelId);
            let x = target.getBoundingClientRect().x;
            let y = target.getBoundingClientRect().y;
            if (!this.item._title) {
                let el = document.createElement('div');
                this.item._title = el;
                el.id = this.labelId;
                el.classList.add('temp-title');
                el.style.zIndex = 2004;
                if (this.iconScale === 1.2) {
                    let parent = this.$parent.$el;
                    el.style.zIndex = parent && parent.style.zIndex || 3000;
                }
                el.style.display = 'none';
                document.body.appendChild(el);
                this.setTitle(el, this.item, x, y);
            } else if (this.item._title.style.display === 'none') {
                this.setTitle(this.item._title, this.item, x, y);
            }
        },
        setTitle(el, item, x, y) {
            if (this.isDraging) {
                el.style.display = 'none';
                return;
            }
            let time = item.recordDate ? this.$moment(item.recordDate).format('YYYY-MM-DD HH:mm:ss') : '';
            el.innerHTML = `<div>名称:${item.pointName}</div><div>编码:${item.devCode}</div><div>最新时间:${time}</div>`;
            el.style.display = 'block';
            let w = el.clientWidth;
            let cx = 0;
            let cy = 0;
            // if (x > 130) {
            //   cx = x - w - 5;
            //   cy = y - 6;
            // } else {
            //   cx = x - w / 2;
            //   cy = y - 42;
            // }
            cx = x - w - 5;
            cy = y - 6;

            let posRect = this.$el.getBoundingClientRect() ;

            if( cx < 0 ){
                cx = posRect.x + posRect.width ;
            }

            el.style.left = cx + 'px';
            el.style.top = cy + 'px';
        },
        hideDetail(e) {
            let event = e ? e : window.event;
            let target = event.target || event.srcElement;
            let el = this.item._title || document.getElementById(this.labelId);
            el && (el.style.display = 'none');
            this.hiddenAllTitle();
        },
        hiddenAllTitle() {
            let eles = document.querySelectorAll('.temp-title');
            [...eles].forEach(i => (i.style.display = 'none'));
        },
        goTo() {
            if (!this.readOnly) {
                return false;
            }
            let el = this.item._title || document.getElementById(this.labelId);
            el && (el.style.display = 'none');

            this.$emit("goTo", this.item);
            // this.$turnPointDevDate(this.item, this.devType === '4' ? '2' : '1');
            this.$emit( 'showBigMap', this.item ) ;

            /*
                this.item.devType 类型:
                0 : 有线温度计
                1 : 无线温度计
                2 : 冷柜温度计
                3 : 车载温度计
                4 : 湿度计
            */

            /*
                // yxh 之前逻辑
                // this.$turnPointDevDate(this.item, this.devType === '4' ? '2' : '1');
            */
        },
        getPos(e) {//这是一个 获取鼠标位置的函数
            let oEvent = e || event;
            return {
                x: oEvent.clientX + document.documentElement.scrollLeft || document.body.scrollLeft,
                y: oEvent.clientY + document.documentElement.scrollTop || document.body.scrollTop
            };
        },
        dragPosition(e) {
            if (this.readOnly) {
                return false;
            }
            let self = this;
            let oEvent = e || event;
            let rootNode = this.$el.parentNode;
            let oldPos = this.getPos(oEvent);
            // oldPos = {
            //     x: oldPos.x - this.currentPos.x,
            //     y: oldPos.y - this.currentPos.y
            // };
            let boundPos = rootNode.getBoundingClientRect() ;
            oldPos = {
                x: oEvent.clientX - boundPos.x,
                y: oEvent.clientY - boundPos.y,
                ex : oEvent.offsetX,
                ey : oEvent.offsetY
            };
            this.isDraging = true;

            rootNode.onmousemove = function (e) {
                let oEvent = e || event;
                // let dpos = self.getPos(oEvent);
                let dpos = {
                    x : oEvent.clientX,
                    y : oEvent.clientY
                };

                // 转百分比坐标
                self.currentPos.x = ( ( dpos.x - boundPos.x - oldPos.ex ) / self.parentNodeWidth * 100 ) ;
                self.currentPos.y = ((dpos.y - boundPos.y - oldPos.ey ) / self.parentNodeHeight * 100) ;

                // self.currentPos.x = dpos.x - oldPos.x;
                // self.currentPos.y = dpos.y - oldPos.y;
            };
            document.onmouseup = function (e) {
                rootNode.onmousemove = null;
                this.onmouseup = null;
            };
        },
        getTmInfo() {
            return {
                id: this.item.ccsWarehouseImagePointRelationId,
                isVideo : this.item.isVideo,
                x: this.currentPos.x / this.currentScale,
                y: this.currentPos.y / this.currentScale
            };
        }
    },
    mounted() {
        // 去除减的半径
        let x = this.position.x * this.scale;
        let y = this.position.y * this.scale;


        this.currentPos = {
            x,
            y
        };

        this.parentNodeWidth = this.$el.parentNode.offsetWidth ;
        this.parentNodeHeight = this.$el.parentNode.offsetHeight ;

    }
};
</script>
<style>
.tm-container {
    position: absolute;
    width: auto;
    height: 20px;
    cursor: pointer;
}

.temp-title {
    position: absolute;
    padding: 2px 5px;
    border-radius: 4px;
    background: #333;
    color: #fff;
    min-width: 100px;
}

.temp-title--block {
    display: block;
}

.temp-title--none {
    display: block;
}
.image {
    width: 100%;
    height: 100%;
    transform: scale(0.8) translateX(-28%);
}
.text {
    transform: translateX(5%);
}
@keyframes aniFade{
    0%, 100%{ opacity:0; }
    50%{ opacity:1; }
}

.ani{ animation:aniFade 200ms linear infinite; }
</style>
