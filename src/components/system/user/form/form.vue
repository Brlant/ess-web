<style lang="scss" scoped="">
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">{{title}}</h2>
    <el-form :model="form" :rules="rules" @submit.prevent="onSubmit('accountform')" label-width="100px"
             onsubmit="return false" ref="accountform">
      <el-form-item label="姓名" prop="name">
        <oms-input placeholder="请输入" type="text" v-model="form.name"></oms-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <oms-input placeholder="请输入" type="text" v-model="form.phone"></oms-input>
      </el-form-item>
      <el-form-item label="Email">
        <oms-input placeholder="请输入" type="text" v-model="form.email"></oms-input>
      </el-form-item>
      <el-form-item label="用户角色">
        <el-select filterable multiple placeholder="请选择" v-model="form.list">
          <el-option :key="item.id" :label="item.title" :value="item.id" v-for="item in roleSelect"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门">
        <el-select :clearable="true" :remote-method="filterDepartment" @click.native.once="filterDepartment('')"
                   filterable
                   placeholder="请输入名称搜所属部门"
                   popperClass="selects--custom" remote v-model="form.companyDepartment">
          <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in departmentList">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="岗位" prop="post">
        <oms-input placeholder="请输入岗位" type="text" v-model="form.post" :maxlength="20" show-word-limit></oms-input>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button @click="onSubmit('accountform')" native-type="submit" type="primary">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import {Access, Department, User} from '../../../../resources';

    export default {
        name: 'editForm',
        props: {
            formItem: {
                type: Object,
                default: {},
                required: true
            },
            title: {
                type: String,
                default: '增加'
            },
            action: {
                type: String,
                default: ''
            },
            actionType: {
                type: Boolean,
                default: true
            }
        },
        mounted() {
            this.$nextTick(function () {
                let param = {
                    pageNo: 1,
                    pageSize: 100,
                    usableStatus: 1,
                    objectId: 'ccs-system'
                };
                let self = this;
                Access.query(param).then(res => {
                    self.roleSelect = res.data.list;
                });
            });
            this.filterDepartment();
        },
        data: function () {
            let checkPhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号码'));
                } else {
                    let re = /^1[345789]\d{9}$/;
                    if (!re.test(value)) {
                        callback(new Error('请输入正确的手机号码'));
                    }
                    User.checkPhone(value, this.form.id).then(function (res) {
                        if (res.data.valid) {
                            callback();
                        } else {
                            callback(new Error('手机号码已经存在'));
                        }
                    });
                }
            };
            return {
                roleId: '',
                form: {
                    name: '',
                    phone: '',
                    email: '',
                    list: [],
                    post: '',
                },
                rules: {
                    name: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {validator: checkPhone, trigger: 'blur'}
                    ],
                    list: [
                        {required: true, type: 'array', message: '请选择用户角色', trigger: 'blur'}
                    ]
                },
                roleSelect: [],
                doing: false,
                departmentList: []
            };
        },
        watch: {
            formItem: function (val) {
                this.$refs['accountform'].clearValidate();
                if (val.id) {
                    this.form = this.formItem;
                    this.form.list = this.formItem.list.map(m => m.roleId);
                } else {
                    this.form = {
                        name: '',
                        phone: '',
                        email: '',
                        list: [],
                        post: '',
                    };
                }
            },
            showRight: function (val) {
                if (!val) {
                    this.$refs['accountform'].resetFields();
                }
            }
        },
        methods: {
            filterDepartment(query) { // 查询厂商
                let params = {
                    pageNo: 1,
                    pageSize: 20,
                    keyword: query
                };
                Department.getPage(params).then(res => {
                    this.departmentList = res.data.list;
                });
            },
            getRoleSelect: function () {
                let param = {
                    pageNo: 1,
                    pageSize: 100,
                    objectId: 'ccs-system'
                };
                let self = this;
                Access.query(param).then(res => {
                    self.roleSelect = res.data.list;
                });
            },
            onSubmit: function (formName) {
                let self = this;
                this.$refs[formName].validate((valid) => {
                    if (!valid || this.doing) {
                        return false;
                    }
                    let formData = JSON.parse(JSON.stringify(this.form));
                    formData.objectId = 'ccs-system';
                    formData.list = self.form.list.map(m => {
                        return {
                            roleId: m
                        };
                    });
                    if (this.action === 'add') {
                        User.save(formData).then((res) => {
                          User.editUserPost({id: res.data.id, ...formData}).then(()=>{
                            this.doing = false;
                            this.$notify.success({
                              duration: 2000,
                              name: '成功',
                              message: '新增平台用户"' + self.form.name + '"成功'
                            });
                            formData.list = this.getSelectRoles(formData, this.roleSelect);
                            self.$emit('change', formData);
                          }).catch(() => {
                            this.$notify.error({
                              duration: 2000,
                              message: '新增平台用户"' + self.form.name + '"失败'
                            });
                            this.doing = false;
                          });
                        }).catch(() => {
                            this.$notify.error({
                                duration: 2000,
                                message: '新增平台用户"' + self.form.name + '"失败'
                            });
                            this.doing = false;
                        });
                    } else {
                        User.editUserPost(formData).then(() => {
                          User.update(self.form.id, formData).then(()=>{
                            this.doing = false;
                            this.$notify.success({
                              duration: 2000,
                              name: '成功',
                              message: '修改平台用户"' + self.form.name + '"成功'
                            });
                            formData.list = this.getSelectRoles(formData, this.roleSelect);
                            self.$emit('change', formData);
                          }).catch(() => {
                            this.$notify.error({
                              duration: 2000,
                              message: '修改平台用户"' + self.form.name + '"失败'
                            });
                            this.doing = false;
                          });
                        }).catch(() => {
                            this.$notify.error({
                                duration: 2000,
                                message: '修改平台用户"' + self.form.name + '"失败'
                            });
                            this.doing = false;
                        });
                    }
                });
            },
            getSelectRoles(formData, roles) {
                return roles.filter(f => formData.list.some(s => s.roleId === f.id)).map(m => {
                    return {
                        roleId: m.id,
                        title: m.title
                    };
                });
            },
            doClose: function () {
                this.$emit('close');
                this.$refs['accountform'].resetFields();
            }
        }
    };
</script>
