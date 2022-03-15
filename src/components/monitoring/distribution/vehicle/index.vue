<style scoped lang="scss">
  /*.map-path {*/
  /*margin-bottom: 10px;*/
  /*}*/
  /*h3 {*/
  /*padding-left: 10px;*/
  /*}*/
  .vehicleMap {
    position: absolute;
    left: 0;
    right: 0;
      .refresh-btn {
          position: absolute;
          right: 10px;
          top: 10px;
          padding: 4px;
          background: #fff;
          border-radius: 4px;
          border: 1px solid #eee;
      }
  }
</style>
<template>
  <div>
    <!--<h3 v-show="vid==='vehicleMap'">-->
    <!--<span @click="showBigMap(vhList, tempDataList)" class="des-btn">-->
    <!--<a href="#" class="btn-circle" @click.prevent="">-->
    <!--<i class="el-icon-zoom-in"></i></a>查看大图-->
    <!--</span>-->
    <!--</h3>-->
    <div class="vehicleMap">
      <div class="empty-info mini" v-show="!points.length">暂无车辆信息</div>
      <el-amap :amap-manager="amapManager"  :style="mapStyle" :zoom="10"
               class="map-path" ref="pathMap" v-show="points.length" vid="vehicleMap">
      </el-amap>
        <div class="refresh-btn">
            <el-checkbox v-model="isRefresh">开启刷新</el-checkbox>
        </div>
    </div>
  </div>
</template>
<script>
    import {AMapManager} from 'vue-amap';
    import iconFont from '@/assets/fonts/iconfont';
    import MapMixin from '@/mixins/mapMixin';

    window.$mapInit();
    export default {
        data() {
            return {
                amapManager: new AMapManager(),
                pathSimplifierIns: null,
                points: [],
                mapStyle: {
                    height: '100%'
                },
                closeIconAry: [],
                isFitView: false,
                isRefresh: false
            };
        },
        mixins: [MapMixin],
        computed: {
            bodyHeight: function () {
                return parseInt(this.$store.state.bodyHeight, 10);
            }
        },
        watch: {
            bodyHeight: {
                handler(val) {
                    this.mapStyle.height = (val + 70) + 'px';
                },
                immediate: true
            }
        },
        mounted() {
            this.queryPath();
            this.addMapTools();
            this.loopSearch();
        },
        methods: {
            queryPath() {
                this.$http.get('/location-data/car-info').then(res => {
                    this.points = res.data.filter(f => f.latitude && f.longitude);
                    // 清楚所有覆盖物
                    if (this.amapManager._map) {
                        !this.isFitView && this.amapManager._map.setFeatures(['road', 'point']);
                        this.amapManager._map.clearMap();
                    }
                    this.points.forEach(i => this.drawPoint(i));
                    !this.isFitView && setTimeout(() => {
                        this.amapManager._map.setFitView();
                        this.isFitView = true;
                    }, 300);

                });
            },
            loopSearch() {
              if(this.isRefresh) {
                if (this.$route.path.includes('/vehicle/distribution')) {
                  this.queryPath();
                }
              }
              // 30s刷新数据
              setTimeout(() => {
                this.loopSearch();
              }, 3000);
            },
            drawPoint(i) {
                window.$lazyAMapApiLoaderInstance().then(() => {
                    if (!window.AMapUI) {
                        this.drawPoint(i);
                        return;
                    }
                    window.AMapUI.loadUI(['overlay/SvgMarker'], SvgMarker => {
                        const shape = new SvgMarker.Shape.IconFont({
                            // 参见 symbol引用, http://www.iconfont.cn/plus/help/detail?helptype=code
                            symbolJs: iconFont,
                            icon: 'el-icon-t-lengcangche',
                            size: 40,
                            offset: [-20, -20],
                            fillColor: 'black'
                        });

                        const marker = new SvgMarker(
                            //第一个参数传入shape实例
                            shape,
                            //第二个参数为SimpleMarker的构造参数（iconStyle除外）
                            {
                                // showPositionPoint: true, //显示定位点
                                map: this.amapManager._map,
                                position: [i.longitude, i.latitude],
                                label: {
                                    content: this.formatLabel(i),
                                    offset: new window.AMap.Pixel(45, -40)
                                }
                            }
                        );
                        // marker.setAnimation('AMAP_ANIMATION_BOUNCE');
                        window.AMap.event.addListener(marker, 'click', () => {
                            let title = this.$el.querySelector('#' + i.carNumber);
                            if (!title) return;
                            title.parentNode.style.display = 'block';
                            // marker.setAnimation('');
                        });

                      this.amapManager._map.setFitView();
                    });
                });
            },
            formatTempLevel(temp) {
                if (!temp) return '';
                if (temp > 8 || temp < 2) return 'front-icon--error';
                return 'front-icon--' + parseInt(temp, 10);
            },
            formatLabel(i) {
                //  <i class="el-icon-close"></i>
                let title = `<div class="item title" id="${i.carNumber}">${i.carNumber}</div>`;
                let temp = i.devDtoList.map((t, index) => {
                    // t.temperature = index + 4.5;
                    return `<div class="item"><div class="front-icon ${this.formatTempLevel(t.temperature)}"></div>
                  ${t.name}:<span>${t.temperature ? t.temperature + '℃' : '无数据'}</span></div>`;
                }).join('');
                let time = `<div class="item">${this.$moment(i.time).format('YYYY-MM-DD HH:mm')}</div>`;
                return `<div class="arraw"></div>${title}${temp}${time}`;
            },
            closeEvent() {
                this.closeIconAry = this.$el.querySelectorAll('.el-icon-close');
                if (this.closeIconAry.length !== this.points.length) {
                    setTimeout(this.closeEvent, 100);
                    return;
                }
                this.closeIconAry.forEach(i => {
                    i.addEventListener('click', () => {
                        i.parentNode.parentNode.style.display = 'none';
                    });
                });
            }
        }
    };
</script>
