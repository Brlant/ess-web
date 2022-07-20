<template>
    <div class="drawer-box ani-bottom" :class="{ bigScreen : isBigScreen }">
        <div class="container-box">
            <div class="header">
                <el-row style="width: 100%;">
                    <el-col :span="22">
                        <el-slider style="z-index: 9999999;position: relative"
                            v-model="sliderValue"
                            :max="sliderMaxCount"
                            :format-tooltip="formatSliderTootip"
                            @input="sliderChange"
                        ></el-slider>

                    </el-col>
                    <div class="headerBeforeIcon" style="position: absolute;top: 3px;right: 7px;z-index: 1001;color: gray;cursor: pointer;font-size: 15px;" >
                        <i
                            class="el-icon-time"
                            @click="showDatePickerRange = !showDatePickerRange"
                        ></i>
                        <i
                            class=" el-icon-warning-outline"
                            @click="clickShowRecored"
                            style="margin:0 10px;"
                        ></i>
                        <i class="el-icon-circle-close" @click="closeDrawer"></i>
                    </div>

                     <!-- 
                        之前逻辑
                        <el-col :span="2">
                            <i class="el-icon-error" @click="closeDrawer"></i>
                        </el-col> 
                    -->
                </el-row>
            </div>
            <div class="content">
                <div class="left">
                    <el-tooltip  :content="element.scenesElementName"  placement="right"  >
                        <div class="title">{{ element.scenesElementName }}</div>
                    </el-tooltip>
                 <p class="device-name" >{{"设备Code："+selectDevice.devCode }}</p>
                 <p class="device-name" v-if="+element.itemValue.isLocation">{{`坐标: ${element.itemValue.positionX}, ${element.itemValue.positionY}` }}</p>
                 <p class="device-name" v-if="+element.itemValue.isLocation">{{`转换坐标: ${element.itemValue.positionX * element.itemValue.indoorPositionSceneDTO.pointRatio}, ${element.itemValue.positionY * element.itemValue.indoorPositionSceneDTO.pointRatio}` }}</p>
                </div>
                <div class="right">
                    <e-charts
                        class="e-charts-box"
                        :options="options"
                        ref="chart"
                        theme="light"
                    >
                    </e-charts>
                </div>
                <!-- 
                    之前逻辑
                    <div style="position: absolute;top: 3px;right: 7px;z-index: 1001;color: gray;cursor: pointer;font-size: 15px;" >
                        <i
                            class="el-icon-time"
                            @click="showDatePickerRange = !showDatePickerRange"
                        ></i>
                        <i
                            class=" el-icon-warning-outline"
                            @click="clickShowRecored"
                            style="margin-left: 10px;"
                        ></i>
                    </div> 
                -->
            </div>

            <el-date-picker
                size="small"
                v-if="showDatePickerRange"
                style="position: absolute;top: -25px;right: 0px;z-index: 1000;height: 32px;width: 400px;"
                v-model="datePickerRangeValue"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']"
                @change="datePickerRangeChange"
            >
            </el-date-picker>

            <div v-if="visibleRecord" class="statPieceInput" :style=" showDatePickerRange? 'top:-65px;' : 'top: -28px;'">
                <el-input class="input-with-select" placeholder="请选择时间间隔" v-model.number="statPiece"   style="background:white">
                    <el-button slot="prepend" >时间间隔(分钟)：</el-button>
                    <el-button slot="append" icon="el-icon-search" @click="changePage"></el-button>
                </el-input>
            </div>
        </div>
    </div>
</template>

<script>
import utils from "@/tools/utils";
import https from "@/https";
import {TempDev} from '@/resources';

