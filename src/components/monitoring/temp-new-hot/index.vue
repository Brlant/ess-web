<template>
  <div class="order-page">
    <search-part @search="searchResult"/>
    <!--
        之前逻辑 
        <chart-line :filters="filters" chartWidth="1200px" v-if="filters.length === 1"/>
        <chart-line-multiple :filters="filters" chartWidth="1200px" v-else/> 
    -->
    <!-- <chart-line-multiple :filters="filters" chartWidth="1200px" /> -->
    
    <chart-line :filters="filters" chartWidth="1200px" v-if="filters.length === 1"/>
    <chart-line-multiple :filters="filters" v-else chartWidth="1200px" />

    <!-- <div class="order-list" v-else>
        <el-row class="order-list-header">
            <el-col :span="5">时间</el-col>
            <el-col :span="5">x</el-col>
            <el-col :span="5">y</el-col>
        </el-row>
        <div class="order-list-body ">
            <div class="order-list-item" v-for="(item,index) in dataList" :key="index">
                <el-row>
                    <el-col :span="5">{{item.date}}</el-col>
                    <el-col :span="5">{{item.x}}</el-col>
                    <el-col :span="5">{{item.y}}</el-col>
                </el-row>
            </div>
        </div>
    </div> -->

  </div>
</template>
<script>
    import SearchPart from './search';
    import ChartLine from './chart-line-new-copy';
    import ChartLineMultiple from './chart-line-new-multiple-dev';

     import {TempDev} from '@/resources';
     

    export default {
        components: {
            SearchPart, ChartLine, ChartLineMultiple
        },
        data() {
            return {
                loadingData: false,
                isEcharts : true, // 是否是 echarts     true : echarts图表      false : 表格数据
                filters: [],
                tempInfo: {},
                dataListLoading : false,
                dataList : [
                    // {
                    //     date : '2022.05.15',
                    //     x : 10,
                    //     y : 20
                    // },
                    // {
                    //     date : '2022.05.15',
                    //     x : 3,
                    //     y : 12
                    // },
                ]
            };
        },
        methods: {
            searchResult: function (search, isEcharts) {
                this.filters = JSON.parse(JSON.stringify(search)) ;
                console.error( 11, search, isEcharts ) ;  

                this.isEcharts = isEcharts ;
                
                if( !this.isEcharts ){ // 如果为坐标
                    
                    if( this.filters.length ){
                        const {startTime, endTime, devId, devCode,  startPrice} = this.filters[0];
                        this.dataListLoading = true ;

                        TempDev.gainDeviceThingDataList(  { ...this.filters[0] } )
                        .then( d => {
                            let { data } = d ;

                            this.dataListLoading = false ;

                            if( data ){
                                this.dataList = data.thingDataList || [] ;
                            }
                            // console.error( '坐标数据: ', d ) ;
                        } )
                        .catch( err => {
                            this.dataListLoading = false ;
                            console.error( err ) ;
                        } ) ;
                    }
                } else {
                    this.dataList  = [] ;
                }

            }
           
        }
    };
</script>
