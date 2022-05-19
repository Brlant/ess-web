<template>
    <div class="order-page">
        <search-part @search="searchResult" @changeEcharts='changeEchartsFn'/>

        <div v-if="isEcharts">
    <!--        <chart-line :filters="filters" chartWidth="1200px" v-if="filters&&filters.length === 1"/>-->
            <chart-line-multiple :filters="filters" chartWidth="1200px"/>
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
    </div>
</template>
<script>
import SearchPart from './search';
import ChartLine from './chart-line-new';
import ChartLineMultiple from './chart-line-new-multiple-dev';

export default {
    components: {
        SearchPart, ChartLine, ChartLineMultiple
    },
    data() {
        return {
            filters: [],
            isEcharts : true,
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
