<template>
    <div class="order-page">
        <search-part @search="searchResult"/>
<!--        <chart-line :filters="filters" chartWidth="1200px" v-if="filters&&filters.length === 1"/>-->
        <chart-line-multiple :filters="filters" chartWidth="1200px"/>
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
            filters: []
        };
    },
    methods: {
        searchResult: function (search) {
            this.filters = JSON.parse(JSON.stringify(search));
        }
    }
};
</script>