export default {
    name: "static-details",
    props: {
        element: {
            type: Object,
            default: {}
        },
        isBigScreen : {
            type : Boolean,
            default : false
        },
        refreshEcharts: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            user: this.$store.state.user,
            warningType: {
                1: "温度",
                2: "湿度",
                3: "电压",
            },
            page: {
                total: 10000,
                currentPage: 1,
                pageSize: 10
            },
            visibleRecord: false,
            confirmStatus: {
                0: "未确认",
                1: "已确认",
                2: "取消"
            },
            statPiece:1,
            warningRecordList: [],
            first: true,
            firstEvent: null,
            pointId: "",
            startDate: "", //获取历史数据开始时间
            endDate: "", //获取历史数据结束时间
            showDatePickerRange: false,
            datePickerRangeValue: "",
            sliderMaxCount: 0,
            options: {
                legend : {
                    data : []
                },
                xAxis: {
                    data : []
                },
                yAxis : [],
                series : []
            },
            selectDevice:{
                ccsDevId:'',
                devCode:''
            },
            sliderValue: 0,
            colors: ["#91CC75", "#5470C6", "#eeab7f"],
            ccsScenesElementHistoryData: [],
            devicesInfo:[]
        };
    },
    watch: {
        element(newValue, oldValue) {
            if (oldValue && oldValue.scenesElementId === newValue.scenesElementId ) {
                return;
            }
            this.selectDevice={
                devType:newValue.devlist[0].devType,
                devCode:newValue.devCode
            }

            if(newValue.scenesElementId) {
                this.resetDialogContent();
            }
        },
        refreshEcharts(newValue) {
            if(newValue){
                this.getPonitHistory(newValue);
            }

        }
    },
    methods: {
        formatMsToTime(restoreTime, createTime) {
            if (!createTime || !restoreTime) {
                return "--";
            }
            return utils.formatMsToTime(restoreTime - createTime);
        },
        resetDialogContent() {
            if (this.element.length > 0) {
                //点位下有设备
                let ponitId = this.element.scenesElementId || this.element.devlist[0].pointId;
                this.getPonitHistory(ponitId);
            } else {
                this.ccsScenesElementHistoryData = [];
                this.options = this.getOptions();
            }
        },
        datePickerRangeChange(date) {
            let format = this.$options.filters["time"];
            if (date) {
                this.startDate = format(date[0].getTime());
                this.endDate = format(date[1].getTime());
            } else {
                this.startDate = "";
                this.endDate = "";
            }
            this.showDatePickerRange = false;
            this.getPonitHistory();
            this.$emit(
                "date-picker-range-change",
                this.startDate,
                this.endDate
            );
        },
        formatSliderTootip(value) {
            let item = this.ccsScenesElementHistoryData[value];
            if (item && item.time) {
                return this.$options.filters["time"](
                    this.ccsScenesElementHistoryData[value].time
                );
            }
        },
        closeDrawer() {
            this.$emit("close-drawer");
        },
        sliderChange(sliderValue) {
              let item = this.ccsScenesElementHistoryData[sliderValue];
               let dev= {
                   ccsDevId:'',
                   devCode:''
               };
               this.devicesInfo.forEach(n=>{
                    if(n.timeStamp>item.createTime){
                        dev= {
                            ccsDevId:n.oldId,
                            devCode:n.oldCode,
                        };
                    }else{
                        dev= {
                            ccsDevId:n.newId,
                            devCode:n.newCode,
                        };
                    }
                })
            if(dev){
                this.selectDevice.ccsDevId=dev.ccsDevId;
                this.selectDevice.devCode=dev.devCode;
            }
            if(this.selectDevice.ccsDevId==""){
                this.selectDevice.ccsDevId=this.element.devlist[0].ccsDevId;
                this.selectDevice.devCode=this.element.devCode;
            }
            this.$refs.chart.dispatchAction({
                type: "showTip",
                seriesIndex: 0,
                dataIndex: sliderValue
            });
            this.$emit("slider-change", sliderValue);
        },
        async getPonitHistory(pointId) {
            if (pointId) {
                this.pointId = pointId;
            }

            this.sliderValue = 0;
            let params = {
                startTime: this.startDate,
                endTime: this.endDate,
                pointId: this.pointId,
                startPrice:this.statPiece
            };
            const loading = this.$loading({
                lock: true,
                customClass: "create-isLoading",
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.3)"
            });

            this.options = this.getOptions();

            this.options.legend.data = [];
            this.options.xAxis.data = [];
            this.options.yAxis = [];
            this.options.series = [];
            let list = [];

            https.get("/mcc-data/ccsDevice/point/getPointAllData",params)
                .then(res => {
                    loading.close();
                    list=res.ccsDevDataList;
                    let devices=res.deviceInfoList;
                    this.devicesInfo=devices;

                    //重新排序
                    list.sort(function(a, b) {
                        return a.createTime - b.createTime;
                    });

                    let xAxisData  = list.map(item => {
                            return item.createTime;
                    });
                    this.sliderMaxCount = list.length === 0 ? 0 : list.length - 1;
                    this.ccsScenesElementHistoryData = list;

                    this.options.xAxis.data = xAxisData;
                    //温度
                    let name = "温度";
                    let data = list.map(item => {
                        return [item.createTime, item.temperature];
                    });
                    let seriesItem = this.getSeriesItem(
                        name,
                        0,
                        data,
                        devices
                    );
                    this.options.series.push(seriesItem);
                    let yAxisItem = this.getYAxisItem(
                        name,
                        "{value} °C",
                        0
                    );
                    this.options.legend.data.push(name);
                    this.options.yAxis.push(yAxisItem);

                     name = "湿度";
                     data = list.map(item => {
                        return [item.createTime, item.humidity];
                    });
                     seriesItem = this.getSeriesItem(
                        name,
                        0,
                        data,
                         devices
                    );
                    this.options.series.push(seriesItem);
                     yAxisItem = this.getYAxisItem(
                        name,
                         "{value}%",
                        1
                    );
                    this.options.legend.data.push(name);

                    this.options.yAxis.push(yAxisItem);

                    name = "电量";
                    data = list.map(item => {
                        return [item.createTime, item.voltage];
                    });
                    seriesItem = this.getSeriesItem(
                        name,
                        0,
                        data,
                        devices
                    );
                    
                    this.options.series.push(seriesItem);
                    yAxisItem = this.getYAxisItem(
                        name,
                        "{value}%",
                      2
                    );
                    this.options.legend.data.push(name);

                    this.options.yAxis.push(yAxisItem);
                    this.options.legend.selected= {
                        // 之前逻辑
                        // '温度': +this.selectDevice.devType === 1,
                        // "湿度": +this.selectDevice.devType === 2,
                        // "电量": +this.selectDevice.devType === 3,

                        '温度': +this.selectDevice.devType === 0 ||
                                +this.selectDevice.devType === 1 ||
                                +this.selectDevice.devType === 2 || 
                                +this.selectDevice.devType === 3,

                        "湿度": +this.selectDevice.devType === 4,
                        "电量": +this.selectDevice.devType === -1, // 暂无电量类型 屏蔽掉为 -1
                        
                    };

                })
                .catch(error => {
                    this.$notify.error({
                        message: "网络请求失败，请稍后再试！"
                    });
                    loading.close();
                });


            // this.$emit("select-device", res);
        },
        getSeriesItem(name, yAxisIndex, data, devices) {
            let ret = {
                name: name,
                yAxisIndex: yAxisIndex,
                symbol: "none",
                smooth: true,
                data: data,
                type: "line",
                markPoint: {
                    data: [
                        { type: "max", name: "最大值" },
                        { type: "min", name: "最小值" }
                    ]
                }
            };
            let timelist=[];
            if(devices!=null&&devices.length>0){
                devices.forEach(item=>{
                  let time=  this.$moment(item.timeStamp).format('YYYY-MM-DD HH:mm:ss');
                    timelist.push({
                        // name: "旧设备:"+item.oldId,
                        name: "旧设备:"+item.oldCode,
                        xAxis:time,
                        label:{
                            show:true,
                            formatter: ['{b}'+"在",'{c}'+"换掉"].join('\n'),
                        }
                    })
                    }
                )
            }
            if(timelist.length>0){
                ret.markLine={
                    itemStyle: {
                        color: "rgb(173,45,53)"
                    },
                    data: timelist
                }
            }

            return ret;
        },
        getYAxisItem(name, formatterLabel, color) {
            let position = color === 0 ? "left" : "right";
            let offset = color === 2 ? 60 : 0;
            return {
                type: "value",
                name: name,
                min: function(value) {
                    return value.min;
                },
                max: function(value) {
                    return value.max;
                },
                position: position,
                offset: offset,
                axisLine: {
                    show: true,
                    lineStyle: {
                        type: "linear",
                        color: "gray", //this.colors[color]
                        width: 1 // 粗细
                    }
                },
                axisLabel: {
                    formatter: formatterLabel
                },
                splitNumber: 3,
                splitLine: {
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: ["gray"]
                    }
                }
            };
        },
        getOptions() {
            let format = this.$options.filters["time"];
            let format2 = this.$options.filters["echartTooltipDate"];
            return {
                color: ["#91CC75", "#5470C6", "#eeab7f"],
                title: {
                    show: true,
                    text: "",
                    textStyle: { color: "#fff" }
                },
                dataZoom: [
                    {
                        type: "inside",
                        xAxisIndex: 0
                    }
                ],
                tooltip: {
                    trigger: "axis",
                    formatter: function(params) {
                        let tip = "";
                        if (params != null && params.length > 0) {
                            for (let i = 0; i < params.length; i++) {
                                if (i == 0) {
                                    tip += format2(params[i].value[0]) + "<br/>";
                                }
                                let indexColor = params[i].color;
                                let value = params[i].value[1] !== null  ? params[i].value[1] : " - ";
                                tip +=
                                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' +
                                    indexColor +
                                    ';"></span>';
                                tip +=
                                    params[i].seriesName +
                                    ":" +
                                    value +
                                    "</br>";
                            }
                        }
                        return tip;
                    }
                },
                legend: {
                    data: ["温度", "湿度", "电量"],
                    itemHeight: 2.5,
                    icon: "rect",
                    textStyle: {
                        color: "gray"
                    }
                },
                // 普通样式。
                itemStyle: {
                    // 点的颜色。
                    // color: 'red'
                },
                label: {
                    show: true
                    // 标签的文字。
                    // formatter: ['122', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                grid: {
                    left: 60,
                    right: 100,
                    top: 45,
                    bottom: 20,
                    borderWidth: 10
                },
                xAxis: {
                    // boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: "gray", // 颜色
                            width: 1 // 粗细
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        formatter: function(value) {
                            return format(value);
                        }
                    },
                    type: "time",
                    data: []
                },
                yAxis: [{}],
                series: [
                    {
                        data: [],
                        type: "line"
                    },
                    {
                        data: [],
                        type: "line"
                    },
                    {
                        data: [],
                        type: "line"
                    }
                ]
            };
        },
        changePage() {
            this.getPonitHistory();
        },
        clickShowRecored() {
            if (this.visibleRecord) {
                this.visibleRecord = false;
                return;
            }
            this.visibleRecord = true;
            this.changePage();
        },
        //计算上传周期
        calcReportCycle(list) {
            let tmp = [];
            for (let i = 1; i < list.length; i++) {
                tmp.push(list[i] - list[i - 1]);
            }
            let reportCycle = this.calcArrMostFrequency(tmp);
            return reportCycle[0];
        },
        //计算数组出现最多的元素(众数)和次数
        calcArrMostFrequency(arr) {
            let maxElement,
                maxNum = 1;
            let obj = arr.reduce((p, n) => {
                p[n] ? p[n]++ : (p[n] = 1);
                if (p[n] > maxNum) {
                    maxElement = n;
                    maxNum++;
                }
                return p;
            }, {});
            return [maxElement, maxNum];
        },

    },
    mounted() {
        this.options = this.getOptions();
        this.resetDialogContent(0);
        this.ponitId = this.element.scenesElementId
        this.selectDevice={
            devType:this.element.devlist[0].devType,
            devCode:this.element.devCode
        }
        if (this.startDate||this.startDate==null||this.startDate=='') {
            this.startDate = this.$moment().format('YYYY-MM-DD 00:00:00');
        }
        if (this.endDate||this.endDate==null||this.endDate=='') {
            this.endDate = this.$moment().format('YYYY-MM-DD HH:mm:ss');
        }
        this.getPonitHistory(this.ponitId)

    },
    destroyed() {
        if (this.firstEvent) {
            window.clearTimeout(this.firstEvent);
        }
    }
};
</script>

