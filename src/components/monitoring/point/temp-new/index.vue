<template>
    <div class="order-page">
        <search-part @search="searchResult"/>

        <div v-if="isEcharts">
    <!--        <chart-line :filters="filters" chartWidth="1200px" v-if="filters&&filters.length === 1"/>-->
            <chart-line-multiple :filters="filters" chartWidth="1200px"/>
        </div>

        <div v-else>
            <el-table
                :data="dataList"
                v-loading="dataListLoading"
            >
                <el-table-column
                prop="collectionTime"
                label="时间"
                width="180"
            >
                <template slot-scope="{ row }">
                    {{ row.collectionTime }}
                </template>
            </el-table-column>
            <el-table-column
                label="x"
                width="180"
            >
                <template slot-scope="{ row }">
                    {{ row.propValueMap.pointX }}
                </template>
            </el-table-column>
            <el-table-column
                label="y"
            >
                <template slot-scope="{ row }">
                    {{ row.propValueMap.pointY }}
                </template>
            </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import SearchPart from './search';
import ChartLine from './chart-line-new';
import ChartLineMultiple from './chart-line-new-multiple-dev';
import {Point} from '@/resources';

export default {
    components: {
        SearchPart, ChartLine, ChartLineMultiple
    },
    data() {
        return {
            filters: [],
            isEcharts : true,
            dataListLoading : false,
            dataList : []
        };
    },
    methods: {
        searchResult: function (search, isEcharts) {
            this.filters = JSON.parse(JSON.stringify(search));

            this.isEcharts = isEcharts ;
                
            if( !this.isEcharts ){ // 如果为坐标
                
                if( this.filters.length ){
                    const {startTime, endTime, devId, devCode,  startPrice} = this.filters[0];
                    this.dataListLoading = true ;

                    Point.gainPointThingDataList(  { ...this.filters[0] } )
                    .then( d => {
                        let { data } = d ;

                        this.dataListLoading = false ;

                        if( data ){
                            this.dataList = data || [] ;
                        }
                    } )
                    .catch( err => {
                        this.dataListLoading = false ;
                        console.error( err ) ;
                    } ) ;
                }
            } else {
                this.dataList  = [] ;
            }
        },
        changeEchartsFn( v ){
            this.isEcharts = v ;
        }
    }
};
</script>
