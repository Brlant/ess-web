<style lang="scss" scoped=''>
@import "../../assets/scss/mixins";

$menuHoverColor: $activeColor;
$menuHoverBg: #f1f1f1;

.logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
    cursor: pointer;
}

.trigger {
    color: #ffffff;
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}

.logo-img {
    float: left;
    display: flex;
    height: 70px;
    align-items: center;
}

.logo_pic {
    float: left;
    display: block;
    width: 55px;
    height: 60px;
    margin: 5px 0;
    margin-left: 65px;
}

.main-title {
    float: left;
    line-height: 70px;
    font-size: 24px;
    color: #ffffff;
}

.img-div {
    width: 100%;
    height: 71px;
    text-align: center;
    line-height: 71px;
}

.img-div-bg {
    background: linear-gradient(90deg, hsla(0, 0%, 100%, .8392156862745098), #545c64);
}

.element::-webkit-scrollbar {
    width: 0 !important
}

/*.ant-menu-item-active {*/
/*    background-color: rgb(67, 74, 80) !important;*/
/*}*/

/*.ant-menu-submenu-active {*/
/*    background-color: rgb(67, 74, 80) !important;*/
/*}*/

/*.ant-menu-dark .ant-menu-inline.ant-menu-sub {*/
/*    background-color: rgb(84, 92, 100) !important;*/
/*}*/
</style>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-menu {
    border-right: 0;
}

.menu-icon {
    color: #ffffff;
    font-size: 25px;
    line-height: 60px;
    padding-left: 25px;
    padding-top: 10px;
}

.hidden-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}

.hidden-scrollbar {
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
}

.menu-demo {
    height: calc(100vh - 70px);
    box-sizing: border-box;
    overflow: auto;
    background: rgb(84, 92, 100);
}
</style>
<template>
    <div>
        <a-layout-sider v-model="isCollapse" :trigger="null" collapsible>

            <div v-if="!isCollapse" @click="isCollapse=!isCollapse" style="cursor: pointer;">
                <div class="img-div img-div-bg" :style="{marginLeft: isCollapse ? '15px' : '0px'}">
                    <img :src="logo_pic_new" @click="activeId=''" class="logo_pic">
                </div>
            </div>
            <div v-else @click="isCollapse=!isCollapse" style="cursor: pointer;">
                <a-icon type="menu-unfold"
                        class="menu-icon"/>
            </div>

            <div class="hidden-scrollbar menu-demo">
                <el-menu
                    :router="true"
                    :default-active="defaultActive"
                    class="el-menu-vertical-demo"
                    background-color="#545c64"
                    text-color="#fff" 
                    active-text-color="#ffd04b"
                    :collapse="isCollapse"
                    :unique-opened="true"
                    :show-timeout="1000"
                    :default-openeds="defalutOpeneds"
                >
                    <div v-for="(item,i1) in menu" :key="i1">
                        <el-submenu :index="i1+''" v-if="item.children.length>0">
                            <template slot="title">
                                <i :class="item.meta.icon"></i>
                                <span v-if="!isCollapse">{{ item.meta.title }}</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item :index="subItem.path" v-for="(subItem,i2) in item.children"
                                              :key="i2">
                                    {{ subItem.meta.title }}
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-menu-item :index="item.path" v-else>
                            <i :class="item.meta.icon"></i>
                            <span slot="title">{{ item.meta.title }}</span>
                        </el-menu-item>
                    </div>
                </el-menu>
            </div>
        </a-layout-sider>
    </div>
</template>

<script>
import logo_pic from '@/assets/img/logo_pic.png';
import logo_pic_new from '@/assets/img/logo.png';
import utils, {deepCopy} from '@/tools/utils';
 

export default {
    data() {
        return {
            defaultActive: "",
            defalutOpeneds:[],
            isCollapse: false,
            logo_pic: logo_pic,
            logo_pic_new: logo_pic_new,
        };
    },
    computed: {
        menu: function () {
            return this.$parent.$parent.$parent.$parent.menuData;
        },
    },
    watch: {},
    methods: {},
    mounted: function () {
          //如果是首页跳转到 /dashboard
        if (this.$route.path === '/') {
            // 此处增加判断，此人是否有首页的权限
            let promiseTemp =  deepCopy(this.$store.state.permissions)
            let isDashboard1 = promiseTemp.some((item)=>{return item=='ccs-index'})
            let isDashboard2 = promiseTemp.some((item)=>{return item=='ccs-index-scan'})
            // 如果我没有在权限内找到了 首页的perm
            if(!isDashboard1||!isDashboard2){
                // 则跳转到 路由的第一层第一个子集
                // console.log(this.$parent.$parent.$parent.$parent.menuData[0].children[0].path) // 第一个菜单的第一个子集
                this.$router.push(this.$parent.$parent.$parent.$parent.menuData[0].children[0].path)
                let firstRoute = (this.$parent.$parent.$parent.$parent.menuData[0].children[0].path).toString()
                this.defaultActive = firstRoute
                this.defalutOpeneds = ['0']
            }   
            else{
                this.$router.push('/dashboard')
                this.defaultActive = '/dashboard'
            }
        } else if (this.$route.path.includes('monitoring/waybill/')) {
            this.defaultActive = '/monitoring/waybill/:id'
        } else {
            this.defaultActive = this.$route.path
        }
    }
}
</script>
