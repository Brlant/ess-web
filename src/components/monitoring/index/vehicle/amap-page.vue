<template>
    <div style="position: relative;display: flex;">
        <div id="mapContainer" :class="{ modeInfo : modeStyle }" style="flex:1;"></div>
        <scene-right-page
            v-if="drawer"
            ref="sceneRightPage"
            @slider-change="sliderChange"
            @select-device="selectDevice"
            :element="currentClickElement"
            :refreshEcharts="refreshEcharts"
            @close-drawer="handleCloseDrawer"
            @date-picker-range-change="datePickerRangeChange"
        ></scene-right-page>
    </div>
</template>

<script>
import utils from '@/tools/utils';
import {CcsScene, CcsPointDeviceInfo, Point} from "@/resources.js"
import SceneRightPage from './scene-right-page'
import https from "../../../../https";

export default {
    name: "amap-page",
    props: {
        carStatusCode: {
            type: Number,
            default: 1
        },
        modeStyle: {
            type: Boolean,
            default: JSON.parse(localStorage.getItem( 'mapMode' ) )
        },
        sceneid: {
            type: String,
            default: ''
        },
        showmarkerid: {
            type: String,
            default: ''
        },
        elementColumn: {
            type: Object,
            default: {}
        },
        showMarkerIdList: {
            type: Array,
            default: []
        },
        showUnit: {
            type: Boolean,
            default: true,
        },

    },
    data() {
        return {
            refreshEcharts: false,
            elemens: [], //对象列表
            markerList: {},  //覆盖物列表
            map: null, //地图对象
            AMap: null,
            currentClickElement: {},//当前场景下被几点的对象
            isSetFitView: true,//地图是否自适应
            searchValue: '',
            drawer: false,
            moveMarker: null,
            moveMarkerPolylineList: [],
            refreshTask: null,
            startDate: '',
            endDate: '',
            drawIndex: {
                1: 996,//库区
                2: 995,//单位
                3: 997,//车辆
                4: 998,//订单
            }

        };
    },
    components: {
        SceneRightPage,
    },
    methods: {
        showMarkersByElementId() {
            for (let key in this.markerList) {
                if (this.showMarkerIdList.includes(parseInt(key))) {
                    this.markerList[key].show()
                } else {
                    this.markerList[key].hide()
                }
            }
        },
        datePickerRangeChange(startDate, endDate) {
            this.startDate = startDate
            this.endDate = endDate

            //时间修改，marker需要重新画线
            let marker = this.markerList[this.currentClickElement.scenesElementId];
            marker.drawHistoryPolyline() ;
            marker.getScenesElementHistoryLocationFn() ;
        },
        //是否显示所有的marker
        showAllMarker(show, markerid) {
            for (let key in this.markerList) {
                if (show) {
                    this.markerList[key].show();
                } else {
                    this.markerList[key].hide();
                }
            }
            if (markerid) {
                this.markerList[markerid].show();
            }
        },
        //子组件slider组件input事件
        sliderChange(val) {
            if (this.moveMarkerPolylineList.length > 0) {
                let history = this.moveMarkerPolylineList[val];
                if (history && history.longitude && history.latitude) {
                    this.moveMarker.setPosition([history.longitude, history.latitude]);
                    this.moveMarker.show();
                }
            }
        },
        //选择设备事件
        selectDevice(moveMarkerPolylineData) {
            this.moveMarkerPolylineList = moveMarkerPolylineData;

            let marker = this.markerList[this.currentClickElement.scenesElementId];

            //显示可移动marker
            if (moveMarkerPolylineData.length > 0 && moveMarkerPolylineData[0].longitude && moveMarkerPolylineData[0].latitude) {
                this.moveMarker.setPosition([moveMarkerPolylineData[0].longitude, moveMarkerPolylineData[0].latitude]);
                this.moveMarker.show();
            } else {
                // this.$notify.error({
                //     message: '没有找到历史数据'
                // });
            }
        },
        //关闭弹窗
        handleCloseDrawer() {
            this.startDate = ''
            this.endDate = ''
            this.drawer = false;
        },

        //获取所有对象
        getElements(sceneId) {

            utils.amap().then(AMap => {
                this.AMap = AMap;
                CcsPointDeviceInfo.query(sceneId).then(res => {
                    let filterCarStatus = JSON.parse( localStorage.getItem( 'filterCarStatus' ) )  ;

                    if(res.headers && res.headers["iot-token"]){
                        window.localStorage.setItem("token", res.headers["iot-token"]);
                    }

                    // yxh 之前逻辑
                    // let list = res.data.data.filter(item => item.longitude && item.latitude);

                    if( res.data ){
                        let list = res.data.filter(item => item.longitude && item.latitude);
                        if( filterCarStatus ){
                            let statusCode = filterCarStatus[ sceneId ] ;

                            /**
                             * 1 ：仓库
                             * 2 ：单位
                             * 3 ：车辆
                             * 4 ：冷柜
                             * 5 ：订单
                            */

                            // 只针对车辆筛选, 其它数据类型不动
                            switch( +statusCode ){
                                case 1 : // 全部
                                    break ;
                                case 2 : // 监控中车辆
                                    list = list.filter( item => ( item.elementType !== 3 ) || ( item.elementType === 3 && item.monitorFlag && +item.monitorFlag === 1 ) ) ;
                                    break ;
                                case 3 : // 未监控中车辆
                                    list = list.filter( item => ( item.elementType !== 3 ) || ( item.elementType === 3 && item.monitorFlag && +item.monitorFlag === 0 ) ) ;
                                    break ;
                            }
                        }

                        this.elemens = list.map(item => {
                            item.points = [ { latitude : item.latitude, longitude : item.longitude } ] ; // 之前逻辑
                            return item;
                        });

                        if( !list.length ){ // 如果没有数据, 则在下一次请求的时候清除所有标识信息, 没必要画点和线
                            if( this.map ){

                                this.isSetFitView = true;//重置地图区域
                                this.drawer = false;
                                
                                //点击地图空白处删除车辆轨迹 【注意: 应该先清除标识线再重置 this.markerList = {} 】
                                for (let key in this.markerList) {
                                    this.markerList[key].clearHistoryPolyline();
                                }

                                this.markerList = {};
                                //关闭弹窗
                                // this.drawer = false; // 之前逻辑

                                //移除moveMarker
                                if (this.moveMarker) {
                                    this.map.remove(this.moveMarker);
                                }
                                this.startDate = '' ;
                                this.endDate = '' ;

                                this.elemens.forEach((item) => {
                                    this.map.remove(this.markerList[item.scenesElementId]); // 移除marker
                                }) ;

                                this.map.clearMap();
                                this.map.setFitView();

                            }
                            return ;
                        }

                        if( this.map ){
                            this.drawScenePoint();
                            this.$emit('elements-change', this.elemens);
                        }
                        /*
                            yxh 之前逻辑 */
                            this.elemens = list.map(item => {
                                if (this.currentClickElement.scenesElementId == item.scenesElementId) {
                                    this.currentClickElement = item
                                }
                                item.value = item.scenesElementName;
                                item.points = item.points.map(item2 => {
                                    if( item2.devices ){
                                        item2.devices = item2.devices.filter(item3 => {
                                            if (item3.id) {
                                                return item3;
                                            }
                                        })
                                    }
                                    return item2;
                                })
                                return item;
                            });
                            this.drawScenePoint();
                            this.$emit('elements-change', this.elemens);
                       
                    }
                });

            }) ;
        },

        //画点
        drawScenePoint() {
            if (this.elemens.length <= 0) {
                return;
            }

            //循环画点
            this.elemens.forEach((item) => {

                let marker = this.markerList[item.scenesElementId];

                if (marker == undefined) {
                    let position = (!item.longitudePrev || !item.latitudePrev) ? [item.longitude, item.latitude] : [item.longitudePrev, item.latitudePrev];
                    let zIndex = this.drawIndex[item.elementType] ? this.drawIndex[item.elementType] : 900;
                    marker = new this.AMap.Marker({
                        position: position,
                        zIndex: zIndex,
                        offset: new this.AMap.Pixel(0, 15),
                    });
                    this.map.add(marker);
                    marker.item = item;
                    //计算旋转角度
                    marker.calcAngle = function () {
                        //如果没有上一次的经纬度，旋转角是0
                        if (!this.item.longitudePrev || !this.item.latitudePrev) {
                            return 0;
                        }
                        //计算旋转角度
                        let p_start = this.getMap().lngLatToContainer([this.item.longitudePrev, this.item.latitudePrev]),
                            p_end = this.getMap().lngLatToContainer([this.item.longitude, this.item.latitude]);
                        let diff_x = p_end.x - p_start.x,
                            diff_y = p_end.y - p_start.y;
                        return 360 * Math.atan2(diff_y, diff_x) / (2 * Math.PI) + 90;
                    };

                    // removeLabel
                    marker.htmlContent = () => {
                        marker.buildElementLabel()
                        let angle = marker.calcAngle();
                        let html = [];
                        html.push('<div style="position: relative;"  class="markerTxt">');

                        let statusMap = this.$store.state.statusMap
                        let showImgSrc = ''
                        let column = statusMap[marker.item.deviceStatus]
                        if (column) {
                            showImgSrc = marker.item[column]
                        }
                        let  humidityTemperatureVoltageStr = `<div style='display:flex; pointer-events:none; flex-direction:row; flex-wrap:wrap;'>`;
                        if( item.devList ){
                            let elementColumn = window.localStorage.getItem('elementColumn-' + this.sceneid) || null ;
                            let obj = JSON.parse( elementColumn ) ;

                            let carOptions = obj ? obj['car'] : {} ;
                            let carOptionsArr = [] ;

                            for( let attr in carOptions ){
                                carOptionsArr.push( carOptions[attr] ) ;
                            }
                            item.devList.forEach(v => {
                                // if( carOptionsArr.includes('scenesElementName') ){ // 配置项中 对象需要显示的字段 是否包含名称
                                //     humidityTemperatureVoltageStr += `${v.temperature}℃ &nbsp;`;
                                // }
                                let ul = '<ul style="padding:0 3px;">';
                                if( carOptionsArr.includes('temperature') ){ // 配置项中 对象需要显示的字段 是否包含 【温度】
                                    if( v.temperature !== undefined && v.temperature !== null ){

                                        ul += `<li>${v.temperature}℃</li>`;

                                    }
                                }

                                if( carOptionsArr.includes('humidity') ){ // 配置项中 对象需要显示的字段 是否包含 【湿度】
                                    if(v.humidity !== undefined && v.humidity !== null){
                                        ul += `<li>${v.humidity}%</li>`;

                                    }
                                }

                                if( carOptionsArr.includes('voltage') ){ // 配置项中 对象需要显示的字段 是否包含 【电量】
                                    if(v.voltage !== undefined && v.voltage !== null){
                                        ul += `<li>${v.voltage}%</li>`;
                                    }
                                }

                                if( carOptionsArr.includes('devNo') ){ // 配置项中 对象需要显示的字段 是否包含 【设备代码】
                                    if(v.devNo !== undefined && v.devNo !== null){
                                        ul += `<li>${v.devNo}</li>`;
                                    }
                                }
                                if( carOptionsArr.includes('devCode') ){ // 配置项中 对象需要显示的字段 是否包含 【设备编码】
                                    if(v.devCode !== undefined && v.devCode !== null){
                                        ul += `<li>${v.devCode}</li>`;
                                    }

                                }
                                if(v.humidity !== undefined && v.humidity !== null&&v.temperature !== undefined
                                    && v.temperature !== null &&v.voltage !== undefined && v.voltage !== null&&v.devNo !== undefined
                                    && v.devNo !== null&&v.devCode !== undefined && v.devCode !== null) {
                                    if (carOptionsArr.includes('longitude')) { // 配置项中 对象需要显示的字段 是否包含 【经度】
                                        if (marker.item.longitude !== undefined && marker.item.longitude !== null) {
                                            ul += `<li>${Math.round(marker.item.longitude * 10) / 10}°</li>`;

                                        }
                                    }
                                    if (carOptionsArr.includes('latitude')) { // 配置项中 对象需要显示的字段 是否包含 【维度】
                                        if (marker.item.latitude !== undefined && marker.item.latitude !== null) {
                                            ul += `<li>${Math.round(marker.item.latitude * 10) / 10}°</li>`;

                                        }
                                    }
                                    if (carOptionsArr.includes('altitude')) { // 配置项中 对象需要显示的字段 是否包含 【海拔】
                                        if (marker.item.altitude !== undefined && marker.item.altitude !== null) {
                                            ul += `<li>${marker.item.altitude}m</li>`;

                                        }
                                    }
                                    if (carOptionsArr.includes('speed')) { // 配置项中 对象需要显示的字段 是否包含 【速度】
                                        if (marker.item.speed !== undefined && marker.item.speed !== null) {
                                            ul += `<li>${marker.item.speed}</li>`;

                                        }
                                    }
                                    if (carOptionsArr.includes('bearing')) { // 配置项中 对象需要显示的字段 是否包含 【方向角】
                                        if (marker.item.bearing !== undefined && marker.item.bearing !== null) {
                                            ul += `<li>${marker.item.bearing}°</li>`;

                                        }
                                    }
                                }
                                ul += '</ul>';
                                humidityTemperatureVoltageStr += ul;

                            })


                        }

                        let mode = JSON.parse(localStorage.getItem( 'mapMode') ) ;
                        // let styleName = `amap://styles/${ !mode ? 'b1dba72ed6aaf60323637e10e74f5c48' : 'normal' }`;

                        humidityTemperatureVoltageStr+=`</div>`
                        html.push('<img src="' + showImgSrc + '" style="width: 30px ;height:30px ;transform:rotate(' + angle + 'deg);"/>')
                        if (marker.item.label) {
                            html.push(`<div style="color:white;position: absolute;top: 4px;left: 30px;min-width: 150px;font-size: 12px;white-space:nowrap;line-height: 13px;">`);
                            // html.push(`<div class='markerTxt' style="color:white;position: absolute;top: 4px;left: 30px;min-width: 150px;font-size: 12px;white-space:nowrap;line-height: 13px;">`);
                            html.push(marker.item.label) ;
                            html.push(humidityTemperatureVoltageStr) ;
                            html.push('</div>');
                        }

                        html.push('</div>');
                        return html.join('\n');
                    };
                    marker.buildElementLabel = () => {

                        let element = marker.item
                        //处理需要显示的数据
                        let list = []
                        for (let obj in this.elementColumn) {
                            list.push(this.elementColumn[obj])
                        }
                        let filterColumn = list.find(item => {
                            return item.value == element.elementType
                        })

                        let first = ''
                        let second = ''
                        let third = ''
                        let fourth = ''
                        element.label = ''
                        let onlyOneList = ['speed', 'latitude', 'longitude', 'bearing', 'altitude']
                        if (filterColumn) {
                            let points = element.points
                            for (let i = 0; i < points.length; i++) {
                                let point = points[i]
                                let devices = point.devices

                                // yxh 修改逻辑
                                if( devices ){
                                    for (let j = 0; j < devices.length; j++) {
                                        let device = devices[j]
                                        let series = device.values.results[0].series
                                        if (series) {
                                            for (let k = 0; k < series.length; k++) {
                                                let column = series[k].values[0][2]
                                                let value = series[k].values[0][1]

                                                if (column == filterColumn.first) {
                                                    let isExist = onlyOneList.some(item => {
                                                        return filterColumn.first == item
                                                    })
                                                    if (isExist && first != '') {
                                                        continue
                                                    }
                                                    first += value + utils.appendUnit(column,this.showUnit) + '，'
                                                }

                                                if (column == filterColumn.second) {
                                                    let isExist = onlyOneList.some(item => {
                                                        return filterColumn.second == item
                                                    })
                                                    if (isExist && second != '') {
                                                        continue
                                                    }
                                                    second += value + utils.appendUnit(column,this.showUnit) + '，'
                                                }

                                                if (column == filterColumn.third) {
                                                    let isExist = onlyOneList.some(item => {
                                                        return filterColumn.third == item
                                                    })
                                                    if (isExist && third != '') {
                                                        continue
                                                    }
                                                    third += value + utils.appendUnit(column,this.showUnit) + '，'
                                                }

                                                if (column == filterColumn.fourth) {
                                                    let isExist = onlyOneList.some(item => {
                                                        return filterColumn.fourth == item
                                                    })
                                                    if (isExist && fourth != '') {
                                                        continue
                                                    }
                                                    fourth += value + utils.appendUnit(column,this.showUnit) + '，'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (filterColumn.first == 'scenesElementName' || filterColumn.second == 'scenesElementName' || filterColumn.third == 'scenesElementName' || filterColumn.fourth == 'scenesElementName') {
                                element.label += element.scenesElementName + '<br/>'
                            }
                            element.label += '<div style="color:#C0C4CC;transform: scale(0.85);position: absolute;left: -8px;">'
                            if (first) {
                                first = first.substr(0, first.length - 1)
                                element.label += first + '<br/>'
                            }
                            if (second) {
                                second = second.substr(0, second.length - 1)
                                element.label += second + '<br/>'
                            }
                            if (third) {
                                third = third.substr(0, third.length - 1)
                                element.label += third + '<br/>'
                            }
                            if (fourth) {
                                fourth = fourth.substr(0, fourth.length - 1)
                                element.label += fourth + '<br/>'
                            }
                            element.label += '</div>'
                        }
                        marker.item = element
                    }
                    marker.clickEvent = (e) => {
                        this.currentClickElement = e.target.item;

                        this.drawer = false ; // 标示重新渲染弹窗数据

                        setTimeout( () => {
                            this.drawer = true; // 异步打开弹窗, 重新渲染数据对象
                        }, 0 ) ;
                        
                        
                        //清理其他marker轨迹

                        this.clearOtherHistoryPolyline(marker);
                        //清理moveMarker
                        if (this.moveMarker) {
                            marker.getMap().remove(this.moveMarker);
                        }
                        marker.drawHistoryPolyline();
                        // this.moveMarker = new this.AMap.Marker({
                        //     position: [121.489, 31.2534],
                        //     zIndex: 9999,
                        // });
                        // this.map.add(this.moveMarker);
                        // this.moveMarker.hide();

                        marker.getScenesElementHistoryLocationFn() ;

                        
                    };
                    marker.movingEvent = function (e) {
                        if (e.target.historyPolyline !== undefined) {
                            let historyPolyline = e.target.historyPolyline;
                            let opath = historyPolyline.opath;
                            let newPath = opath.concat(e.passedPath);
                            historyPolyline.setPath(newPath);
                        }
                    };
                    marker.animate = function () {
                        if (!this.item.longitudePrev || !this.item.latitudePrev) {
                            return;
                        }

                        if (this.item.longitudePrev == this.item.longitude && this.item.latitudePrev == this.item.latitude) {
                            return;
                        }

                        if (this.lastReqeustLnglat != undefined) {
                            if (this.lastReqeustLnglat.lng == this.item.longitude && this.lastReqeustLnglat.lat == this.item.latitude) {
                                return;
                            }
                        }

                        let lineArr = [
                            [this.item.longitudePrev, this.item.latitudePrev],
                            [this.item.longitude, this.item.latitude]
                        ];
                        let html = this.htmlContent();
                        this.setContent(html);

                        this.moveAlong(lineArr, {
                            // 每一段的时长
                            duration: 28 * 1000,
                            autoRotation: false,
                        });
                        this.off('moving', marker.movingEvent);
                        this.on('moving', marker.movingEvent);
                    };
                    marker.clearHistoryPolyline = function () {
                        if (this.historyPolyline != undefined) {
                            this.getMap().remove(this.historyPolyline);
                            delete this.historyPolyline;
                        }
                    };

                    

                    // 获取拖动手柄轨迹数据
                    marker.getScenesElementHistoryLocationFn = () => {
                        let devList = marker.item.devList
                        
                        let scenesElementId = marker.item.scenesElementId
                        let params = {
                            ccsScenesElementId: scenesElementId,
                            startDate: this.startDate,
                            endDate: this.endDate,
                        }

                        https.get('/ccsScenesElement/getScenesElementHistoryLocation', params).then(res => {

                            if ( res && Array.isArray( res ) && res.length > 0) {
                                let tipsArr = [] ;

                                res.forEach( v => {
                                    tipsArr.push({
                                        longitude : v.longitude,
                                        latitude : v.latitude,
                                        createTime : v.collectionTime
                                    }) ;
                                } ) ;

                                this.moveMarkerPolylineList = tipsArr ;
                                

                                this.$refs['sceneRightPage'] && this.$refs['sceneRightPage'].setTipsDataList( tipsArr ) ; 
                                this.$refs['sceneRightPage'] && this.$refs['sceneRightPage'].setSliderMaxCount( tipsArr.length ) ;

                                this.moveMarker = new this.AMap.Marker({
                                    position: [tipsArr[0].longitude, tipsArr[0].latitude],
                                    // position: [121.489, 31.2534],
                                    zIndex: 9999,
                                });
                                this.map.add(this.moveMarker);
                                this.moveMarker.hide();

                            } else {
                                this.moveMarkerPolylineList = [] ;

                                this.$refs['sceneRightPage'] && this.$refs['sceneRightPage'].setTipsDataList( [] ) ; 
                                this.$refs['sceneRightPage'] && this.$refs['sceneRightPage'].setSliderMaxCount( 0 ) ;
                                this.moveMarker && this.moveMarker.hide();
                            }
                              
                                

                        })
                        
                    };

                    marker.drawHistoryPolyline = () => {
                        let devList = marker.item.devList
                        // let params = {
                        //     deviceId: devList.length ? devList[0].id : '',
                        //     elementType : marker.item.elementType,
                        //     startDate: this.startDate,
                        //     endDate: this.endDate,
                        // }

                        // yxh 之前逻辑接口
                        let scenesElementId = marker.item.scenesElementId
                        let params = {
                            ccsScenesElementId: scenesElementId,
                            startDate: this.startDate,
                            endDate: this.endDate,
                        }
                        https.get('/ccsScenesElement/getCcsScenesElementHistoryLocation', params).then(res => {
                            // devList.length &&  https.get('/ccsScenesElement/getCcsScenesElementHistoryLocation', params).then(res => {

                            if (marker.historyPolyline != undefined) {
                                marker.getMap().remove(marker.historyPolyline);
                                delete marker.historyPolyline;
                            }


                            //重绘历史轨迹
                            if (res.length > 0) {
                                var lineArr = res;
                                //TODO 服务器返回的数据必须比汽车当前位置要多
                                //TODO 1-找到车辆经纬度所在数组的Index
                                //TODO 2-数组分片，取（0-index）
                                // let carIndex = lineArr.findIndex(pathPoint => {
                                //     return pathPoint[0] == marker.item.longitude && pathPoint[1] == marker.item.latitude;
                                // });
                                // lineArr = lineArr.slice(0, carIndex);
                                // 绘制轨迹
                                marker.historyPolyline = new this.AMap.Polyline({
                                    path: lineArr,
                                    // showDir: true,
                                    strokeOpacity: 1,     //线透明度
                                    strokeWeight: 3,      //线宽
                                    strokeStyle: "solid",  //线样式
                                });
                                marker.historyPolyline.opath = lineArr;
                                // marker.getMap().setFitView(marker.historyPolyline)
                                marker.getMap().add(marker.historyPolyline)

                            }
                        })
                        // CcsPointDeviceInfo.getCcsScenesElementHistoryLocationById(scenesElementId).then(res => {
                        //
                        // })
                    };
                    // 需要先移除点击监听事件，再添加监听
                    marker.off('click', marker.clickEvent)
                    marker.on('click', marker.clickEvent);
                } else {
                    //记录上一次请求的经纬度（在animate中，如果lastReqeustLnglat与本次的相同，则汽车没移动，不播放动画）
                    if (marker.item != undefined) {
                        marker.lastReqeustLnglat = {
                            lng: marker.item.longitude,
                            lat: marker.item.latitude,
                            deviceStatus: marker.item.deviceStatus
                        };
                        //位置没变直接return
                        if (marker.lastReqeustLnglat.lng == item.longitude && marker.lastReqeustLnglat.lat == item.latitude) {

                            //状态改变需要重新绘制
                            if (marker.lastReqeustLnglat.deviceStatus != item.deviceStatus) {
                                // console.log(marker.item, 88)
                                marker.item.deviceStatus = item.deviceStatus;
                                let html = marker.htmlContent(); // 之前
                                marker.setContent(html); // 之前
                            }

                            // 这里是绘制温湿度数据逻辑, 如果位置没变也重新绘制
                            let html = [];
                            html.push('<div style="position: relative;"  class="markerTxt">');

                            let statusMap = this.$store.state.statusMap
                            let showImgSrc = ''
                            let column = statusMap[marker.item.deviceStatus]
                            if (column) {
                                showImgSrc = marker.item[column]
                            }


                            let humidityTemperatureVoltageStr = `<div style='display:flex; pointer-events:none; flex-direction:row; flex-wrap:wrap;'>`;
                            if( item.devList ){
                                let elementColumn = window.localStorage.getItem('elementColumn-' + this.sceneid) || null ;
                                let obj = JSON.parse( elementColumn ) ;

                                let carOptions = obj ? obj['car'] : {} ;
                                let carOptionsArr = [] ;

                                for( let attr in carOptions ){
                                    carOptionsArr.push( carOptions[attr] ) ;
                                }

                                item.devList.forEach(v => {
                                    // if( carOptionsArr.includes('scenesElementName') ){ // 配置项中 对象需要显示的字段 是否包含名称
                                    //     humidityTemperatureVoltageStr += `${v.temperature}℃ &nbsp;`;
                                    // }
                                    let ul = '<ul style="padding:0 3px">';
                                    if( carOptionsArr.includes('temperature') ){ // 配置项中 对象需要显示的字段 是否包含 【温度】
                                        if( v.temperature !== undefined && v.temperature !== null ){
                                            ul += `<li >${v.temperature}℃</li>`;
                                        }
                                    }

                                    if( carOptionsArr.includes('humidity') ){ // 配置项中 对象需要显示的字段 是否包含 【湿度】
                                        if(v.humidity !== undefined && v.humidity !== null){
                                            ul += `<li>${v.humidity}%</li>`;
                                        }
                                    }

                                    if( carOptionsArr.includes('voltage') ){ // 配置项中 对象需要显示的字段 是否包含 【电量】
                                        if(v.voltage !== undefined && v.voltage !== null){
                                            ul += `<li>${v.voltage}%</li>`;
                                        }
                                    }
                                    if( carOptionsArr.includes('devNo') ){ // 配置项中 对象需要显示的字段 是否包含 【设备代码】
                                        if(v.devNo !== undefined && v.devNo !== null){
                                            ul += `<li>${v.devNo}</li>`;
                                        }
                                    }
                                    if( carOptionsArr.includes('devCode') ){ // 配置项中 对象需要显示的字段 是否包含 【设备编码】
                                        if(v.devCode !== undefined && v.devCode !== null){
                                            ul += `<li>${v.devCode}</li>`;
                                        }

                                    }
                                    if(v.humidity !== undefined && v.humidity !== null&&v.temperature !== undefined
                                        && v.temperature !== null &&v.voltage !== undefined && v.voltage !== null&&v.devNo !== undefined
                                        && v.devNo !== null&&v.devCode !== undefined && v.devCode !== null) {

                                        if (carOptionsArr.includes('longitude')) { // 配置项中 对象需要显示的字段 是否包含 【经度】
                                            if (marker.item.longitude !== undefined && marker.item.longitude !== null) {
                                                ul += `<li>${Math.round(marker.item.longitude * 10) / 10}°</li>`;
                                            }
                                        }
                                        if (carOptionsArr.includes('latitude')) { // 配置项中 对象需要显示的字段 是否包含 【维度】
                                            if (marker.item.latitude !== undefined && marker.item.latitude !== null) {
                                                ul += `<li>${Math.round(marker.item.latitude * 10) / 10}°</li>`;
                                            }
                                        }
                                        if (carOptionsArr.includes('altitude')) { // 配置项中 对象需要显示的字段 是否包含 【海拔】
                                            if (marker.item.altitude !== undefined && marker.item.altitude !== null) {
                                                ul += `<li>${marker.item.altitude}m</li>`;

                                            }
                                        }
                                        if (carOptionsArr.includes('speed')) { // 配置项中 对象需要显示的字段 是否包含 【速度】
                                            if (marker.item.speed !== undefined && marker.item.speed !== null) {
                                                ul += `<li>${marker.item.speed}</li>`;

                                            }
                                        }
                                        if (carOptionsArr.includes('bearing')) { // 配置项中 对象需要显示的字段 是否包含 【方向角】
                                            if (marker.item.bearing !== undefined && marker.item.bearing !== null) {
                                                ul += `<li>${marker.item.bearing}°</li>`;

                                            }
                                        }
                                    }
                                    ul += '</ul>';

                                    humidityTemperatureVoltageStr += ul;

                                }) ;
                            }

                            humidityTemperatureVoltageStr += '</div>'

                            html.push('<img src="' + showImgSrc + '" style="width: 30px ;height:30px ;transform:rotate(' + marker.calcAngle() + 'deg);"/>')
                            if (marker.item.label) {
                                html.push('<div style="color: white;position: absolute;top: 4px;left: 30px;min-width: 150px;font-size: 12px;white-space:nowrap;line-height: 13px;">');
                                html.push(marker.item.label) ;
                                html.push(humidityTemperatureVoltageStr) ;
                                html.push('</div>');
                            }

                            html.push('</div>');
                            html.join('\n');

                            marker.setContent(html.join('\n'));
                            return
                        }

                        if (item.longitude !== 0 || item.latitude !== 0) {
                            marker.setPosition([item.longitude, item.latitude]);
                        }
                    }
                }

                //本次的
                marker.item = item;
                //如果已经画线了，则继续画线
                if (marker.historyPolyline != undefined) {
                    marker.drawHistoryPolyline();
                }
                let html = marker.htmlContent();

                marker.setContent(html);
                marker.animate();
                this.markerList[item.scenesElementId] = marker;
            });
            if (this.isSetFitView) {
                this.map.setFitView();
            }
            this.isSetFitView = false;
            this.showMarkersByElementId();
        },

        //删除所有marker
        removeMarkerList() {
            for (let key in this.markerList) {
                this.markerList[key].clearHistoryPolyline();
                this.map.remove(this.markerList[key]);
            }
        },

        //点击marker，需要删除其他marker的polyline
        clearOtherHistoryPolyline(marker) {
            for (let key in this.markerList) {
                if (marker.item.scenesElementId !== this.markerList[key].item.scenesElementId) {
                    this.markerList[key].clearHistoryPolyline();
                }
            }
        },

        changeSceneidFn(){
            let mode = JSON.parse(localStorage.getItem( 'mapMode') ) ;
            // this.removeMarkerList();//切换场景删除markerlist所有marker
            this.isSetFitView = true;//重置地图区域
            this.drawer = false;
            this.markerList = {};
            utils.amap().then(AMap => {
                this.AMap = AMap;
                this.map = new this.AMap.Map('mapContainer', {
                    center: [121.489, 31.2534],
                    resizeEnable: true,
                    zoom: 11,
                });
                //设置地图主题
                let styleName = `amap://styles/${ !mode ? 'b1dba72ed6aaf60323637e10e74f5c48' : 'normal' }`;
                this.map.setMapStyle(styleName);
                this.map.on('click', () => {
                    //点击地图空白处删除车辆轨迹
                    for (let key in this.markerList) {
                        this.markerList[key].clearHistoryPolyline();
                    }
                    //关闭弹窗
                    // this.drawer = false; // 之前逻辑

                    //移除moveMarker
                    if (this.moveMarker) {
                        this.map.remove(this.moveMarker);
                    }
                    this.startDate = ''
                    this.endDate = ''
                });
                this.getElements(this.sceneid);
            });
        }
    },
    watch: {
        carStatusCode( n, o ){
            // this.sceneid && this.getElements(this.sceneid);
            this.changeSceneidFn() ;
        },
        modeStyle( n, o ){
            if(this.map){
                let mode = JSON.parse(localStorage.getItem( 'mapMode')) ;
                let styleName = `amap://styles/${ !mode ? 'b1dba72ed6aaf60323637e10e74f5c48' : 'normal' }`;
                this.map.setMapStyle(styleName);
                this.modeStyle = mode ;
            } else {
                this.changeSceneidFn() ;
            }
        },
        sceneid(newValue, oldValue) {
            this.changeSceneidFn() ;
        },
        showmarkerid(newValue, oldValue) {
            if (newValue) {
                this.showAllMarker(false, newValue);
            } else {
                this.showAllMarker(true, '');
            }
        },
        elementColumn: {
            handler: function (newValue) {
                for (let key in this.markerList) {
                    let html = this.markerList[key].htmlContent();
                    this.markerList[key].setContent(html);
                }
            },
            deep: true
        },
        showUnit:{
            handler: function (newValue) {
                for (let key in this.markerList) {
                    let html = this.markerList[key].htmlContent();
                    this.markerList[key].setContent(html);
                }
            },
            deep: true
        },
        showMarkerIdList: {
            handler: function (newValue) {
                this.showMarkersByElementId()
            },
            deep: true
        },

    },
    created() {

    },
    mounted() {
        //定时任务30秒刷新一次
        this.refreshTask = setInterval(() => {
            this.getElements(this.sceneid); 
            this.refreshEcharts = !this.refreshEcharts
            /*
                // 之前逻辑
                this.getElements(this.sceneid); 
                this.refreshEcharts = !this.refreshEcharts
            */
        }, 30 * 1000);
    },
    destroyed() {
        window.clearInterval(this.refreshTask);
    }
}
</script>

<style scoped>
/deep/ .amap-logo {
    display: none !important;
}

/deep/ .amap-maps{
    /* border:solid 3px red; */
    /* background:black; */
}

/deep/ .amap-copyright {
    display: none !important;
}

/deep/ .amap-mcode {
    display: none !important;
}
</style>
<style>
    #mapContainer.modeInfo .markerTxt > div{
        color:black!important;
    }
</style>
