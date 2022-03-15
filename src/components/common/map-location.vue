<style scoped>
  .amap {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
  }

  .search-box {
    position: absolute;
    top: 25px;
    left: 20px;
  }

  .amap-container {
    position: relative;
  }
</style>
<template>
  <div class="amap-container">
    <el-amap-search-box :on-search-result="onSearchResult" :search-option="searchOption" class="search-box"
                        ref="elMapSearch"></el-amap-search-box>
    <el-amap :center="mapCenter" :zoom="zoom" class="amap" vid="a-map">
      <el-amap-marker :draggable="true" :events="{dragend}" :key="index" :position="marker"
                      v-for="(marker, index) in markers"></el-amap-marker>
    </el-amap>
  </div>
</template>

<script>
    window.$mapInit();
    export default {
        props: {
            location: String
        },
        data: function () {
            return {
                markers: [],
                searchOption: {
                    city: '',
                    citylimit: true
                },
                mapCenter: [121.5273285, 31.21515044],
                zoom: 12
            };
        },
        watch: {
            location(val) {
                this.searchOption.city = val;
            }
        },
        methods: {
            onSearchResult(pois) {
                this.markers = [];
                if (pois.length > 0) {
                    this.$nextTick(() => {
                        this.markers.push([pois[0].lng, pois[0].lat]);
                        this.mapCenter = [pois[0].lng, pois[0].lat];
                        this.zoom = 18;
                        this.setAddress(pois);
                    });
                }
            },
            setAddress(pois) {
                this.$emit('changeAddress', pois);
            },
            
            dragend(e) {
                this.setAddress([{
                    lng: e.lnglat.lng,
                    lat: e.lnglat.lat
                }]);
            },
            getLgtAndLat(query, callBack) {
                const AMap = window.AMap;

                if( AMap ){
                    const myGeo = new AMap.Geocoder({
                        city: this.location
                    });
                    let that = this;
                    myGeo.getLocation(query, function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            callBack(result);
                        } else {
                            that.$notify.info({
                                message: '您选择的地址没有解析到结果!'
                            });
                        }
                    });
                }
            }
        }
    };
</script>
