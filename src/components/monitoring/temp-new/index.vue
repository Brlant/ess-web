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
                filters: [],
                tempInfo: {}
            };
        },
        methods: {
            searchResult: function (search) {
                this.filters = JSON.parse(JSON.stringify(search));
            }
        }
    };
</script>
