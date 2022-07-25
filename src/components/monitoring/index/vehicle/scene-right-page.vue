<template>
    <div class="drawer-box ani-bottom">
        <div class="container-box">
            <div class="header">
                <el-row>
                    <el-col :span="22">
                        <span class="demonstration">滑动调节时间轴</span>
                        <el-slider
                            v-model="sliderValue"
                            :max="sliderMaxCount"
                            :format-tooltip="formatSliderTootip"
                            @input="sliderChange"
                        ></el-slider>
                        <div
                            class="headerBeforeIcon" 
                            style="position: absolute;top: 3px;right: 7px;z-index: 1001;color: gray;cursor: pointer;font-size: 15px;"
                        >
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
                    </el-col>
                </el-row>
            </div>
            <div class="content">
                <div class="left">
                    <el-tooltip
                        :content="element.scenesElementName"
                        placement="right"
                    >
                        <div class="title">{{ element.scenesElementName }}</div>
                    </el-tooltip>
                    <div class="point-box">
                        <el-tabs
                            tab-position="left"
                            @tab-click="tabClick"
                            v-model="activeTab"
                        >
                            <!-- 
                                之前用的设备名称
                                :label="item.devName"
                            -->
                            <el-tab-pane
                                :label="item.pointName"
                                v-for="(item, index) in element.devList"
                                :name="item.id + ''"
                                :key="index"
                            >
                                <!-- :data-deviceid="item.id" 之前取 id 字段, 现在取 pointId -->
                                <div
                                    class="devices"
                                    :style="
                                        activeDevice == index ? 'color:white;' : ''
                                    "
                                    :key="index"
                                    @click="selectDevice"
                                    :data-index="index"
                                    :data-deviceid="item.pointId" 
                                >
                                    <span
                                        class="devices-span devices-span-name"
                                    >
                                        {{ item.devName }} 
                                    </span>

                                    <span
                                        class="devices-span devices-span-status"
                                        style="font-size: 9px;transform: scale(0.8)"
                                        >{{
                                            $store.state.statusDesMap[
                                                item.deviceStatus
                                            ]
                                        }}</span
                                    >
                                </div>
                            </el-tab-pane>
                            <!--
                                yxh 之前逻辑
                                <el-tab-pane
                                :label="item.ccsPointName"
                                v-for="(item, index) in element.points"
                                :name="item.ccsPointId + ''"
                                :key="index"
                            >
                                <div
                                    class="devices"
                                    :style="
                                        activeDevice == i2 ? 'color:white;' : ''
                                    "
                                    :key="i2"
                                    @click="selectDevice"
                                    :data-index="i2"
                                    :data-deviceid="item2.id"
                                    v-for="(item2, i2) in item.devices"
                                >
                                    <span
                                        class="devices-span devices-span-name"
                                    >
                                        {{ item2.name }}
                                    </span>

                                    <span
                                        class="devices-span devices-span-status"
                                        style="font-size: 9px;transform: scale(0.8)"
                                        >{{
                                            $store.state.statusDesMap[
                                                item2.deviceStatus
                                            ]
                                        }}</span
                                    >
                                </div>
                            </el-tab-pane> -->
                        </el-tabs>
                    </div>
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
                    <div
                        style="position: absolute;top: 3px;right: 7px;z-index: 1001;color: gray;cursor: pointer;font-size: 15px;"
                    >
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
                style="position: absolute;top: -28px;right: 0px;z-index: 1000;height: 32px;width: 400px;"
                v-model="datePickerRangeValue"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :default-time="['00:00:00', '23:59:59']"
                @change="datePickerRangeChange"
            >
            </el-date-picker>

            <div v-if="visibleRecord" class="warning-box">
                <el-table
                    height="300"
                    size="mini"
                    :data="warningRecordList"
                    :header-cell-style="{
                        background: 'rgba(0,0,0,0)',
                        color: '#fff'
                    }"
                >
                    <el-table-column
                        prop="createTime"
                        label="发生时间"
                        width="180"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.createTime | time }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="restoreTime"
                        label="恢复时间"
                        width="180"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.restoreTime | time }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="restoreTime" label="持续时间">
                        <template slot-scope="scope">
                            {{
                                scope.row.id
                                    ? formatMsToTime(
                                          scope.row.restoreTime
                                              ? scope.row.restoreTime
                                              : Date.now(),
                                          scope.row.createTime
                                      )
                                    : ""
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="warnTypes" label="告警类型">
                        <template slot-scope="scope">
                            {{
                                warningType[scope.row.warnTypes] ||
                                    scope.row.warnTypes
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="ccsPointName" label="监控对象">
                    </el-table-column>

                    <el-table-column prop="devName" label="设备名称">
                    </el-table-column>
                    <el-table-column prop="devName" label="状态">
                        <template slot-scope="scope">
                            {{ confirmStatus[scope.row.confirmStatus] }}
                        </template>
                    </el-table-column>
                </el-table>
                <!--                <div style="display: flex;align-items: center;justify-content: center;height:40px;">-->
                <!--                    <el-pagination-->
                <!--                        background-->
                <!--                        @current-change="changePage"-->
                <!--                        :pager-count="5"-->
                <!--                        layout="prev, pager, next"-->
                <!--                        :small="true"-->
                <!--                        :total="page.total"-->
                <!--                        :current-page="page.currentPage"-->
                <!--                        :page-size="page.pageSize"-->
                <!--                    >-->
                <!--                    </el-pagination>-->
                <!--                </div>-->
            </div>
        </div>
    </div>
</template>

<script>
import utils from "@/tools/utils";
import https from "../../../../https";

export default {
    name: "scene-right-page",
    props: {
        element: {
            type: Object,
            default: {}
        },
        pointIndex: {
            type: String,
            default: ""
        },
        refreshEcharts: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            user: this.$store.state.user,
            warningType: {
                1: "温度",
                2: "湿度",
                3: "电压",
                4: "离线时间"
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
            warningRecordList: [],
            first: true,
            firstEvent: null,
            deviceId: "",
            startDate: "", //获取历史数据开始时间
            endDate: "", //获取历史数据结束时间
            showDatePickerRange: false,
            datePickerRangeValue: "",
            activeTab: "",
            sliderMaxCount: 1,
            options: {},
            warningRecord: [],
            points: [],
            devices: [],
            sliderValue: 0,
            pointsDefaultProps: {
                children: "devices",
                label: "name"
            },
            colors: ["#91CC75", "#5470C6", "#eeab7f"],
            activeDevice: 0,
            ccsScenesElementHistoryData: [],

            tipsDataList : [] // slider tips 数据列表
        };
    },
    watch: {
        element(newValue, oldValue) {
            this.activeDevice = 0;
            if (
                oldValue &&
                oldValue.scenesElementId === newValue.scenesElementId
            ) {
                return;
            }

            if (
                newValue.points.length > 0
            ) {
                this.resetDialogContent(0);
                if (this.visibleRecord) {
                    this.changePage(1);
                }
            }
            /*
                yxh 之前逻辑
                if (
                    newValue.points.length > 0 &&
                    newValue.points[0].devices.length > 0
                ) {
                    this.resetDialogContent(0);
                    if (this.visibleRecord) {
                        this.changePage(1);
                    }
                }
            */
        },
        pointIndex(pIndex) {
            this.resetDialogContent(pIndex);
            if (this.visibleRecord) {
                this.changePage(1);
            }
        },
        refreshEcharts(newValue) {
            this.getDeviceHistory(this.deviceId);
        }
    },
    methods: {
        formatMsToTime(restoreTime, createTime) {
            if (!createTime || !restoreTime) {
                return "--";
            }
            return utils.formatMsToTime(restoreTime - createTime);
        },
        resetDialogContent(pIndex) {
            // let point = this.element.points[pIndex];

            // if (this.first) {
            //     this.firstEvent = setTimeout(() => {
            //         this.activeTab = point.ccsPointId.toString();
            //         this.activeDevice = 0;
            //         this.first = false;
            //     }, 200);
            // } else {
            //     this.activeTab = point.ccsPointId.toString();
            //     this.activeDevice = 0;
            // }
            if (this.element.length > 0) {
                //点位下有设备
                let deviceId = this.element[0].deviceId || this.element[0].id;
                this.getDeviceHistory(deviceId);
            } else {
                this.ccsScenesElementHistoryData = [];
                this.options = this.getOptions();
            }

            /*
                // yxh 之前逻辑
                let point = this.element.points[pIndex];

                if (this.first) {
                    this.firstEvent = setTimeout(() => {
                        this.activeTab = point.ccsPointId.toString();
                        this.activeDevice = 0;
                        this.first = false;
                    }, 200);
                } else {
                    this.activeTab = point.ccsPointId.toString();
                    this.activeDevice = 0;
                }
                if (point.devices.length > 0) {
                    //点位下有设备
                    let deviceId = point.devices[0].id || point.devices[0].deviceId;
                    this.getDeviceHistory(deviceId);
                } else {
                    this.ccsScenesElementHistoryData = [];
                    this.options = this.getOptions();
                }
            */
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
            this.getDeviceHistory();
            this.$emit(
                "date-picker-range-change",
                this.startDate,
                this.endDate
            );
        },
        setTipsDataList( arr ){
            this.tipsDataList = arr ;
        },
        setSliderMaxCount( sliderMaxCount ){
            this.sliderMaxCount = sliderMaxCount ;
        },
        formatSliderTootip(value) {
            let item = this.tipsDataList[value];
            if (item && item.createTime) {
                return this.$options.filters["time"](
                    this.tipsDataList[value].createTime
                );
            }
        },
        handleNodeClick(data) {},
        closeDrawer() {
            this.$emit("close-drawer");
        },
        sliderChange(sliderValue) {
            this.$refs.chart.dispatchAction({
                type: "showTip",
                seriesIndex: 0,
                dataIndex: sliderValue
            });
            this.$emit("slider-change", sliderValue);
        },
        selectDevice(e) {
            this.activeDevice = e.currentTarget.dataset.index;
            let deviceId = e.currentTarget.dataset.deviceid;
            this.getDeviceHistory(deviceId);
        },
        tabClick(e) {
            this.activeDevice = "";
            this.sliderValue = 0;
            let devices = this.element.devList;
            if (devices.length > 0) {
                // yxh 之前逻辑
                // let deviceId = devices[e.index - 0].id; // 之前取 id 
                let deviceId = devices[e.index - 0].pointId; // 现在取 pointId

                this.getDeviceHistory(deviceId);

            } else {
                let deviceId = "null";
                this.getDeviceHistory(deviceId);
            }
            
            /*
                yxh 之前逻辑
                // let devices = this.element.points[e.index].devices;
                // if (devices.length > 0) {
                //     let deviceId = devices[0].id;
                //     this.getDeviceHistory(deviceId);
                // } else {
                //     let deviceId = "null";
                //     this.getDeviceHistory(deviceId);
                // }
            */
        },
        async getDeviceHistory(deviceId) {
            if (deviceId) {
                this.deviceId = deviceId;
            }
            this.sliderValue = 0;
            let params = {
                // yxh 之前参数
                // deviceId: this.deviceId,
                pointId: this.deviceId,

                elementType : this.element.elementType,
                startDate: this.startDate,
                endDate: this.endDate
            };

            const loading = this.$loading({
                lock: true,
                customClass: "create-isLoading",
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.3)"
            });

            //上传周期
            if (this.deviceId == "null") {
                this.$notify.error({
                    message: "deviceId为空，未绑定设备！"
                });
                loading.close();
                return;
            }

            https
                .get("/ccsScenesElement/getCcsScenesElementHistoryData", params)
                .then(res => {
                    loading.close();
                    let list = res;

                    res.forEach( v => {
                        // v.createTime =
                    } ) ;

                    // this.sliderMaxCount =
                    //     list.length === 0 ? 0 : list.length - 1;

                    this.ccsScenesElementHistoryData = list;
                    this.options.legend.data = [];
                    this.options.xAxis.data = [];
                    this.options.yAxis = [];
                    this.options.series = [];

                    if (list.length <= 0) {
                        this.options = this.getOptions();
                        // return;
                    } else {
                        // 时间数组
                        let xAxisData = list.map(item => {
                            return item.time;
                        });
                        let loseData = []; //丢失数据
                        if (this.user.omcFlag === 1) {

                            /*
                                // yxh 之前逻辑
                                //上传周期
                                // let reportCycle = this.calcReportCycle(xAxisData)
                                //计算丢失数据
                                let repairDataIndex = [];
                                for (let i = 1; i < xAxisData.length; i++) {
                                    if (
                                        xAxisData[i] - xAxisData[i - 1] >
                                        reportCycle
                                    ) {
                                        loseData.push([
                                            { xAxis: xAxisData[i - 1] },
                                            { xAxis: xAxisData[i] }
                                        ]);
                                        let lostCount =
                                            parseInt(
                                                (xAxisData[i] - xAxisData[i - 1]) /
                                                    reportCycle
                                            ) - 1; //丢失次数
                                        let lostStartTime = xAxisData[i - 1]; //丢失时间起点
                                        repairDataIndex.push([
                                            lostCount,
                                            lostStartTime
                                        ]);
                                    }
                                }
                                for (let i = 0; i < repairDataIndex.length; i++) {
                                    let count = repairDataIndex[i][0]; //丢失次数
                                    let time = repairDataIndex[i][1]; //丢失时间起点
                                    for (let j = 0; j < count; j++) {
                                        time += reportCycle;
                                        list.push({
                                            humidity: null,
                                            temperature: null,
                                            time: time,
                                            voltage: null
                                        });
                                    }
                                }

                                //重新排序
                                list.sort(function(a, b) {
                                    return a.time - b.time;
                                });
                                xAxisData = list.map(item => {
                                    return item.time;
                                });
                            */
                            //重新排序
                            list.sort(function(a, b) {
                                return a.createTime - b.createTime;
                            });
                            xAxisData = list.map(item => {
                                return item.createTime;
                            });
                        }
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
                            loseData
                        );
                        this.options.series.push(seriesItem);
                        let yAxisItem = this.getYAxisItem(
                            name,
                            "{value} °C",
                            0
                        );
                        this.options.legend.data.push(name);
                        this.options.yAxis.push(yAxisItem);

                        //湿度
                        name = "湿度";
                        data = list.map(item => {
                            return [item.createTime, item.humidity ];
                        });
                        seriesItem = this.getSeriesItem(
                            name,
                            1,
                            data,
                            loseData
                        );
                        this.options.series.push(seriesItem);
                        yAxisItem = this.getYAxisItem(name, "{value}%", 1);
                        this.options.legend.data.push(name);
                        this.options.yAxis.push(yAxisItem);

                        //电量
                        name = "电量";
                        data = list.map(item => {
                            return [item.createTime, item.voltage];
                        });
                        seriesItem = this.getSeriesItem(
                            name,
                            2,
                            data,
                            loseData
                        );
                        this.options.series.push(seriesItem);
                        yAxisItem = this.getYAxisItem(name, "{value}%", 2);
                        this.options.legend.data.push(name);
                        this.options.yAxis.push(yAxisItem);

                        //重置进度条max属性
                        // this.sliderMaxCount = 100;
                        // this.sliderMaxCount = list.length - 1;
                    }
                    // this.$emit("select-device", res); // 之前逻辑
                })
                .catch(error => {
                    this.$notify.error({
                        message: "网络请求失败，请稍后再试！"
                    });
                    loading.close();
                });
        },
        getSeriesItem(name, yAxisIndex, data, loseData) {
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
            if (loseData) {
                ret.markArea = {
                    itemStyle: {
                        color: "rgb(173,45,53)"
                    },
                    data: loseData
                };
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
                                    tip +=
                                        format2(params[i].value[0]) + "<br/>";
                                }
                                let indexColor = params[i].color;
                                let value =
                                    params[i].value[1] !== null
                                        ? params[i].value[1]
                                        : " - ";
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
                    boundaryGap: false,
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
        changePage(page) {
            if (this.pointIndex) {
                let point = this.element.points[this.pointIndex];
                let params = {
                    pointId: point.ccsPointId,
                    pageNo: 1, //分页需要修改此字段
                    pageSize: this.page.pageSize,
                    status: "",
                    occurBegin: "",
                    occurEnd: "",
                    restoreBegin: "",
                    restoreEnd: "",
                    devName: "",
                    devId: "",
                    confirmStatus: "0",
                    warnType: "",
                    warnLevel: "",
                    recoveryStatus: ""
                };
                https.get("/ccsWarnRecord/point", params).then(res => {
                    this.warningRecordList = res;
                });
            } else {
                let elementId = this.element.scenesElementId;
                let params = {
                    elementId: elementId,
                    pageNo: 1, //分页需要修改此字段
                    pageSize: this.page.pageSize,
                    status: "",
                    occurBegin: "",
                    occurEnd: "",
                    restoreBegin: "",
                    restoreEnd: "",
                    devName: "",
                    devId: "",
                    confirmStatus: "0",
                    warnType: "",
                    warnLevel: "",
                    recoveryStatus: ""
                };
                https.get("/ccsWarnRecord/element", params).then(res => {
                    this.warningRecordList = res;
                });
            }
        },
        clickShowRecored() {
            if (this.visibleRecord) {
                this.visibleRecord = false;
                return;
            }
            this.visibleRecord = true;
            this.changePage(1);
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
        }
    },
    mounted() {
        this.options = this.getOptions();

         this.resetDialogContent(0);

         if( this.element.devList && this.element.devList.length ){
            this.activeTab = this.element.devList[0].id + ''
            
            // yxh 之前逻辑参数
            //  const deviceId = this.element.devList[0].id // 之前取 id 
            //  this.getDeviceHistory(deviceId)

            const deviceId = this.element.devList[0].pointId ; // 现在取 pointId 
            this.getDeviceHistory(deviceId) ; 
        } else {
            // this.$message({
            //     message : `${ this.element.scenesElementName } 暂无设备绑定! 请先绑定设备`,
            //     type : 'warning'
            // }) ;
        }
         
        //  if ( this.element.points.length > 0 ){

        //  }

        /*
            yxh 之前逻辑
            if (
                this.element.points.length > 0 &&
                this.element.points[0].devices.length > 0
            ) {
                if (this.pointIndex > 0) {
                    this.resetDialogContent(this.pointIndex);
                } else {
                    this.resetDialogContent(0);
                }
            }
        */
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
    /* height: 240px; */
    bottom: 0px;
    left: 0px;
    box-sizing: border-box;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.drawer-box .warning-box {
    width: 100%;
    height: 300px;
    position: absolute;
    top: -320px;
    left: 0px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(255, 255, 255, 1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipse;
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

.content .left {
    width: 250px;
    height: 190px;
}

.content .left .title {
    height: 30px;
    box-sizing: border-box;
    font-size: 20px;
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

.devices {
    height: 50px;
    width: 100%;
}

.devices-span {
    display: block;
    height: 50px;
    align-items: center;
    color: gray;
    cursor: pointer;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipse;
}

.devices-span-name {
    float: left;
    width: 80%;
}

.devices-span-status {
    float: right;
    width: 20%;
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
    /* background-color: #eeeeee; */
    background:rgba(244, 161, 49, 1) ;
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

/deep/ .el-input__inner {
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
    animation: ani 0.7s ease forwards;
    -webkit-animation: ani 0.7s ease forwards;
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

.demonstration{ color:white; padding:.5em 0 0; display:block; }
.headerBeforeIcon{ padding:8px 0 0; }
.headerBeforeIcon ::before{ color:white; }
/deep/ .el-slider__button-wrapper{ width:20px; height:20px; top:-9px; }

</style>

<style lang="scss" scoped>
::v-deep .el-pagination {
    .el-pager {
        .number {
            background-color: black !important;
            box-shadow: 0 0 1px rgba(255, 255, 255, 1);
        }

        .el-icon {
            background-color: black !important;
            box-shadow: 0 0 1px rgba(255, 255, 255, 1);
        }

        li:hover {
            color: white !important;
        }
    }

    .btn-prev {
        background-color: black !important;
        box-shadow: 0 0 1px rgba(255, 255, 255, 1);
    }

    .btn-next {
        background-color: black !important;
        box-shadow: 0 0 1px rgba(255, 255, 255, 1);
    }
}

::v-deep .el-table {
    background: rgba(0, 0, 0, 0);

    thead {
        tr {
            th {
                border-bottom: 1px solid #606266 !important;
            }
        }
    }

    tr {
        background: rgba(0, 0, 0, 0) !important;
    }

    td {
        border-bottom: 1px solid #606266;
    }

    thead {
        background: rgba(0, 0, 0, 0) !important;
    }

    .el-table__row {
        background: rgba(0, 0, 0, 0) !important;
        color: white;
    }

    .el-table__body tr:hover > td {
        background-color: gray !important;
    }

    .el-table__body tr.current-row > td {
        background-color: gray !important;
    }
}
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
