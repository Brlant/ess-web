<template>
    <!--<el-card class="main-card-box">-->
    <!--<el-alert-->
    <!--title="404 走丢了"-->
    <!--type="warning"-->
    <!--description="系统错误"-->
    <!--show-icon>-->
    <!--</el-alert>-->
    <!--</el-card>-->
    <div></div>
</template>
<script>
import {Auth} from '@/resources';

export default {
    name: 'error',
    mounted() {
        Auth.checkLogin().then(() => {
            this.$router.replace('/');
            // this.$router.replace('/configInfo'); // 登录后界面跳转配置信息路由, 此路由为 dashboard 拷贝的静态路由, 【 解决一直 userinfo 接口来回跳转问题, 路由添加进去~ 但界面跳转空白 】
        }).catch(() => {
            // yxh 修改退出逻辑
            window.localStorage.removeItem('user') ; 
                        
            this.$router.replace('/login');
        });
    }
};
</script>
