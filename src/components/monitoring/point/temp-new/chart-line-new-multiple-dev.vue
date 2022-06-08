<style scoped="">
  .chart-Line {
    height: 400px;
    width: 1200px;
    background: #fff;
  }
</style>
<template>
  <div>
    <!--<div v-if="!dataList || !dataList.length" class="empty-info">暂无信息</div>-->
    <oms-loading :loading="loadingData" v-if="loadingData"/>
    <div class="empty-info" v-else-if="!isHasData">暂无信息</div>
    <!--<e-charts ref="echart" v-else :options="option" theme="light" class="chart-Line"></e-charts>-->
    <div v-else>
      <div :style="{width: chartWidth}" class="chart-Line" id="newChartLine"></div>
    </div>
  </div>
</template>
<script>
    const unitAry = ['', '°C', '%', '%'];
    const titleAry = ['', '温度', '湿度', '电压'];
    import {TempDev} from '@/resources';
    import axios from 'axios';
    import Echarts from 'echarts/lib/echarts';
    import moment from 'moment';

    function formatTime(time) {
        return moment(time).format('YYYY-MM-DD: HH:mm:ss');
    }

    export default {
        props: ['filters', 'isRecord', 'detail', 'chartWidth'],
        data() {
            return {
                loadingData: false,
                isHasData: false,
                returnMap: [],
                tip: []
            };
        },
        watch: {
            filters: {
                handler: function (newVal, oldVal) {
                    this.queryList();
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            getLegend(typeList) {
                return {
                    data: typeList.map(m => m.pointName)
                };
            },
            getYAxis(typeList) {
                let {setMaxAndMin} = this;
                let index = typeList -1;
                let ot = this.isRecord ? 40 : 50;
                let obj = {
                    name: titleAry[typeList] + `(${unitAry[typeList]})`,
                    offset: index === 2 ? ot : 0,
                    type: 'value'
                };
                setMaxAndMin(obj, typeList);
                return obj;
            },
            setMaxAndMin(obj, type) {
                obj.min = value => value.min;
                obj.max = value => value.max;
            },
            getData(data, i, index) {
                console.log('执行了第一种方法')
                return {
                    name: i.pointName,
                    type: 'line',
                    showSymbol: true,
                    symbolSize: 6,
                    data: data,
                    smooth: true,
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            [
                                {
                                    type: 'average',
                                    name: '平均值',
                                    x: '10%'
                                },
                                {
                                    type: 'average',
                                    x: '92%'
                                }
                            ]
                        ]
                    }
                };
            },
            getData2(data, i, index, returnMap) {
                let markline = []
                if (data.length) {
                    markline = data[0].returnMap.map(v => {
                        return {
                            xAxis: v.timeStamp,
                            label: {
                                formatter(params) {
                                    return moment(v.timeStamp).format(('HH:mm:ss')) + '\n' + moment(v.timeStamp).format(('YYYY-MM-DD'))
                                },
                                position: 'start',
                                distance: 7,
                            },
                        }
                    })

                }
                return {
                    name: i.pointName,
                    type: 'line',
                    showSymbol: true,
                    symbolSize: 6,
                    data: data,
                    smooth: true,
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            [
                                {
                                    type: 'average',
                                    name: '平均值',
                                    x: '10%'
                                },
                                {
                                    type: 'average',
                                    x: '92%'
                                }
                            ],
                            ...markline
                        ],
                        silent: true
                    }
                };
            },
            getOption() {
                let obj = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['温度']
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        },
                    },
                    dataZoom: [
                        {
                            id: 'dataZoomXslider',
                            type: 'slider',
                            xAxisIndex: [0],
                            filterMode: 'filter'
                        },
                        {
                            id: 'dataZoomXinside',
                            type: 'inside',
                            xAxisIndex: [0],
                            filterMode: 'filter'
                        }
                    ],
                    grid: {
                        bottom: 80
                    }
                };
                let _this = this;
                obj.tooltip.formatter = function (params) {
                    return _this.getTip(params)
                };
                return obj;
            },
            getTip(params) {
                if (!params.length) return '';
                let collectTime = '';
                let insertTime = '';
                if (this.isRecord) {
                    // 告警事件
                    collectTime = moment(params[0].value[0]).format('MM-DD: HH:mm:ss');
                    insertTime = moment(params[0].value[2]).format('MM-DD: HH:mm:ss');
                } else {
                    // 历史数据
                    collectTime = formatTime(params[0].value[0]);
                    insertTime = formatTime(params[0].value[2]);
                }
                const devCode =params[0].value[3]==null||params[0].value[3]==undefined?'': params[0].value[3]
                const devNo= params[0].value[4]==null||params[0].value[4]==undefined?'':params[0].value[4]
                let str = `采集时间: ${collectTime}<br/>插入时间: ${insertTime}<br/>设备DevCode: ${devCode}<br/>设备DevNo: ${devNo}<br/>`;
                params.forEach(i => {
                    str += `${i.marker}${i.seriesName}: ${i.value[1]}<br/>`;
                });
                return str;
            },
            getAlarmLine(time) {
                return {
                    xAxis: time,
                    label: {
                        formatter: obj => {
                            return this.$moment(obj.value).format('HH:mm:ss');
                        }
                    },
                    lineStyle: {
                        color: 'red'
                    }
                };
            },
            queryList() {
                if (!this.filters.length) {
                    this.isHasData = false;
                    return;
                }
                let {getLegend, getYAxis, getData, getData2, getOption, getAlarmLine} = this;
                const option = getOption();
                // 设置图例
                option.legend = getLegend(this.filters);
                // 设置Y轴
                option.yAxis = getYAxis(this.filters[0].valType);
                option.series = [];
                let httpAry = [];
                this.filters.forEach((i, index) => {
                    const {startTime, endTime, pointId, valType, startPrice} = i;
                    const params = {startTime, endTime, pointId,valType: valType, startPrice};
                    httpAry.push(TempDev.queryPointDevDataNew(params));
                });
                this.loadingData = true;
                this.isHasData = false;
                const flag = this.filters[0].switch
                axios.all(httpAry)
                    .then(axios.spread((...args) => {
                        this.loadingData = false;
                        this.filters.forEach((i, index) => {
                            let dataList=args[index].data;
                            dataList.forEach(d => {
                                let devCode=d.devCode;
                                let devNo=d.devNo;
                                const data = d.ccsDevDataRecordDTOList && d.ccsDevDataRecordDTOList.map(m => {
                                    return {
                                        name: m.createTime,
                                        value: [m.createTime, m.devActval, m.insertTime, devCode,devNo],
                                        returnMap: d.returnMap
                                    };
                                }) || [];
                                data.length && (this.isHasData = true);
                                // console.log(1111,data)

                                if (!flag) {
                                    option.series.push(getData(data, i, index));
                                } else {
                                    option.series.push(getData2(data, i, index))
                                }

                            })
                        });
                        this.$nextTick(() => {
                            let chartDom = document.getElementById('newChartLine');
                            if (!chartDom) return;
                            let chartLine = Echarts.init(chartDom, 'light');
                            if (!chartLine) return;
                            let {isRecord, detail} = this;
                            if (isRecord && option.series.length) {
                                // 时间标线， 起始时间，终止时间
                                option.series.forEach(i => {
                                    const data = i.markLine.data;
                                    if (data.length > 1) return;
                                    data.push(getAlarmLine(detail.createTime));
                                    detail.restoreTime && data.push(getAlarmLine(detail.restoreTime));
                                });
                                chartLine.setOption(option);
                            } else {
                                chartLine.setOption(option);
                            }
                        });
                    })).catch(e => {
                    this.loadingData = false;
                    this.isHasData = false;
                    this.$notify.error({
                        title: '查询错误',
                        message: e.response && e.response.data && e.response.data.msg || ''
                    });
                });
            }
        }
    };
</script>