<style scoped>
.drawer-box {
    width: 100%;
    height: 240px;
    bottom: 0px;
    left: 0px;
    box-sizing: border-box;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.container-box {
    min-width: 980px;
    width: 80%;
    /* height: 240px; */
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    box-sizing: border-box;
    position: relative;
    box-shadow: 0 0 10px rgba(255, 255, 255, 1);   
    background:rgba(30, 30, 30, 1) ;
    /* 就是这个 */
}

.container-box .header {
    width: 100%;
    height: 30px;
    padding: 0px 10px;
    /*background: rgba(0, 0, 0, 0.7);*/
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.container-box .content {
    /* background: rgba(0, 0, 0, 0.7); */
    width: 100%;
    /* height: 210px; */
    padding: 10px 20px;
    box-sizing: border-box;
    position: relative;
    display: flex;
}
.statPieceInput{
    position: absolute;
    right: 0px;
    z-index: 1000;
    height: 32px;
    width: 300px;
    background: rgba(0, 0, 0, 0.6)
}
.content .left {
    /* width:100px; */
    width:13em;
    /* height: 190px; */
}

.content .left .title {
    height: 30px;
    box-sizing: border-box;
    font-size: 14px;
    /* font-size: 20px; */
    color: #f0b100;
    overflow: hidden;
    line-height: 30px;
}

.content .left .point-box {
    height: 160px;
    box-sizing: border-box;
    overflow: auto;
    padding-left: 0px;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}

.content .left .point-box .el-tabs {
    height: 150px;
}

.content .left .point-box .el-tabs {
    color: gray;
    cursor: pointer;
    font-size: 12px;
    /* height: 50px; */
    display: flex;
    align-items: center;
}


.device-name{
    float: left;
    width: 80%;
    color:white;
    word-wrap: break-word
}


.content .left .warning {
    height: 80px;
    box-sizing: border-box;
    overflow: auto;
}

.content .right {
    height: 190px;
    box-sizing: border-box;
    flex: 1;
}

.el-tree {
    background-color: black;
    height: 80px;
}
.el-icon-error{
    font-size: 28px;
    float: right;
    color: gray;
    margin-top: 5px;
}
.el-tree /deep/ .el-tree-node.is-current > .el-tree-node__content {
    background-color: #333333 !important;
}

.el-tree /deep/ .el-tree-node__content {
    box-sizing: border-box;
    background-color: black;
}

.el-tree /deep/ .el-tree-node__content:hover {
    background-color: #333333;
}

.el-slider /deep/ .el-slider__runway {
    height: 2px;
    color: black;
    background-color: gray;
}

.el-slider /deep/ .el-slider__bar {
    height: 2px;
    color: black;
    background-color: #eeeeee;
}

.el-slider /deep/ .el-slider__button {
    border: solid 2px gray;
}

.el-tabs /deep/ .el-tabs__item {
    color: gray;
    font-size: 12px;
    height: 25px;
    display: flex;
    align-items: center;
    padding-left: 0px;
}

.el-tabs /deep/ .is-active {
    color: white !important;
    font-size: 12px;
}

.el-tabs /deep/ .el-tabs__active-bar {
    background-color: gray;
}

.e-charts-box {
    width: 100%;
    height: 190px;
}

.el-date-editor /deep/ .el-range-separator {
    padding: 0px;
}

/deep/ .el-input__inner{
    background: gray;
    border-radius: 100px;
    border-color: gray;
}

/deep/ .el-input__inner:focus {
    border-color: gray;
    color: #eaeaea;
}

/deep/ .el-date-editor .el-range-input {
    background-color: gray;
}

/deep/ .el-date-editor:hover {
    border-color: gray;
    color: #eaeaea;
}

.ani-bottom {
    /**/animation: ani 0.7s ease forwards;
    -webkit-animation: ani 0.7s ease forwards;
}

.bigScreen{
    position:fixed; bottom:0;
}

@-webkit-keyframes ani {
    0% {
        -webkit-transform: translateY(calc(100vh + 240px));
        transform: translateY(calc(100vh + 240px));
        opacity: 0;
    }
    100% {
        -webkit-transform: translateY(0px);
        transform: translateY(0px);
        opacity: 1;
    }
}
.headerBeforeIcon{ padding:8px 0 0; }
.headerBeforeIcon ::before{ color:white; }
/deep/ .el-slider__button-wrapper{ width:20px; height:20px; top:-9px; }
</style>

<!--修改body子节点loading样式-->
<style lang="scss">
.create-isLoading {
    .el-loading-spinner {
        i {
            color: #eee;
        }

        .el-loading-text {
            color: #eee;
        }
    }
}
</style>
