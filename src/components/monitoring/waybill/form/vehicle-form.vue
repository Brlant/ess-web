<template>
  <div>
    <div :key="index" v-for="(vh, index) in vhList">
      <h2>车牌号:{{vh.monitordevCode}}</h2>

      <div class="order-list clearfix" style="padding-top: 10px">
        <el-row class="order-list-header">
          <el-col :span="5">名称</el-col>
          <el-col :span="5">编码</el-col>
          <el-col :span="5">设备编号</el-col>
          <el-col :span="5">类型</el-col>
          <el-col :span="4" v-show="!devInfo.arriveTime">最新数据</el-col>
        </el-row>
        <div class="empty-info" v-if="!vh.devs.length">暂无数据</div>
        <div class="order-list-body flex-list-dom" v-else>
          <div :key="index" class="order-list-item no-pointer order-list-item-bg"
               v-for="(item, index) in vh.devs">
            <el-row>
              <el-col :span="5">{{item.relationName}}</el-col>
              <el-col :span="5">{{item.devCode}}</el-col>
              <el-col :span="5">{{item.devNo}}</el-col>
              <el-col :span="5">{{tempTypeList[item.devType]}}</el-col>
              <el-col :span="4" v-show="!devInfo.arriveTime">
                <el-tooltip :content="showRecordDate(item.recordDate)" effect="dark" placement="top">
                  <span>{{$formatDevData(item, $formatDevType(item))}}</span>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        props: ['plateNumbers', 'queryVhDevInfo', 'devInfo', 'setVhList', 'carDevList'],
        data() {
            return {
                vhList: [],
                tempTypeList: ['有线温度计', '无线温度计', '冷柜温度计', '车载温度计', '湿度计']
            };
        },
        watch: {
          carDevList: {
                handler(val) {
                    this.queryVhInfoList(val);
                },
                immediate: true
            }
        },
        methods: {
            showRecordDate: function (data) {
                return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
            },
            queryVhInfoList() {
                this.vhList = [];
                if (!this.plateNumbers) return;
                this.plateNumbers.forEach(i => {
                    let dev = {
                        monitordevCode: i,
                        devs: this.carDevList || []
                    };
                    this.vhList.push(dev);
                    this.setVhList(this.vhList);
                    this.vhList.forEach(i => {
                        this.queryVhDevInfo(i.devs);
                    });
                });
            }
        }
    };
</script>
