<template>
    <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <div class="form-header-part">
            <div class="content  mt-10">
                <el-form-item label-width="0">
                <el-table :data="ruleList" @expand-change="expandChange"
                            class="el-table--expand"
                            header-row-class-name="table-header-color" style="width: 100%;" v-loading="loading">
                    <el-table-column type="expand">
                    <template slot-scope="props1">
                        <rule-util :props1="props1"></rule-util>
                    </template>
                    </el-table-column>
                    <el-table-column label="设备名称" min-width="110" prop="devName"/>
                    <el-table-column label="设备编码" prop="devCode"/>
                    <el-table-column label="告警规则组" prop="warnRuleGroupName"/>
                    <el-table-column label="通知列表" prop="notifyListName"/>
                    <!-- <el-table-column label="操作" width="90">
                    <template slot-scope="scope">
                        <des-btn @click="deleteRule(scope.row)" icon="delete" v-has="'show'">删除</des-btn>
                    </template>
                    </el-table-column> -->
                </el-table>
                </el-form-item>
            </div>
        </div>
    </el-form>
</template>
<script>
    import {AlarmRuleGroup, BindRule, DevMonitoring, NotifyRule} from '@/resources';
    import methodsMixin from '@/mixins/methodsMixin';
    import ruleUtil from './rule-notify-util';

    export default {
        props: ['formItem', 'index', 'item'],
        components: {ruleUtil},
        mixins: [methodsMixin, ruleUtil],
        data() {
            return {
                isShow: false,
                isShowRule: false,
                isShowNotify: false,
                pageSets: [
                    {name: '规则信息', key: 1}
                ],
                currentTab: {},
                form: {
                    ccsWarnRuleGroupId: '',
                    ccsNotifyListId: '',
                    ccsMonitorRelationId: ''
                },
                rules: {
                    ccsWarnRuleGroupId: [
                        {required: true, message: '请选择告警规则组', trigger: 'change'}
                    ],
                    ccsNotifyListId: [
                        {required: true, message: '请选择通知列表', trigger: 'change'}
                    ],
                    ccsMonitorRelationId: [
                        {required: true, message: '请选择设备', trigger: 'change'}
                    ]
                },
                doing: false,
                actionType: '添加',
                ruleList: [],
                ruleGroupList: [],
                notifyList: [],
                loading: false,
                configType: 0, // 配置方式 1 整体 0 单个设备
                type: '', // 监控对象组类型 s 库区单个设备对象 o 货主热点设备对象 d 设备监控对象 空字符串 其他对象
                curUnitId: '', // 格式化后的id 代替unitId
                currentDevList: [] // 当前对象的设备列表
            };
        },
        computed: {
            unitId() {
                return this.$store.state.unitId;
            }
        },
        watch: {
            index: function (val) {
                if (val !== 0) return;
                if (this.formItem.id) {
                    this.form = {
                        ccsWarnRuleGroupId: '',
                        ccsNotifyListId: ''
                    };
                    this.actionType = '编辑';
                } else {
                    this.form = {
                        ccsWarnRuleGroupId: '',
                        ccsNotifyListId: ''
                    };
                    this.actionType = '添加';
                }
            },
            unitId(val) {
                this.configType = 0;
                this.type = '';
                this.curUnitId = '';
                this.currentDevList = [];
                if (val) {
                    this.isShow = true;
                    this.handleUnitId();
                    this.cancel();
                    this.queryRuleList();
                    this.queryNotifyList();
                }
            }
        },
        mounted() {
            if( this.item ){ //绑定的设备对象如果存在, 之前是通过侦听 this.$store.state 中的 unitId 变化进行赋值处理的 watch 侦听
                this.curUnitId = this.item.id;
                this.type = '';
                this.queryRuleList();
            }
        },
        methods: {
            resetRightBox() {
                this.isShow = false;
                this.$store.commit('initUnitId', '');
            },
            selectTab(item) {
                this.currentTab = item;
            },
            configTypeChange(val) {

            },
            queryDevList() {
                DevMonitoring.get(this.curUnitId).then(res => {
                    res.data.devs.forEach((i, index) => {
                        i.ccsMonitorRelationId = res.data.monitorRelationIds && res.data.monitorRelationIds[index] || '';
                    });
                    this.currentDevList = res.data.devs || [];
                });
            },
            handleUnitId() {
                let ary = this.unitId.split(',');
                if (ary.length === 2) {
                    this.curUnitId = ary[1];
                    this.type = ary[0];
                    if (this.type !== 'd') {
                        this.configType = 1;
                    }
                } else {
                    this.curUnitId = ary[0];
                    this.type = '';
                }
            },
            queryRuleList() {

                this.ruleList = [];
                if (!this.curUnitId) return;
                const params = {
                    pageNo: 1,
                    pageSize: 500,
                };
                if (this.type === 's' || this.type === 'o') {  // type 监控对象组类型:  s 库区单个设备对象、 o 货主热点设备对象、 d 设备监控对象、 空字符串 其他对象
                    params.ccsMonitorRelationId = this.curUnitId; // ccsMonitorRelationId : 车辆id
                } else {
                    params.monitorTargetId = this.curUnitId;  // monitorTargetId : 设备 id
                }
                this.loading = true;
                BindRule.query(params).then(res => {
                    this.initRuleList(res.data.currentList);
                    this.ruleList = res.data.currentList || [];
                    let changeList = res.data.changeList || [];
                    this.$emit('getChangList', changeList)
                    this.loading = false;
                });

                /*
                    之前逻辑
                    this.ruleList = [];
                    if (!this.curUnitId) return;
                    const params = {
                        pageNo: 1,
                        pageSize: 500,

                        monitorTargetId : this.item.id
                    };
                    if (this.type === 's' || this.type === 'o') {
                        params.ccsMonitorRelationId = this.curUnitId;
                    } else {
                        params.monitorTargetId = this.curUnitId;
                    }
                    this.loading = true;
                    BindRule.query(params).then(res => {
                        console.error(180, res) ;
                        this.initRuleList(res.data.currentList);
                        this.ruleList = res.data.currentList || [];
                        this.loading = false;
                    });
                */
            },
            queryRuleGroupList(query) {
                const params = {
                    ruleGroupName: query,
                    pageNo: 1,
                    pageSize: 500
                };
                AlarmRuleGroup.query(params).then(res => {
                    this.ruleGroupList = res.data.currentList || [];
                });
            },
            queryNotifyList(query) {
                const params = {
                    notifyListName: query
                };
                NotifyRule.query(params).then(res => {
                    this.notifyList = res.data.currentList || [];
                });
            },
            deleteRule(item) {
                this.$confirmOpera(`是否删除规则组"${item.warnRuleGroupName}"`, () => {
                    const ids = [item.id];
                    this.$httpRequestOpera(this.$http.delete('/ccsNotifyPlan', {
                        data: {ids}
                    }), {
                        successTitle: '删除成功',
                        errorTitle: '删除失败',
                        success: () => {
                            this.queryRuleList();
                        }
                    });
                });
            },
            cancel() {
                this.isShowRule = false;
                this.$refs['form'].resetFields();
                this.form = {
                    ccsWarnRuleGroupId: '',
                    ccsNotifyListId: '',
                    ccsMonitorRelationId: ''
                };
            },
            save() {
                this.$refs['form'].validate((valid) => {
                    if (valid && this.doing === false) {
                        if (!this.form.id) {
                            let http = {};
                            if (this.configType === 1) {
                                this.form.ccsMonitorRelationIds = this.type === 'd' ? [this.form.ccsMonitorRelationId] : [this.curUnitId];
                                http = BindRule.bindCcsNotifyPlans;
                                this.form.ccsMonitorRelationId = undefined;
                            } else {
                                this.form.monitorTargetId = this.curUnitId;
                                http = BindRule.bindCcsNotifyPlan;
                            }
                            this.doing = true;
                            this.$httpRequestOpera(http(this.form), {
                                successTitle: '添加成功',
                                errorTitle: '添加失败',
                                success: res => {
                                    this.doing = false;
                                    this.$refs['form'].resetFields();
                                    this.queryRuleList();
                                },
                                error: () => {
                                    this.doing = false;
                                }
                            });
                        }
                    }
                });
            }
        }
    };
</script>
