<style lang="scss" scoped="">
@import "../../assets/scss/mixins";

body {
    background: #f5f5f5
}

.main-card-box {
    width: 550px;
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

.login-menu {
    cursor: pointer;

    padding: 20px 0;

    > div {
        text-align: center;
        line-height: 40px;
        width: 50%;
        border-bottom: 3px solid #eee;
        color: #999;
        font-weight: bold;
        font-size: 14px;

        &.active {
            border-color: $activeColor;
            color: $activeColor;
        }
    }
}
</style>
<template>
    <el-card class="box-card main-card-box">
        <div class="logo-part clearfix"><img src="../../assets/img/logo_pic.png">MCC冷链监控</div>
        <div style="padding:0 20px">
            <h3 class="text-center">重置密码</h3>
            <div class="login-menu">
                <el-form :model="user" :rules="rules" @submit.prevent="done" label-position="top" label-width="80px"
                         onsubmit="return false" ref="loginForm">
                    <el-form-item label="新密码" prop="password">
                        <oms-input type="password" v-model="user.password"></oms-input>
                    </el-form-item>

                    <el-form-item label-width="80px">
                        <el-button @click="done" native-type="submit" style="display:block;width:100%;" type="warning">
                            {{ btnString }}
                        </el-button>

                    </el-form-item>
                </el-form>
            </div>
        </div>
    </el-card>
</template>

<script>
import {http} from '../../resources';

export default {
    name: 'resetpwd',
    data: function () {
        let checkPasswd = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                let rl = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
                if (!rl.test(this.user.password)) {
                    callback('新密码必须包含数字、大写字母,小写字母,至少8-16个字符');
                } else {
                    callback();
                }
            }
        };
        return {
            user: {password: '', code: ''},
            loading: false,
            showInfo: false,
            codeUrl: '',
            showCode: false,
            btnString: '提交',
            rules: {
                password: [
                    {required: true, message: '请输入新密码', trigger: 'blur'},
                    {validator: checkPasswd, trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        done() {
            this.$refs['loginForm'].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    http.put('/oms/user/reset/password', this.user).then(() => {// 验证
                        this.showInfo = true;
                        this.$notify.info({
                            message: '重置成功'
                        });
                        setTimeout(() => {
                            // yxh 修改退出逻辑
                            window.localStorage.removeItem('user') ; 
                        
                            this.$router.push('/login');
                        }, 1000);
                    }, error => {
                        let data = error.response.data;
                        this.$notify.error({
                            message: data.msg
                        });
                        this.loading = false;
                    });
                }
            });

        }
    },
    mounted: function () {
        this.user.code = this.$route.params.id;
    }
};
</script>
