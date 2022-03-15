<template>
    <div class="map-box" id="map-box">
<!--        require('../../../assets/img/scence_bg.png')-->
        <div class="divContainer" id="divContainer" :style="'background-image:url('+element.backgroundUrl+');'"
        >
            <div class="transparent-box" @click="clickElementMap"></div>
            <div class="point"
                 :style="'left:'+item.longitude+'px;top:'+item.latitude+'px;'+(editable?'cursor:move;':';')"
                 v-for="(item,index) in points"
                 :key="index"
                 @mousedown="mousedown"
                 :data-index="index"
                 :data-name="item.ccsPointName"
                 :data-id="item.ccsPointId"
            >
                <img :src="item.showImgSrc" class="icon" style="pointer-events:none;"/>
                <div class="text" style="pointer-events:none;">
                    <div v-html="item.label"
                         style="white-space:nowrap;text-shadow: 0px 0px 1px #000;line-height: 13px;"></div>
                </div>
            </div>
        </div>
        <div :style="'position: absolute;top: '+toolbarTop+'px;right: '+toolbarRight+'px;'" v-if="toolbar">
            <el-button
                @click="editable=true"
                v-if="!editable"
                plain=""
                size="mini"
                v-has="'ccs-edit-device-location'"
            >编辑设备位置
            </el-button>
            <el-button
                plain=""
                size="mini"
                v-if="editable"
                @click="save"
            >保存
            </el-button>
            <el-button
                plain=""
                size="mini"
                v-if="editable"
                @click="editable=false"
            >取消
            </el-button>
            <el-button v-has="'ccs-devdata-scan'" plain style="" size="mini" @click="fullScreen" v-if="fullbtn">全屏显示
            </el-button>
        </div>

        <scene-right-page
            v-has="'ccs-devdata-scan'"
            v-if="drawer"
            :element="element"
            :pointIndex="clickPointIndex"
        ></scene-right-page>
    </div>
</template>

<script>

import https from "../../../https";
import SceneRightPage from '../../monitoring/index/vehicle/scene-right-page'
import utils from '@/tools/utils';

