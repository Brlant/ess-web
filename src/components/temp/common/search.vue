<style lang="scss" scoped>
.el-form::after {
    content: '';
    clear: both;
    display: table;
}
</style>
<template>
    <search-template :isShow="showSearch" :isShowAdvance="false" :midSpan="0" @isShow="isShow" @reset="reset"
                     @search="search">
        <template slot="title">查询</template>
        <template slot="btn">
            <slot name="btn"></slot>
        </template>
        <template slot="content">
            <el-form class="advanced-query-form" onsubmit="return false">
                <el-col :span="8">
                    <oms-form-row :span="8" label="设备编码devCode">
                        <oms-input @keyup.native.enter="search" placeholder="请输入设备编码devCode"
                                   v-model.trim="searchCondition.devCode"></oms-input>
                    </oms-form-row>
                </el-col>
                <el-col :span="8">
                    <oms-form-row :span="8" label="设备编号devNo">
                        <oms-input @keyup.native.enter="search" placeholder="请输入设备编号devNo"
                                   v-model.trim="searchCondition.devNo"></oms-input>
                    </oms-form-row>
                </el-col>
                <el-col :span="8">
                    <oms-form-row :span="4" label="名称">
                        <oms-input @keyup.native.enter="search" placeholder="请输入名称"
                                   v-model.trim="searchCondition.devName"></oms-input>
                    </oms-form-row>
                </el-col>
                <el-col :span="8" v-if="!type">
                    <oms-form-row :span="8" label="类型">
                        <el-select @change="search" placeholder="请选择设备类型" v-model="searchCondition.devType">
                            <el-option :key="key" :label="item" :value="key"
                                       v-for="(item, key) in tempTypeList"></el-option>
                        </el-select>
                    </oms-form-row>
                </el-col>
                <!--        <el-col :span="8" v-if="!type">-->
                <!--          <oms-form-row :span="8" label="状态">-->
                <!--            <el-select @change="search" clearable placeholder="请选择设备状态" v-model="searchCondition.status">-->
                <!--              <el-option :key="key" :label="item.title" :value="item.status"-->
                <!--                         v-for="(item, key) in statusType"></el-option>-->
                <!--            </el-select>-->
                <!--          </oms-form-row>-->
                <!--        </el-col>-->
            </el-form>
        </template>
    </search-template>
</template>
<script>
import utils from '@/tools/utils';

export default {
    props: {
        type: Number,
        tempTypeList: Array
    },
    data: function () {
        return {
            searchCondition: {
                devCode: null,
                devName: null,
                devType: null,
                status: null,
                devNo: null
            },
            showSearch: false,
            list: [],
            times: []
        };
    },
    computed: {
        statusType() {
            return utils[ 'wifiType' ];
        }
    },
    watch: {
        type() {
            this.searchCondition = {
                devCode: null,
                devName: null,
                devType: null,
                status: null,
                devNo: null
            };
        }
    },
    mounted() {
        let devCode = this.$route.query.devCode;
        if (!devCode) return;
        this.searchCondition.devCode = devCode;
        this.searchCondition.devNo = this.$route.query.devNo;
        this.search();
    },
    methods: {
        search() {
            this.$emit('search', this.searchCondition);
        },
        reset() {
            this.searchCondition = {
                devCode: null,
                devName: null,
                devType: null,
                status: null,
                devNo: null
            };
            this.$emit('search', this.searchCondition);
        },
        isShow(val) {
            this.showSearch = val;
        }
    }
};
</script>
