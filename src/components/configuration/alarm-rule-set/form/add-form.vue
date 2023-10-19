<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{actionType}}告警规则组</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="tempForm">
        <el-form-item label="规则组名称" prop="ruleGroupName">
          <oms-input placeholder="请输入规则名称" type="text" v-model="form.ruleGroupName"></oms-input>
        </el-form-item>
        <el-form-item label="运输条件" prop="transCondition">
          <el-select  placeholder="请选择运输条件"  v-model="form.transCondition">
            <el-option :key="item.key" :label="item.label" :value="item.key"
                       v-for="item in transportationConditionList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货主" prop="owners">
            <el-select filterable remote placeholder="请输入名称搜索货主信息" :remote-method="filterCustomer"
                            multiple @click.native.once="filterCustomer('')"
                           v-model="form.owners" >
                <el-option :value="org.dhsOrgId" :key="org.orgId" :label="org.orgName" v-for="org in customerList">
                    <!-- <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
                    </div> -->
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="level">
          <el-input v-model="form.level" placeholder="只可填写整数数字，数字越小优先级越高" :min="1" type="number"  oninput="value=value.replace(/^0|[^0-9]/g, '')" ></el-input>
        </el-form-item>
        <el-form-item label="匹配类型" prop="matchTypeList">
          <el-select filterable
                     multiple placeholder="请输入名称搜索匹配类型" v-model="form.matchTypeList">
            <el-option :key="item.key" :label="item.label" :value="item.key"
                       v-for="item in ruleGroupMatchTypeList"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="通知列表" prop="ccsNotifyIdList">
          <el-select :remote-method="queryNotifyList" filterable @click.once.native="queryNotifyList('')"
                     multiple placeholder="请输入名称搜索通知列表" clearable remote v-model="form.ccsNotifyIdList">
            <el-option :key="item.id" :label="item.notifyListName" :value="item.id"
                       v-for="item in NotificationList"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="告警规则" prop="rules">
          <el-select :remote-method="queryRule" filterable @click.once.native="queryRule('')"
                     multiple placeholder="请输入名称搜索告警规则" remote v-model="form.rules">
            <el-option :key="item.id" :label="item.ruleName" :value="item.id"
                       v-for="item in ruleList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
    import {AlarmRule, AlarmRuleGroup,NotifyRule} from '@/resources';
    import https from "@/https";
    export default {
        data() {
            return {
                formModel: {
                    ruleGroupName: '',
                    transCondition:'', //运输条件
                    owners:[],  // 货主
                    level:'', // 优先级
                    matchTypeList:[],// 匹配类型
                    ccsNotifyIdList:[],// 通知列表
                    rules: [],
                    ruleIds: ''
                },
                form: {},
                doing: false,
                rules: {
                    ruleGroupName: [
                        {required: true, message: '请输入规则名称', trigger: 'blur'}
                    ],
                    transCondition:[
                        {required: true, message: '请选择运输条件', trigger: 'change'}
                    ],
                    owners:[
                        {required: false, message: '请输入货主名称', trigger: 'change'}
                    ],
                    level:[
                        {required: true, message: '请输入优先级', trigger: 'change'}
                    ],
                    matchTypeList:[
                        {required: true, message: '请选择匹配类型', trigger: 'change'}
                    ],
                    ccsNotifyIdList:[
                        {required: true, message: '请选择通知列表', trigger: 'change'}
                    ],
                    rules: [
                        {required: true, type: 'array', message: '请选择告警规则', trigger: 'change'}
                    ]
                },
                actionType: '添加',
                ruleList: [],
                NotificationList:[],//通知列表
                matcheTypeList:[], // 匹配类型列表
                customerList:[] , //  货主列表
                // transportationConditionList:[], // 运输条件列表
            };
        },
        computed: {
            transportationConditionList(){
                return this.$getDict('transportationCondition');
            },
            ruleGroupMatchTypeList(){
                return this.$getDict('ruleGroupMatchType');
            },
        },
        props: ['formItem', 'index'],
        watch: {
            index: function (val) {
                if (val !== 0) return;
                this.$refs['tempForm'].resetFields();
                if (this.formItem.id) {
                    this.initDetail();
                    this.actionType = '编辑';
                } else {
                    this.form = Object.assign({}, this.formModel);
                    this.actionType = '添加';
                }
            }
        },
        methods: {
            // 货主搜索
            filterCustomer(typeTxt){
                let params = {
                    pageNo: 1,
                    pageSize: 9999,
                    deleteFlag: false,
                    keyWord:typeTxt
                }
                https.get('/org/pager', params).then(res => {
                    this.customerList = res.list
                })
            },
            // 通知列表
            queryNotifyList(query){
                const params = {
                    notifyListName: query
                };
                NotifyRule.query(params).then(res => {
                    this.NotificationList = res.data.currentList || [];
                });
            },
            queryRule(query, setRuleListWhenEdit) {
                const params = {
                    ruleName: query,
                    pageNo: 1,
                    PageNo: 500
                };
                AlarmRule.query(params).then(res => {
                    this.ruleList = res.data.currentList || [];
                    setRuleListWhenEdit();
                });
            },
            async initDetail(){
                await this.filterCustomer()
                await this.queryNotifyList()
                await this.queryDetail()
            },
            queryDetail() {
                AlarmRuleGroup.get(this.formItem.id).then(res => {
                    const rules = res.data.rules;
                    res.data.rules = [];
                    this.form = Object.assign({}, res.data);
                    this.form.ruleList = rules;
                    this.queryRule('', this.setRuleListWhenEdit);
                });
            },
            setRuleListWhenEdit() {
                if (!this.form.id) return;
                this.form.ruleList.forEach(i => {
                    let isHas = this.ruleList.some(s => s.id === i.id);
                    if (!isHas) {
                        this.ruleList.push({
                            id: i.id,
                            ruleName: i.ruleName
                        });
                    }
                });
                this.form.rules = this.form.ruleList && this.form.ruleList.map(m => m.id);
            },
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid && this.doing === false) {
                        let form = JSON.parse(JSON.stringify(this.form));
                        form.ruleIds = form.rules.join(',');
                        if(form.owners && form.owners.length>0){
                            form.owners = form.owners.join(',');
                        }else{
                            form.owners = '';
                        }
                        form.matchTypeList = form.matchTypeList.join(',');
                        // form.ccsNotifyIdList = form.ccsNotifyIdList.join(',');
                        // TODO
                        form.rules = undefined;
                        if (!this.form.id) {
                            this.doing = true;
                            this.$httpRequestOpera(AlarmRuleGroup.save(form), {
                                successTitle: '添加成功',
                                errorTitle: '添加失败',
                                success: res => {
                                    this.doing = false;
                                    this.$emit('change', res.data);
                                },
                                error: () => {
                                    this.doing = false;
                                }
                            });
                        } else {
                            this.doing = true;
                            this.$httpRequestOpera(AlarmRuleGroup.update(form.id, form), {
                                successTitle: '修改成功',
                                errorTitle: '修改失败',
                                success: res => {
                                    this.doing = false;
                                    this.$emit('change', res.data);
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