export default {
    name: "element-map",
    props: {
        toolbar: {
            type: Boolean,
            default: false,//是否显示工具条，默认不显示
        },
        element: {
            type: Object,
            default: {},
        },
        toolbarTop: {
            type: Number,
            default: 0,
        },
        toolbarRight: {
            type: Number,
            default: 0,
        },
        fullbtn: {
            type: Boolean,
            default: true,
        },
        elementColumn: {
            type: Object,
            default: {}
        },
        showUnit: {
            type: Boolean,
            default: true,
        },
    },
    components: {SceneRightPage},
    watch: {
        element(newValue, oldValue) {
            if (oldValue && oldValue.scenesElementId !== newValue.scenesElementId) {
                this.drawer = false
            }
            this.resetPointPosition()
        },
        elementColumn: {
            handler: function (newValue) {
                this.resetPointPosition()
            },
            deep: true
        },
        showUnit:{
            handler: function (newValue) {
                this.resetPointPosition()
            },
            deep: true
        }
    },
    data() {
        return {
            points: [],
            drawer: false,
            editable: false,
            divWidth: 0,
            divHeight: 0,
            currentClickElement: {},
            clickPointIndex: '0',
        }
    },
    methods: {
        resetPointPosition() {
            let o = document.getElementById("divContainer");
            this.divWidth = o.clientWidth || o.offsetWidth;
            this.divHeight = o.clientHeight || o.offsetHeight;
            if (!this.element.points) {
                return
            }
            let statusMap = this.$store.state.statusMap
            this.points = this.element.points.map(item => {
                let tmp = JSON.parse(JSON.stringify(item))
                tmp = this.buildPointLabel(tmp)
                tmp.longitude = parseFloat(this.divWidth / 1000 * item.longitude)
                tmp.latitude = parseFloat(this.divHeight / 600 * item.latitude)
                tmp.showImgSrc = ''
                if (statusMap[tmp.deviceStatus]) {
                    tmp.showImgSrc = tmp[statusMap[tmp.deviceStatus]]
                }
                return tmp
            })
        },
        buildPointLabel(point) {

            //处理需要显示的数据
            // let list = []
            // for (let obj in this.elementColumn) {
            //     list.push(this.elementColumn[obj])
            // }
            // let filterColumn = list.find(item => {
            //     return item.value == this.element.elementType
            // })

            let filterColumn = this.elementColumn.depository
            if (filterColumn) {
                let first = ''
                let second = ''
                let third = ''
                let fourth = ''
                let devices = point.devices

                for (let j = 0; j < devices.length; j++) {
                    let device = devices[j]
                    let series = device.values.results[0].series
                    if (series) {
                        for (let k = 0; k < series.length; k++) {
                            let column = series[k].values[0][2]
                            let value = series[k].values[0][1]
                            if (column == filterColumn.first) {
                                first += value + utils.appendUnit(column,this.showUnit) + '，'
                            }
                            if (column == filterColumn.second) {
                                second += value + utils.appendUnit(column,this.showUnit) + '，'
                            }
                            if (column == filterColumn.third) {
                                third += value + utils.appendUnit(column,this.showUnit) + '，'
                            }
                            if (column == filterColumn.fourth) {
                                fourth += value + utils.appendUnit(column,this.showUnit) + '，'
                            }
                        }
                    }
                }
                point.label = ''
                if (filterColumn.first == 'ccsPointName' || filterColumn.second == 'ccsPointName' || filterColumn.third == 'ccsPointName' || filterColumn.fourth == 'ccsPointName') {
                    point.label += point.ccsPointName + '<br/>'
                }

                point.label += '<div style="color:#C0C4CC;transform: scale(0.85);">'
                if (first) {
                    first = first.substr(0, first.length - 1)
                    point.label += first + '<br/>'
                }
                if (second) {
                    second = second.substr(0, second.length - 1)
                    point.label += second + '<br/>'
                }
                if (third) {
                    third = third.substr(0, third.length - 1)
                    point.label += third + '<br/>'
                }
                if (fourth) {
                    fourth = fourth.substr(0, fourth.length - 1)
                    point.label += fourth + '<br/>'
                }
                point.label += '</div>'
            }
            return point
        },
        openDrawer() {
            this.drawer = true;
        },
        handleCloseDrawer(who) {
            this.drawer = false;
        },
        fullScreen() {
            let routeData = this.$router.resolve({
                name: 'fullscreen',
                query: {elementId: this.element.scenesElementId, imageUrl: this.element.backgroundUrl}
            });
            window.open(routeData.href, '_blank')
        },
        save() {
            this.editable = false
            let params = this.points.map(item => {
                let tmp = {}
                tmp.ccsPointId = item.ccsPointId
                tmp.longitude = parseFloat(1000 / this.divWidth * item.longitude)
                tmp.latitude = parseFloat(600 / this.divHeight * item.latitude)
                return tmp
            })

            this.element.points = this.points.map(item => {
                let tmp = JSON.parse(JSON.stringify(item))
                tmp.longitude = parseFloat(1000 / this.divWidth * item.longitude)
                tmp.latitude = parseFloat(600 / this.divHeight * item.latitude)
                return tmp
            })

            https.put("ccsPoint/updates", params).then(res => {
                this.$notify.success({
                    duration: 2000,
                    title: '更新成功',
                });
            })
        },
        mousedown(e) {
            if (!this.editable) {
                this.clickPointIndex = e.currentTarget.dataset.index
                this.drawer = true
                return
            }
            this.drawer = false
            let odiv = e.target
            let pointIndex = e.currentTarget.dataset.index

            //算出鼠标相对元素的位置
            let disX = e.clientX - odiv.offsetLeft;
            let disY = e.clientY - odiv.offsetTop;
            document.onmousemove = (e) => {
                let x = e.clientX - disX;
                let y = e.clientY - disY;

                if (e.clientX - disX < 0) {
                    this.points[pointIndex].longitude = 0
                } else if (e.clientX - disX > this.divWidth) {
                    this.points[pointIndex].longitude = this.divWidth
                } else {
                    this.points[pointIndex].longitude = e.clientX - disX
                }

                if (e.clientY - disY < 0) {
                    this.points[pointIndex].latitude = 0
                } else if (e.clientY - disY > this.divHeight) {
                    this.points[pointIndex].latitude = this.divHeight
                } else {
                    this.points[pointIndex].latitude = e.clientY - disY
                }
            };
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        },
        clickElementMap(e) {
            this.drawer = false
        },
        getElement(elementId) {
            if (!elementId) {
                return
            }
            https.get('/ccsScenesElement/getCcsElementById?id=' + elementId).then(res => {
                if(res.headers && res.headers["iot-token"]){
                    window.localStorage.setItem("token", res.headers["iot-token"]);
                }
                this.element = res.data
            })
        },
    },
    mounted() {
        window.onresize = () => {
            this.resetPointPosition()
        }

        // this.getElementIntervalTask = setInterval(() => {
        //     if (!this.editable) {
        //         this.getElement(this.element.scenesElementId)
        //     }
        // }, 30 * 1000)
    },
    destroyed() {
        window.onresize = null
        window.clearInterval(this.getElementIntervalTask);
    }
}
</script>

<style scoped>

.map-box {
    position: relative;
    box-sizing: border-box;
}

.divContainer {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(https://iot-test.tracentsure.com/iotap/api//file/3a0d70cad50e41b3ac9681c225b5a42f.png);
    background-size: 100% 100%;
    box-sizing: border-box;
}

.point {
    min-width: 40px;
    width: auto;
    height: 20px;
    position: absolute;
    z-index: 999;
}

.point .icon {
    position: absolute;
    top: -7px;
    left: -7px;
    width: 8px;
    height: 8px;
}

.point .text {
    color: white;
    font-size: 12px;
    position: absolute;
    top: -4px;
    left: 13px;
    width: auto;
}

.transparent-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
