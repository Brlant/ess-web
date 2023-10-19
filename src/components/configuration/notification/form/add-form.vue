<style lang="scss" scoped>
::v-deep {
    .notify-radio-group {
        .el-radio-button--mini {
            .el-radio-button__inner {
                padding: 6px 8px;
            }
        }
    }
}
.form-table{
    margin-bottom: 20px;
}
.delete{
    color: #D8001B;
}
</style>
<template>
    <dialog-template :btnSavePosition="100">
        <template slot="title">{{ actionType }}通知列表</template>
        <template slot="btnSave">
            <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
        </template>
        <template slot="content">
            <el-form :model="form" :rules="rules" label-width="100px" ref="tempForm">
                <el-form-item label="名称" prop="notifyListName">
                    <oms-input placeholder="请输入名称" type="text" v-model="form.notifyListName"></oms-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addRule" v-has="'show'">添加联系人</el-button>
                    <!--            <des-btn @click="addRule('0')" icon="plus" v-has="'show'">添加系统联系人</des-btn>-->
                    <!--            <des-btn @click="addRule('1')" icon="plus" v-has="'show'">添加外部联系人</des-btn>-->
                </el-form-item>
                <el-table :data="form.details" border class="form-table">
                    <el-table-column type="index" label="NO" width="45"></el-table-column>
                    <el-table-column
                        label="联系人类型"
                        min-width="140"
                    >
                        <template slot-scope="{row,$index}">
                            <el-form-item :prop="'details.' + $index + '.memberSource'"
                                          :rules="[{ required: true, message: '请选择联系人类型', trigger: 'change' }]"
                                          label-width="0"
                            >
                                <el-select @change="userTypeChange($event,$index)"
                                           clearable filterable placeholder="请选择联系人类型"
                                           v-model="row.memberSource"
                                           :disabled="actionType == '编辑' && row.hasOwnProperty('id')">
                                    <el-option :key="item.value" :label="item.label" :value="item.value"
                                               v-for="item in userTypeList"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="联系人"
                        min-width="120"
                    >
                        <template slot-scope="{row,$index}">
                            <el-form-item v-if="row.memberSource === '0'"
                                          :prop="'details.' + $index + '.targetStr'"
                                          :rules="[{ required: true, message: '请选择联系人', trigger: 'change' }]"
                                          label-width="0"
                            >
                                <el-select :remote-method="queryUserList" @change="userChange(row, $index)"
                                           @click.native.once="queryUserList('')"
                                           clearable filterable placeholder="请选择联系人" remote
                                           v-model="row.targetStr"
                                           :disabled="actionType === '编辑' && row.hasOwnProperty('id')">
                                    <el-option :key="item.id" :label="item.name" :value="item.id"
                                               v-for="item in userList"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-else-if="row.memberSource === '1'"
                                          :prop="'details.' + $index + '.notifyUser'"
                                          :rules="[{ required: true, message: '请输入外部联系人', trigger: 'blur' }]"
                                          label-width="0"
                            >
                                <oms-input v-model="row.notifyUser" :disabled="actionType === '编辑' && row.hasOwnProperty('id')"></oms-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="部门"
                        min-width="85"
                    >
                        <template slot-scope="{row,$index}">
                            <el-form-item v-if="row.memberSource === '1'"
                                          :prop="'details.' + $index + '.orgName'"
                                          :rules="[{ required: true, message: '请输入部门', trigger: 'blur' }]"
                                          label-width="0"
                            >
                                <oms-input v-model="row.orgName"></oms-input>
                            </el-form-item>
                            <el-form-item v-else
                                          :prop="'details.' + $index + '.orgName'"
                                          :rules="[{ required: false }]"
                                          label-width="0"
                            >
                                <span>{{ row.orgName }}</span>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="角色"
                        min-width="85"
                    >
                        <template slot-scope="{row,$index}">
                            <el-form-item v-if="row.memberSource === '1'"
                                          :prop="'details.' + $index + '.roleName'"
                                          :rules="[{ required: true, message: '请输入角色', trigger: 'blur' }]"
                                          label-width="0"
                            >
                                <oms-input v-model="row.roleName"></oms-input>
                            </el-form-item>
                            <el-form-item v-else
                                          :prop="'details.' + $index + '.roleName'"
                                          :rules="[{ required: false }]"
                                          label-width="0"
                            >
                                <span>{{ row.roleName }}</span>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="微信绑定操作"
                        min-width="250"
                    >
                        <template slot-scope="{row,$index}">
