<style lang="scss" scoped="">

.R {
    word-wrap: break-word;
    word-break: break-all;
}

.good-selects {
    .el-select-dropdown__item {
        height: auto;
        width: 300px;
    }
}

.align-word {
    letter-spacing: 1em;
    margin-right: -1em;
}

.order-list-item {
    cursor: pointer;
}

.good-selects {
    .el-select-dropdown__item {
        width: auto;
    }
}

.header-list {
    overflow: hidden;
}
</style>
<template>
    <div class="order-page">
        <div class="container">
            <div :class="{up:!showSearch}" class="opera-btn-group">
                <div class="opera-icon">
                    <!--<span class="">-->
                    <!--<i class="el-icon-t-search"></i> 筛选查询-->
                    <!--</span>-->
                    <span @click="showSearch = !showSearch" class="pull-left switching-icon">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
                </div>
                <el-form class="advanced-query-form" onsubmit="return false">
                    <el-row>
                        <el-col :span="8">
                            <oms-form-row :span="6" label="日志操作人">
                                <el-select :clearable="true" :remote-method="filterUser" filterable
                                           placeholder="请输入名称/拼音首字母缩写搜索"
                                           popperClass="good-selects"
                                           remote v-model="searchWord.operatorId">
                                    <el-option :key="user.id" :label="user.name" :value="user.id"
                                               v-for="user in userList">
                                        <div style="overflow: hidden">
                                            <span class="pull-left" style="clear: right">{{ user.name }}</span>
                                            <span class="pull-right">
                        {{ user.companyDepartmentName }}
                      </span>
                                            <div class="font-gray clearfix">所属单位：{{ user.orgName }}</div>
                                        </div>
                                    </el-option>
                                </el-select>
                            </oms-form-row>
                        </el-col>
                        <el-col :span="8">
                            <oms-form-row :span="7" label="日志操作时间">
                                <el-col :span="24">
                                    <el-date-picker :default-time="['00:00:00', '23:59:59']" placeholder="请选择"
                                                    type="datetimerange"
                                                    v-model="expectedTime"></el-date-picker>
                                </el-col>
                            </oms-form-row>
                        </el-col>
                        <el-col :span="8">
                            <oms-form-row :span="6" label="操作类型">
                                <oms-input placeholder="请输入操作类型" v-model="searchWord.actionType"/>
                            </oms-form-row>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <oms-form-row :span="6" label="URL">
                                <oms-input placeholder="请输入URL" v-model="searchWord.url"/>
                            </oms-form-row>
                        </el-col>
                        <el-col :span="8">
                            <oms-form-row :span="6" label="请求body">
                                <oms-input placeholder="请输入请求body" v-model="searchWord.body"/>
                            </oms-form-row>
                        </el-col>
                        <el-col :span="8">
                            <oms-form-row :span="6" label="响应">
                                <oms-input placeholder="请输入response" v-model="searchWord.response"/>
                            </oms-form-row>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <oms-form-row :span="6" label="sessionId">
                                <oms-input placeholder="请输入sessionId" v-model="searchWord.sessionId"/>
                            </oms-form-row>
                        </el-col>
                        <el-col :span="8">
                            <oms-form-row :span="6" label="IP">
                                <oms-input placeholder="请输入IP" v-model="searchWord.ip"/>
                            </oms-form-row>
                        </el-col>
                        <el-col :span="8">
                            <oms-form-row :span="5" label="">
                                <el-button @click="searchInOrder" native-type="submit" type="primary">查询</el-button>
                                <el-button @click="resetSearchForm" native-type="reset">重置</el-button>
                                <el-button @click="exportExcel">导出Excel</el-button>
                            </oms-form-row>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <el-table :data="logList" :header-row-class-name="'headerClass'" @row-click="showDetail" border
                      class="clearfix"
                      ref="orderDetail" v-loading="loadingData">
                <el-table-column label="日志操作时间" prop="operationTime"
                                 width="110">
                    <template slot-scope="scope">
                        {{ scope.row.operationTime | time }}
                    </template>
                </el-table-column>
                <el-table-column label="日志操作人" prop="userName" width="120"></el-table-column>
                <el-table-column label="所属单位" prop="orgName" width="120"></el-table-column>
                <el-table-column label="日志操作类型" prop="actionType" width="180">
                    <template slot-scope="scope">
                        {{ showActionType(scope.row.actionType) }}
                    </template>
                </el-table-column>
                <el-table-column label="URL" min-width="120" prop="logRemarks">

                </el-table-column>
                <el-table-column label="请求body" prop="body" width="300">

                </el-table-column>
                <el-table-column label="响应内容" prop="body" width="350">
                    <div slot-scope="scope" style="max-height: 150px;overflow-y: auto">
                        {{ scope.row.response }}
                    </div>
                </el-table-column>
                <el-table-column label="sessionId" prop="sessionId" width="250"></el-table-column>
                <el-table-column label="IP" prop="ip" width="150"></el-table-column>
            </el-table>
            <div class="text-center" v-show="(logList.length || pager.currentPage !== 1) && !loadingData">
                <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                               :page-sizes="[10,20,50,100]"
                               :total="pager.count" @current-change="handleCurrentChange"
                               @size-change="handleSizeChange"
                               layout="sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
        </div>

        <!--<page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1100px','padding':0}">-->
        <!--<detail :currentItem="currentItem" @close="resetRightBox"></detail>-->
        <!--</page-right>-->
    </div>
