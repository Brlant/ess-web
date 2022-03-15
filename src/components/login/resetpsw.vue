<style lang="scss" scoped="">
@import "../../assets/scss/mixins";

body {
    background: #f5f5f5
}

.main-card-box {
    width: 550px;
    margin-top: -50px;
}

.logo-part {
    text-align: center;
    line-height: 80px;
    font-size: 40px;

    img {
        margin-right: 10px;
        vertical-align: middle;
        margin-top: -20px;
    }

    color: $activeColor
}
</style>
<template>
    <el-card class="box-card main-card-box">
        <div class="logo-part clearfix" slot="header">重置密码</div>
        <div style="padding:0 20px">
            <el-form :model="user" :rules="rules" @submit.prevent="done" label-position="top" label-width="80px"
                     onsubmit="return false" ref="loginForm">

                <el-form-item label="原密码" prop="oldPassword" style="position:relative">
                    <oms-input type="password" v-model="user.oldPassword"></oms-input>

                </el-form-item>
                <el-form-item label="新密码" prop="password" style="position:relative">
                    <oms-input type="password" v-model="user.password"></oms-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="password2" style="position:relative">
                    <oms-input type="password" v-model="user.password2"></oms-input>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button @click="done" native-type="submit" style="display:block;width:100%;" type="primary">
                        {{ btnString }}
                    </el-button>

                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script>
import {User} from '../../resources';

export default {
    name: 'resetpsw',
    data: function () {
        let checkPsw = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.user.password !== this.user.password2) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            }
        };
        let checkPasswd = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                let rl = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
                if (!rl.test(this.user.password)) {
                    callback('密码必须为8~16个字符，且包含数字、大写字母、小写字母');
                } else {
                    callback();
                }
            }
        };
        return {
            user: {oldPassword: '', password: '', password2: ''},
            loading: false,
            btnString: '提交',
            rules: {
                oldPassword: [
                    {required: true, message: '请输入原密码', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入新密码', trigger: 'blur'},
                    {validator: checkPasswd, trigger: 'blur'}
                ],
                password2: [
                    {required: true, message: '请输入确认密码', trigger: 'blur'},
                    {validator: checkPsw, trigger: 'blur'}
                ]
            },
            errorTitle: ''
        };
    },
    methods: {
        done() {
            this.$refs['loginForm'].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    User.resetPsw(this.user).then(() => {
                        this.$notify.info({
                            message: '修改成功'
                        });
                        this.$router.go(-1);
                    }).catch(e => {
                        let error = e.response;
                        if (error.status === 400) {
                            this.$notify.info({
                                message: error.data.meta.message
                            });
                        }
                    });
                }
            });
        }
    }
};
</script>
