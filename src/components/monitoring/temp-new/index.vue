<template>
  <div class="order-page">
    <search-part @search="searchResult" @changeEcharts='changeEchartsFn'/>
    <!--
        之前逻辑 
        <chart-line :filters="filters" chartWidth="1200px" v-if="filters.length === 1"/>
        <chart-line-multiple :filters="filters" chartWidth="1200px" v-else/> 
    -->
    <!-- <chart-line-multiple :filters="filters" chartWidth="1200px" /> -->
    
    <div v-if="isEcharts">
        <chart-line :filters="filters" chartWidth="1200px" v-if="filters.length === 1"/>
        <chart-line-multiple :filters="filters" v-else chartWidth="1200px" />
    </div>
    <div v-else>
        <el-table
        :data="dataList"
        >
        <el-table-column
            prop="date"
            label="时间"
            width="180">
        </el-table-column>
        <el-table-column
            prop="x"
            label="x"
            width="180">
        </el-table-column>
        <el-table-column
            prop="y"
            label="y">
        </el-table-column>
        </el-table>
    </div>
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
            searchResult: function (search) {
                this.filters = JSON.parse(JSON.stringify(search));
            }, 
            changeEchartsFn( v ){
                this.isEcharts = v ;
            }
        }
    };
</script>