</template>
<script>
import {BaseInfo, User} from '@/resources';
//  import detail from './detail.vue';
import {http} from '@/resources';
import utils from '@/tools/utils';

export default {
//    components: {detail},
    data() {
        return {
            loadingData: true,
            showSearch: true,
            logList: [],
            filters: {
                operatorId: '',
                startTime: '',
                endTime: '',
                actionType: ''
            },
            searchWord: {
                operatorId: '',
                startTime: '',
                endTime: '',
                actionType: ''
            },
            pager: {
                currentPage: 1,
                count: 0,
                pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
            },
            expectedTime: '',
            userList: []
        };
    },
    mounted() {
        this.getLogPager(1);
    },
    computed: {},
    watch: {
        // filters: {
        //   handler: function () {
        //     this.getLogPager(1);
        //   },
        //   deep: true
        // },
        $route() {
            this.resetSearchForm();
            this.getLogPager(1);
        }
    },
    methods: {
        showActionType: function (item) {
            if (item === 'login') {
                item = '登录';
            }
            return item;
        },
        filterUser: function (query) {
            let data = Object.assign({}, {
                pageNo: 1,
                pageSize: 20,
                objectId: 'css-system',
                keyWord: query,
                status: 1
            });
            User.query(data).then(res => {
                this.userList = res.data.list;
            });
        },
        handleSizeChange(val) {
            this.pager.pageSize = val;
            window.localStorage.setItem('currentPageSize', val);
            this.getLogPager(1);
        },
        handleCurrentChange(val) {
            this.getLogPager(val);
        },
        filterCustomer: function (query) {// 过滤客户
            BaseInfo.query({keyWord: query, type: 0}).then(res => {
                this.customerList = res.data.list;
            });
        },
        getLogPager: function (pageNo) { // 得到日志列表
            this.pager.currentPage = pageNo;
            let param = Object.assign({}, {
                pageNo: pageNo,
                pageSize: this.pager.pageSize,
            }, this.filters);
            if (this.$route.meta.systemName) {
                param.systemName = this.$route.meta.systemName;
            }
            this.loadingData = true;
            this.$http.get('/system-log', {params: param}).then(res => {
                this.logList = res.data.list;
                this.pager.count = res.data.count;
                this.loadingData = false;
            });
        },
        showDetail(item) {
            this.currentItemId = item.id;
            this.currentItem = item;
            this.showDetailPart = true;
        },
        resetRightBox() {
            this.showDetailPart = false;
        },
        searchInOrder: function () {// 搜索
            this.searchWord.startTime = this.$formatAryTime(this.expectedTime, 0, 'YYYY-MM-DD HH:mm:ss');
            this.searchWord.endTime = this.$formatAryTime(this.expectedTime, 1, 'YYYY-MM-DD HH:mm:ss');
            Object.assign(this.filters, this.searchWord);
            this.getLogPager(1);
        },
        resetSearchForm: function () {// 重置表单
            this.searchWord = {
                operatorId: '',
                startTime: '',
                endTime: '',
                actionType: ''
            };
            this.expectedTime = '';
            this.filters = Object.assign({}, this.searchWord);
            this.getLogPager(1);
        },

        // 导出Excel
        exportExcel() {
          if(!this.expectedTime) return this.$message.warning("请先选择日志操作时间！")
          this.$store.commit('initPrint', {isPrinting: true,text: '正在导出'});
          this.searchWord.startTime = this.$formatAryTime(this.expectedTime, 0, 'YYYY-MM-DD HH:mm:ss');
          this.searchWord.endTime = this.$formatAryTime(this.expectedTime, 1, 'YYYY-MM-DD HH:mm:ss');
          let data = Object.assign(this.filters, this.searchWord);
          http.post('/ccsLog/exportLog', data, {timeout: 0}).then(res => {
            utils.download(res.data.path, '系统日志');
            this.$store.commit('initPrint', {isPrinting: false});

          }).catch(error => {
            this.$store.commit('initPrint', {isPrinting: false});
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '导出失败'
            });
          });
        },

        formatTime(date) {
            return date ? this.$moment(date).format('YYYY-MM-DD') : '';
        }
    }
};
</script>