<!--                            <el-form-item :prop="'details.' + $index + '.notifyType'"
                                          :rules="[{ required: true, message: '请选择通知方式', trigger: 'change' }]"
                                          label-width="0"
                            >
                                <el-radio-group class="notify-radio-group" @change="checkChange(row)" size="mini"
                                                v-model="row.notifyType">
                                    <el-radio-button :key="item.key" :label="item.key" v-for="item in checkList">
                                        {{ item.label }}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>-->
                          <el-form-item label-width="0">
                            <el-button type="primary" size="small" @click="getQCode(row, $index)">微信绑定</el-button>
                            <div v-show="row.wechat">{{row.wechat}}</div>
                          </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="手机号"
                        min-width="210"
                    >
                        <template slot-scope="{row,$index}">
                            <el-form-item :prop="'details.' + $index + '.phone'"
                                          :rules="[{ required: true, message: '请输入手机号', trigger: 'blur' }, { required: true, validator: checkPhone, trigger: 'blur' }]"
                                          label-width="0"
                            >
                                <oms-input v-model="row.phone"></oms-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                      label="邮箱"
                      min-width="210"
                    >
                      <template slot-scope="{row,$index}">
                        <el-form-item :prop="'details.' + $index + '.email'"
                                      :rules="[{ required: false, message: '请输入邮箱', trigger: 'blur' }, { required: false, validator: checkEmail, trigger: 'blur' }]"
                                      label-width="0"
                        >
                          <oms-input v-model="row.email"></oms-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                        label="备注"
                        min-width="130"
                    >
                        <template slot-scope="{row,$index}">
                            <el-form-item :prop="'details.' + $index + '.comment'"
                                          label-width="0"
                            >
                                <oms-input placeholder="请输入备注" type="text" v-model="row.comment"></oms-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="通知状态"
                        min-width="140"
                    >
                        <template slot-scope="{row,$index}">
                            <el-form-item :prop="'details.' + $index + '.notifyStatus'"
                                          :rules="[{ required: true, message: '请选择通知状态', trigger: 'change' }]"
                                          label-width="0"
                            >
                                <el-switch
                                    active-text="启用"
                                    :active-value="1"
                                    inactive-text="停用"
                                    :inactive-value="0"
                                    v-model="row.notifyStatus"
                                ></el-switch>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="actionType === '添加'"
                        label="操作"
                        min-width="100"
                    >
                        <template slot-scope="{row,$index}">
                            <el-form-item label-width="0">
                                <el-button type="text" class="delete" @click="addDeleteRule(row)">删除</el-button>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="actionType === '编辑'"
                        label="操作"
                        v-has="'show'"
                        min-width="100"
                    >
                        <template slot-scope="{row,$index}">
                            <el-form-item label-width="0">
                                <el-button v-if="row.hasOwnProperty('id')" v-has="'ccs-notify-notifyUser-del'" type="text" class="delete" @click="editDeleteRule(row)">删除</el-button>
                                <el-button v-else type="text" class="delete" @click="editDeleteRule(row)">删除</el-button>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </template>
    </dialog-template>
