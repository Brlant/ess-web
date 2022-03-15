<template>
    <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search" >
        <template slot="title">设备监控查询</template>
        <template slot="btn">
            <slot name="btn">
                <el-button @click="exportData" plain size="small" >
                    <f-a class="icon-small" name="export"></f-a>
                    导出数据
                </el-button>
            </slot>
        </template>
        <template slot="content">
            <el-form class="advanced-query-form" onsubmit="return false">
                <el-row>
                    <el-col :span="10">
                        <oms-form-row :span="5" label="点位名称">
                            <el-select :remote-method="queryPointList"
                                       @click.once.native="queryPointList('')"
                                       clearable filterable placeholder="请选择点位名称" remote
                                       v-model="searchCondition.pointId">
                                <el-option :key="item.id" :label="item.pointName" :value="item.id"
                                           v-for="item in pointList"></el-option>
                            </el-select>
                        </oms-form-row>
                    </el-col>
                    <!--<el-col :span="5">
                      <oms-form-row :span="8" label="类型">
                        &lt;!&ndash;<el-select filterable remote placeholder="请选择类型" :clearable="true"&ndash;&gt;
                        &lt;!&ndash;v-model="searchCondition.monitordevType" @change="search">&ndash;&gt;
                        &lt;!&ndash;<el-option :label="item.title" :value="item.id" :key="item.id" v-for="item in typeList"></el-option>&ndash;&gt;
                        &lt;!&ndash;</el-select>&ndash;&gt;
                        <el-radio-group @change="search" size="small" v-model="searchCondition.monitordevType">
                          <el-radio-button :key="item.id" :label="item.id" v-for="item in typeList">{{item.title}}
                          </el-radio-button>
                        </el-radio-group>
                      </oms-form-row>
                    </el-col>
                    <el-col :span="5">
                      <oms-form-row :span="8" label="监控状态">
                        <el-radio-group @change="search" size="small" v-model="searchCondition.monitorFlag">
                          <el-radio-button label="1">激活</el-radio-button>
                          <el-radio-button label="0">未激活</el-radio-button>
                        </el-radio-group>
                      </oms-form-row>
                    </el-col>-->
                    <!--<el-col :span="6">-->
                    <!--<oms-form-row label="告警状态" :span="8">-->
                    <!--<el-radio-group v-model="searchCondition.warnStatus" size="small" @change="search">-->
                    <!--<el-radio-button label="0">正常</el-radio-button>-->
                    <!--<el-radio-button label="1">告警</el-radio-button>-->
                    <!--</el-radio-group>-->
                    <!--</oms-form-row>-->
                    <!--</el-col>-->
                </el-row>
            </el-form>
        </template>
    </search-template>
</template>
<script>
import {http, Point} from "@/resources";
import utils from "@/tools/utils";

export default {
    data: function () {
        return {
            searchCondition: {
                pointId: ''
            },
            showSearch: false,
            typeList: this.$parent.typeList,
            pointList: [],
            times: []
        };
    },
    mounted() {
        this.initSearchParams();
    },
    methods: {
        queryPointList: function (query) {// 查询货主
            let params = {type: '0', deleteFlag: '0'};
            if (typeof query === 'string') {
                Object.assign(params, {keyWord: query});
            } else if (typeof query === 'object') {
                Object.assign(params, query);
            }
            Point.queryPager(params).then(res => {
                this.pointList = res.data.list;
            });
        },
        initSearchParams() {
            let query = this.$route.query;
            if (!query.code) return;
            this.searchCondition.pointId = query.code;
            this.search();
        },
        search() {
            this.$emit('search', this.searchCondition);
        },
        reset() {
            this.searchCondition = {
                pointId: ''
            };
            this.$emit('search', this.searchCondition);
        },
        isShow(val) {
            this.showSearch = val;
        },
        exportData(){
            this.$store.commit('initPrint', {
                isPrinting: true,
                moduleId: '/monitoring/point-dev-history/id',
                text: '正在导出'
            });
            let params = Object.assign({}, this.searchCondition);
            params.status=this.$parent.filters.status;
            http.get('/ccs-point-relation/export', {params}).then(res => {
                utils.download(res.data.path, '点位设备绑定记录');
                this.$store.commit('initPrint', {
                    isPrinting: false,
                    moduleId: '/monitoring/point-dev-history/id'
                });

            }).catch(error => {
                this.$store.commit('initPrint', {
                    isPrinting: false,
                    moduleId: '/monitoring/point-dev-history/id'
                });
                this.$notify.error({
                    message: error.response && error.response.data && error.response.data.msg || '导出失败'
                });
            });

        }

    }
};
</script>
