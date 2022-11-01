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
                            <el-input v-model="searchCondition.taskName"></el-input>
                        </oms-form-row>
                    </el-col>
                    <el-col :span="9">
                        <oms-form-row :span="6" label="添加时间">
                            <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini"
                                            placeholder="请选择" type="datetimerange" v-model="addTimes"/>
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
                            <el-radio-group @change="search" size="small" v-model="searchCondition.taskStatus">
                                <el-radio-button :label="1">查询中</el-radio-button>
                                <el-radio-button :label="2">完成</el-radio-button>
                            </el-radio-group>
                        </oms-form-row>
                    </el-col>
                    <el-col :span="9">
                        <oms-form-row :span="6" label="任务状态">
                            <el-radio-group @change="search" size="small" v-model="searchCondition.taskType">
                                <el-radio-button label="2">普通任务</el-radio-button>
                                <el-radio-button label="1">自动任务</el-radio-button>
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
                taskStatus: '',
                taskType: '',
                startCreateTime: '',
                endCreateTime: '',
                startQueryTime: '',
                endQueryTime: '',
                taskName: ''
            },
            showSearch: false,
            times: [],
            addTimes: [],
        };
    },
    methods: {
        search() {
            const parent = this.$parent;
            this.searchCondition.startQueryTime = parent.formatTimeAry(this.times, 0);
            this.searchCondition.endQueryTime = parent.formatTimeAry(this.times, 1);
            this.searchCondition.startCreateTime = parent.formatTimeAry(this.addTimes, 0);
            this.searchCondition.endCreateTime = parent.formatTimeAry(this.addTimes, 1);
            this.$emit('search', this.searchCondition);
        },
        reset() {
            this.searchCondition = {
                taskStatus: '',
                taskType: '',
                startCreateTime: '',
                endCreateTime: '',
                startQueryTime: '',
                endQueryTime: '',
                taskName: ''
            };
            this.times = [];
            this.addTimes=[];
            this.$emit('search', this.searchCondition);
        },
        isShow(val) {
            this.showSearch = val;
        },
    }
};
</script>