</template>
<script>
    import {Department, NotifyRule, User} from '@/resources';

    export default {
        data() {
            return {
                formModel: {
                    notifyListName: '',
                    details: []
                },
                ruleModel: {
                    memberSource: '',
                    notifyType: '4',
                    comment: '',
                    targetStr: '',
                    notifyUser: '',
                    orgName: '',
                    roleName: '',
                    phone: '',
                    email: '',
                    contactInfo: '',
                    notifyStatus: 1,
                    wechat: '',
                },
                form: {},
                doing: false,
                rules: {
                    notifyListName: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ]
                },
                actionType: '添加',
                checkList: [
                    {label: '短信', key: '1', placeholder: '请输入手机号', validator: this.checkPhone},
                    {label: '邮箱', key: '2', placeholder: '请输入邮箱', validator: this.checkEmail},
                    {label: '微信', key: '3'},
                    {label: '短信/邮箱/微信', key: '4'},
                ],
                typeList: [
                    {label: '系统', key: '0'},
                    {label: '手动添加', key: '1'}
                ],
                userList: [],
                userTypeList: [
                    {label: '内部联系人', value: '0'},
                    {label: '外部联系人', value: '1'},
                ]
            };
        },
        computed: {},
        props: ['formItem', 'index', 'getQCodeInfo'],
        watch: {
            index: function (val) {
                if (val !== 0) return;
                this.form = JSON.parse(JSON.stringify(this.formModel));
                if (this.formItem.id) {
                    this.queryDetail();
                    this.actionType = '编辑';
                } else {
                    // this.form = JSON.parse(JSON.stringify(this.formModel));
                    this.actionType = '添加';
                }
            }
        },
        methods: {
            checkPhone(rule, value, callback) {
                if (value === '') {
                    callback(new Error('请输入手机号码'));
                } else {
                    let re = /^1[345789]\d{9}$/;
                    if (!re.test(value)) {
                        callback(new Error('请输入正确的手机号码'));
                    } else {
                        callback();
                    }
                }
            },
            checkEmail(rule, value, callback) {
                if (value === '') {
                    // callback(new Error('请输入邮箱'));
                  callback();
                } else {
                    let re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ig;
                    if (!re.test(value)) {
                        callback(new Error('请输入正确的邮箱'));
                    } else {
                        callback();
                    }
                }
            },
            addRule(type) {
                // this.form.details && this.form.details.splice(0, 0, Object.assign({}, this.ruleModel, {memberSource: type}));
                this.form.details && this.form.details.push({...this.ruleModel});
                this.$refs.tempForm.clearValidate();
            },
            // 新增时的删除
            addDeleteRule(item) {
                let index = this.form.details.indexOf(item);
                index !== -1 && this.form.details.splice(index, 1);
                this.$refs.tempForm.clearValidate();
            },
            // 编辑时的删除
            editDeleteRule(item) {
                if (item.id) {
                    this.$confirmOpera(`是否删除联系人"${item.notifyUser}"`, () => {
                        let index = this.form.details.indexOf(item);
                        index !== -1 && this.form.details.splice(index, 1);
                        this.$refs.tempForm.clearValidate();
                    })
                    return
                }
                let index = this.form.details.indexOf(item);
                index !== -1 && this.form.details.splice(index, 1);
                this.$refs.tempForm.clearValidate();
            },
            userTypeChange(val,index) {
                this.$set(this.form.details, index, {
                    memberSource: val,
                    notifyType: '4',
                    comment: '',
                    targetStr: '',
                    notifyUser: '',
                    orgName: '',
                    roleName: '',
                    phone: '',
                    email: '',
                    contactInfo: '',
                    notifyStatus: 1,
                    wechat: '',
                })
                this.$refs.tempForm.clearValidate();
            },
            promptMsg(item) {
                let ary = this.checkList.filter(f => f.key === item.notifyType);
                return ary.length ? ary[0] : {
                    placeholder: '请输入联系方式',
                    rules: []
                };
            },
            userChange(item, index) {
                let obj = this.userList.find(f => f.id === item.targetStr)
                // 修改联系人时，清空对应的openId
                item.openId = '';
                item.orgName = obj.companyDepartmentName;
                let roleName = obj.list.map(o=> {
                    return o.title
                })
                item.roleName = roleName.toString();
                item.phone = obj.phone;
                item.email = obj.email;
                item.notifyUser = obj.name;
                item.wechat = obj.wechat;
                this.checkContactWay(item);
                // 校验微信模式
                this.queryWeChart(item, index);
                this.$refs.tempForm.clearValidate();
            },
            checkChange(item) {
                item.openId = '';
                if (item.memberSource === '0') {
                    let obj = this.userList.find(f => f.id === item.targetStr)
                    item.phone = obj.phone;
                    item.email = obj.email;
                }
                if (item.memberSource === '1') {
                    item.phone = '';
                    item.email = '';
                }
                // item.memberSource === '1' && (item.targetStr = '');
                item.memberSource === '0' && this.checkContactWay(item);
                // 校验微信模式
                this.queryWeChart(item);
                this.$refs.tempForm.clearValidate();
            },
            checkContactWay(item) {
                if (item.notifyType === '3') {
                    item.checkPass = false;
                    return;
                }
                this.userList.forEach(i => {
                    if (i.id === item.targetStr) {
                        item.checkPass = false;
                        if (item.notifyType === '1' && !i.phone) {
                            this.$notify.info({
                                message: `联系人"${i.name}"无法取得手机联系方式，请尝试邮箱`
                            });
                            item.checkPass = true;
                        }
                        if (item.notifyType === '2' && !i.email) {
                            this.$notify.info({
                                message: `联系人"${i.name}"无法取得邮箱联系方式，请尝试短信`
                            });
                            item.checkPass = true;
                        }
                    }
                });
            },
            queryWeChart(item, index) {
                // 如果没选择微信, 返回
                if (item.notifyType !== '3') return;
                this.userList.forEach(i => {
                    if (i.id === item.targetStr) {
                        item.name = i.name;
                        item.notifyUser = i.name;
                    }
                });
                if (item.memberSource === '0') {
                    // 系统联系人
                    if (!item.targetStr) return;
                    this.$http.get(`/ccsWeChat/queryWechatUser/${item.targetStr}`).then(res => {
                        item.openId = res.data.openId;
                        item.wechat = res.data.openId;
                        item.loading = false;
                    }).catch(e => {
                        this.getQCode(item, index);
                    });
                } else {
                    // 外部联系人
                    this.getQCode(item, index);
                }
            },
            getQCode(item, index) {
                if (!item.memberSource) {
                  return this.$message.warning('请先选择联系人类型！')
                }
                if (item.memberSource && item.memberSource == '1' && !item.phone) {
                  return this.$message.warning('请先填写手机号！')
                }
                let params = {
                    userId: item.targetStr || item.phone
                };
                this.$emit('openDialog');
                // 获取二维码
                this.$http.get('/ccsWeChat/queryWechatQrCode', {params}).then(res => {
                    item.ticket = res.data.ticket;
                    this.$emit('openDialog', res.data.path, item);
                });
                // 已经在轮询中, 返回
                if (item.loading) return;
                // 轮询查询关注信息
                setTimeout(() => {
                    item.loading = true;
                    this.loopQueryInfo(item, index);
                }, 3000);
            },
            loopQueryInfo(item, index) {
                if (this.index !== 0) return;
                let code = this.getQCodeInfo();
                this.$http.get(`/ccsWeChat/queryWeChatTicketInfo/${code.ticket}`).then(res => {
                    item.loading = false;
                    if (res.data.openId === '400') {
                        this.$notify.info({
                            message: '该微信账号已绑定系统用户，请取消关注后再操作'
                        });
                        this.$emit('closeDialog');
                    } else {
                        this.$notify.success({
                            message: item.name ? `联系人"${item.name}"关注成功` : '关注成功'
                        });
                        item.openId = res.data.openId;
                        item.wechat = res.data.openId;
                        this.$set(this.form.details, index, {
                          ...this.form.details[index],
                          wechat: res.data.openId,
                        })
                        this.$emit('closeDialog');
                    }
                }).catch(() => {
                    setTimeout(() => {
                        this.loopQueryInfo(item, code.ticket);
                    }, 3000);
                });
            },
            queryDetail() {
                NotifyRule.get(this.formItem.id).then(res => {
                    res.data.details.forEach(i => {
                        i.openId = i.targetStr;
                        i.phone = (i.notifyType === '1' || i.notifyType === '3') ? i.contactInfo : (i.notifyType === '4') ? i.phone : '';
                        i.email = i.notifyType === '2' ? i.contactInfo : (i.notifyType === '4') ? i.email : '';
                        this.formatContactWay(i);
                    });
                    this.form = res.data;
                });
            },
            formatContactWay(item) {
                if (item.memberSource === '1') return;
                User.get(item.targetStr).then(res => {
                    let isHas = this.userList.some(s => s.id === item.targetStr);
                    if (!isHas) {
                        item.name = res.data.name;
                        item.notifyUser = res.data.name;
                        this.userList.push({
                            id: item.targetStr,
                            name: res.data.name,
                            phone: res.data.phone,
                            email: res.data.email,
                            wechat: res.data.wechat,
                        });
                    }
                });
            },
            queryUserList(query) {
                Department.getMembersNew({keyWord: query, status: 1}).then(res => {
                    this.userList = res.data.list;
                });
            },
            checkContactWayWhenSave() {
                this.form.details.forEach(i => {
                    this.checkContactWay(i);
                });
                return this.form.details.some(s => s.checkPass);
            },
            checkWeChatWay() {
                for (let i = 0; i < this.form.details.length; i++) {
                    let item = this.form.details[i];
                    if (item.notifyType === '3' && !item.openId) {
                        if (item.memberSource === '0') {
                            let title = item.name
                                ? `存在系统联系人"${item.name}"没有绑定微信` : '存在系统联系人没有绑定微信';
                            this.$notify.warning({
                                message: title
                            });
                        } else {
                            this.$notify.warning({
                                message: '存在外部联系人没有绑定微信'
                            });
                        }
                        return true;
                    }
                }
                return false;
            },
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid && this.doing === false) {
                        // if (!this.form.details.length) {
                        //   this.$notify.info({
                        //     message: '请添加联系人'
                        //   });
                        //   return;
                        // }
                        if (this.checkContactWayWhenSave()) return;
                        // // 微信模式的校验
                        if (this.checkWeChatWay()) return;
                        // 拼装给后台的数据
                        const form = JSON.parse(JSON.stringify(this.form));
                        form.details.forEach(i => {
                            i.name = undefined;
                            i.loading = undefined;
                            if (i.memberSource === '1' && (i.notifyType === '1' || i.notifyType === '4')) {
                                i.targetStr = i.phone;
                            } else if (i.memberSource === '1' && i.notifyType === '2') {
                                i.targetStr = i.email;
                            } else if (i.memberSource === '1' && i.notifyType === '3') {
                                i.targetStr = i.openId;
                            }
                            i.openId = undefined;
                            i.time = undefined;
                            i.checkPass = undefined;
                            i.contactInfo = (i.notifyType === '1' || i.notifyType === '3' || i.notifyType === '4') ? i.phone : i.notifyType === '2' ? i.email : '';
                        });
                        if (!this.form.id) {
                            this.doing = true;
                            this.$httpRequestOpera(NotifyRule.save(form), {
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
                            this.$httpRequestOpera(NotifyRule.update(this.form.id, form), {
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
