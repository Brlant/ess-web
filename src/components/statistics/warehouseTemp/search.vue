<template>
    <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
        <template slot="title">库内温度巡检</template>
        <template slot="btn">
            <slot name="btn"></slot>
        </template>
        <template slot="content">
            <el-form class="advanced-query-form" onsubmit="return false">
                <el-row>
                    <el-col :span="6">
                        <oms-form-row :span="6" label="任务名称">
                            <el-select :remote-method="queryName" @change="search"
                                       clearable filterable
                                       placeholder="请输入任务名称" popper-class="selects--custom" remote reserve-keyword
                                       v-model="searchCondition.devId">
                                <el-option :key="item.id" :label="item.devName" :value="item.id"
                                           v-for="(item, index) in taskNameList">
                                    <dev-option-info :item="item"/>
                                </el-option>
                            </el-select>
                        </oms-form-row>
                    </el-col>
                    <el-col :span="9">
                        <oms-form-row :span="6" label="添加时间">
                            <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini"
                                            placeholder="请选择" type="datetimerange" v-model="times"/>
                        </oms-form-row>
                    </el-col>
                    <el-col :span="9">
                        <oms-form-row :span="6" label="查询时间">
                            <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini"
                                            placeholder="请选择"
                                            type="datetimerange" v-model="times"/>
                        </oms-form-row>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <oms-form-row :span="6" label="状态">
                            <el-radio-group @change="search" size="small" v-model="searchCondition.recordType">
                                <el-radio-button :label="0">查询中</el-radio-button>
                                <el-radio-button :label="1">完成</el-radio-button>
                            </el-radio-group>
                        </oms-form-row>
                    </el-col>
                    <el-col :span="9">
                        <oms-form-row :span="6" label="任务状态">
                            <el-radio-group @change="search" size="small" v-model="searchCondition.sendStatus">
                                <el-radio-button label="1">普通任务</el-radio-button>
                                <el-radio-button label="0">自动任务</el-radio-button>
                            </el-radio-group>
                        </oms-form-row>
                    </el-col>
                </el-row>
            </el-form>
        </template>
    </search-template>
</template>
<script>
import methodsMixin from '@/mixins/methodsMixin';

export default {
    mixins: [methodsMixin],
    data: function () {
        return {
            searchCondition: {
                notifyBegin: '',
                notifyEnd: '',
                devName: '',
                recordType: '',
                notifyType: '',
                sendStatus: '',
                devId: ''
            },
            showSearch: false,
            taskNameList:[],
            times: [
                new Date() - 30 * 24 * 60 * 60 * 1000,
                new Date()
            ]
        };
    },
    methods: {
        search() {
            const parent = this.$parent;
            this.searchCondition.notifyBegin = parent.formatTimeAry(this.times, 0);
            this.searchCondition.notifyEnd = parent.formatTimeAry(this.times, 1);
            this.$emit('search', this.searchCondition);
        },
        reset() {
            this.searchCondition = {
                notifyBegin: '',
                notifyEnd: '',
                devName: '',
                recordType: '',
                notifyType: '',
                sendStatus: ''
            };
            this.times = [];
            this.$emit('search', this.searchCondition);
        },
        isShow(val) {
            this.showSearch = val;
        },
        queryName(val) {

        },
        exportSearchFile() {

        }
    }
};
</script>
