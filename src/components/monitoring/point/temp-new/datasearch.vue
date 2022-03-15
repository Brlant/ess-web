<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="查询历史数据" name="first">
                <searchData  v-if='activeName === "first"' />
            </el-tab-pane>
            <el-tab-pane label="查询点位历史数据" name="second" >
                <historyData  v-if='activeName === "second"' />
            </el-tab-pane>
            <el-tab-pane label="查询交接数据" name="third">
                <joinData v-if="activeName === 'third'"/>
            </el-tab-pane>
            <el-tab-pane label="导出历史数据" name="four">
                <outputHistoryData />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

    import searchData from '@/components/monitoring/temp-new/index.vue' ; // 查询点位历史数据
    import historyData from './index.vue' ; // 查询点位历史数据
    import joinData from '@/components/monitoring/handover-data/index.vue' ; // 查询交接数据
    import outputHistoryData from '@/components/monitoring/export/index.vue' ;  // 导出历史数据

    export default {
        name : 'datasearch',
        data(){
            return {
                title : 'datasearch title',
                activeName: ''
            }
        },
        methods : {
            handleClick(tab, event) {
                // console.error(tab, event);
            }
        },
        mounted(){
            if( this.$route.query && this.$route.query.isHistory || this.$route.query.id ){
                this.activeName = 'first' ;
            } else if( this.$route.query && this.$route.query.pointId ){
                this.activeName = 'second' ;
            } else {
                this.activeName = 'first' ;
            }
        },
        components : { searchData, historyData, joinData, outputHistoryData }
    } ;

</script>

<style scoped>

</style>
