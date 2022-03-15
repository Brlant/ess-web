<style lang="scss" scoped>
@import "@/assets/scss/mixins";

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

.des-btn__position {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
}

.d-table > div.d-table-left {
    width: 180px;
    min-width: 180px;
}

.form-header-part.is-mini {
    .header {
        line-height: normal;
    }

    .top {
        display: flex;
        align-items: center;
    }

    .header-right {
        display: flex;
        align-items: center;
    }
}
</style>
<template>
    <div>
        <div class="d-table f-w" id="container-main">
            <div class="d-table-left" style="width: 10%;height: calc(100vh - 70px);box-sizing: border-box;">
                <h2 class="header"
                    style="height: 60px;margin: 0;padding: 0;display: flex;align-items: center;justify-content: center;">
                    静态场景列表</h2>
                <scene-element-selector style="box-sizing: border-box;height: calc(100vh - 140px);"
                                        :scene-type=2
                                        v-on:scene-element-change="handleSceneElementChange"
                                        v-on:scene-change="handleSceneChange"
                />
            </div>
            <div class="d-table-right" id="map-right" style="width: 88%">
                <div class="content-right">
                    <div class="form-header-part is-mini part-bg p-r-20">
                        <el-row class="top" style="height: 50px;box-sizing: border-box;">
                            <el-col :span="17">
                                <div class="header">
                                    <div class="sign f-dib index"></div>
                                    <div class="header-right">
                                        <h3 class="tit f-dib">
                                            {{ currentScene.scenesName }} / {{ currentElement.scenesElementName }}
                                        </h3>
                                        <div style="font-size: 14px; margin-left: 15px">
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                        <div class="content clearfix" ref="show-container">
                            <p-map ref="pmap"
                                   :point-name="showPointName"
                                   :text="showPointText"
                                   :tip="showPointInfo"
                                   @save="save"
                                   v-if="pointList && typeof pointList === 'object' && pointList.constructor === Array"
                                   x='longitude'
                                   y='latitude'
                                   :width="mapWidth"
                                   :height="mapHeight"
                                   :src="pointInfo.backgroundUrl"
                                   :icon-list="pointList"
                                   :scenes-id="scenesId"
                            >
                            </p-map>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TimeMixins from "@/mixins/timeMixin";
import SceneElementSelector from "@/components/common/SceneElementSelector";
import {
    CcsPoint,
    CcsPointDeviceInfo,
    MonitorPointLabel,
    MonitorPointText,
} from '../../../../resources';
import pMap from "@/components/common/icon-map";

export default {
    components: {SceneElementSelector, pMap},
    mixins: [TimeMixins],
    data: function () {
        return {
            //TODO 如果需要循环请示，打开此标志
            loop: false,
            debug: false, //使用测试数据
            currentScene: {},
            currentElement: {},
            // currentSceneElement: {},
            pager: {
                currentPage: 1,
                count: 0,
                pageSize:
                    parseInt(window.localStorage.getItem("currentPageSize"), 10) || 10,
            },

            pointList: null,
            pointInfo: [],//根据场景元素ID获取点位的设备信息
            PointColor: {},//图标颜色管理
            pointAllInfo: null,//根据场景ID返回的数据
            mapWidth: 0,
            mapHeight: 0,
            gotWh: true,
            editMode: false,
            scenesId: '',
        };
    },
    computed: {
        type() {
            const type = this.$route.meta.type;
            // console.log(type);
            // this.init(type);
            return type;
        },

    },
    watch: {
        isShowBigMap(val) {
            if (val) return;
            this.setScaling();
            this.tempList = [];
        },
        $route: function () {
            if (this.$route.name === "test-room") {
            } else if (this.$route.name === "test-store") {
            }
        },
        pointAllInfo: function (n) {
            this.pointAllInfo = n;
            this.handlehandleSceneElementChangeCallback();
        }
    },
    mounted() {
        this.gotWh = true;
        this.handlehandleSceneElementChangeCallback();
    },
    methods: {
        showPointInfo(p) {
            return MonitorPointLabel(p)
        },
        showPointText(p) {
            return MonitorPointText(p)
        },
        showPointName(p) {
            if (p.alarmFlag)
                return `<span style="color:red">${p.ccsPointName}</span>`;
            return p.ccsPointName;
        },
        extend(obj) {
            var o = {}, attr = Array.prototype.slice.call(arguments).slice(1);
            attr.forEach(function (val, index) {
                if (val in obj) {
                    o[val] = obj[val];
                }
            });
            return o;
        },
        save(data, divWidth, divHeight) {
            let t = [];
            for (let x in data) {
                t.push(this.extend(data[x], 'ccsPointId', 'longitude', 'latitude'));
            }

            t = t.map(item => {
                item.longitude = parseFloat(1000 / divWidth * item.longitude);
                item.latitude = parseFloat(600 / divHeight * item.latitude);
                return item;
            });
            console.log("====t===", t, divWidth, divHeight)


            this.$httpRequestOpera(CcsPoint.savePointXy(t), {
                successTitle: '更新成功',
                errorTitle: '更新失败',
                success: res => {
                    //this.editMode = false;
                    this.$refs['pmap'].quitEditMode();
                },
                error: () => {
                    // this.doing = false;
                }
            });
        },
        handlehandleSceneElementChangeCallback() {
            for (let x in this.pointAllInfo) {
                if (this.pointAllInfo[x].scenesElementId == this.currentElement.scenesElementId) {
                    this.pointInfo = this.pointAllInfo[x];

                    console.log('场景对象点位信息已找到', this.pointInfo);

                    if (this.pointInfo && this.pointInfo.points) {
                        this.pointList = this.pointInfo.points.map((item) => {
                            //TODO  根据点位标志设置状态，离线，停止
                            if (item.alarmFlag) {
                                item.icon = item.backgroundUrlEx;
                            } else {
                                item.icon = item.backgroundUrl;
                            }
                            return item;
                        });
                    }
                    this.scenesId = this.pointInfo.scenesId;
                    console.log(this.scenesId);
                    break;
                }
            }
        },

        handleSceneElementChange(e, s) {
            this.currentScene = s;
            this.currentElement = e;
            this.handlehandleSceneElementChangeCallback();
            return;
        },

        handleSceneChange(s) {
            let sid = s.id;
            CcsPointDeviceInfo.query(sid).then((res) => {
                this.pointAllInfo = res.data.data;
                this.handlehandleSceneElementChangeCallback();
                if (this.loop) {
                    //60s 刷新
                    setTimeout(() => {
                        this.handleSceneChange(this.currentScene);
                    }, 1000 * 60);
                }
            });
            return;
        },

        resetRightBox() {
            this.showIndex = -1;
        },

        refresh() {
            this.querysceneList();
            this.resetRightBox();
        },
    },
};
</script>
