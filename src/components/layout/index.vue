<style lang="scss">

@import "../../assets/scss/mixins";

  /*.d-table {*/
  /*min-height: 500px;*/
  /*}*/

.btn-left-list-more {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    background: rgba(255, 255, 255, 0.9);
    text-align: center;

    .el-button {
        border: none;
        color: #666;
        background: 0 0;
        padding-left: 0;
        padding-right: 0;

        &:hover {
            color: #333
        }
    }
}

  .ant-layout-header {
      position:relative;
      height: 70px;
      .top-right {
          position: absolute;
          right: 1em;
          width: auto;
          z-index: 3;
          top: 50%;
          transform: translateY(-50%);

          .top-right-item {
              border-radius: 18px;
              background: #ebebeb;
              line-height: 26px;
              display: inline-block;
              padding: 3px 10px;
              cursor: pointer;

              img {
                  vertical-align: middle;
                  height: 23px;
                  width: 23px;
                  border: 1px solid #eee;
                  border-radius: 50%;
              }
          }

      }


  }

.top-right-user-dropdown {
    margin-top: 1px;
    padding: 10px;
    box-shadow: 1px 1px 1px #eee;
    border-color: #eee
}

.menu-user-part {
    display: flex;
    align-items: center;

    > div > img {
        margin-right: 10px;
        border-radius: 50%;
        height: 40px;
        width: 40px;
        border: 1px solid #eee
    }

    .menu-usr-part-phone {
        color: #666;
        font-size: 12px;
    }
}

.menu-user {
    padding: 8px 10px;

    .last-login {
        color: #999;
        font-size: 12px;
        margin: 10px 0;
    }

    a {
        color: $activeColor;
        font-size: 12px;
    }
}
.min-div {
    height: 0;
    width: 0;
    display: inline;
    overflow: hidden;
    line-height: 0;
}
  .app-body{ padding:0; }

.app-body-org {
    padding-top: 0;

    .layer-loading {
        top: 0
    }
}

</style>
<template>
    <div class="app-body full-width">
    <!-- yxh modify
        <app-header/>
        <el-scrollbar :class="{dashboard: $route.path === '/dashboard'}" class="body_scroll" tag="div">
        <div class="main-body container">
            <transition appear mode="out-in" name="scale">
                    <div class="app-content-view">
                        <router-view></router-view>
                    </div>
                </transition>
          </div>
            </el-scrollbar>
    -->


    <a-layout style="height: 100%">
      <app-left style="height: 100%; background: rgb(84, 92, 100)"/>
      <a-layout>
          <a-layout-header style="background: rgb(84, 92, 100); padding: 0; color: #ffffff">

              <div style="float: left;height: 70px;box-sizing: border-box;">
                  <span style="font-size: 2.5em; padding-left:18px; font-weight: bold">MCC冷链监控</span>
              </div>

              <!--
              <div class="top-right">
                  <div class="menu-usr-part-user">
                      <span style="margin-right: 8px;color: #FFD04B;">{{ user.userName }}</span>
                      <span>{{ newdate }}</span>
                  </div>
              </div>

              <div class="top-right">
                <div class="top-user">
                  <el-dropdown trigger="click">
                    <div class="el-dropdown-link top-right-item">
                      <compressed-img
                        :src="user.userIcon + '?image&action=resize:w_50,h_50,m_2'"
                        v-if="user.userIcon"
                      />
                      <img :src="userPic" v-else /> {{ user.userName }}
                      <i class="el-icon-caret-bottom"></i>
                    </div>
                    <el-dropdown-menu
                      class="top-right-user-dropdown"
                      slot="dropdown"
                    >
                      <div class="menu-user">
                        <div class="menu-user-part">
                          <div>
                            &lt;!&ndash;
                            <oms-upload-picture
                              :photoUrl="user.userIcon ? user.userIcon : ''"
                              class="user-img"
                            ></oms-upload-picture>
                            &ndash;&gt;
                          </div>
                          <div>
                            <div class="menu-usr-part-user">
                              {{ user.userName }}
                            </div>
                            <div class="menu-usr-part-phone">
                              {{ user.userAccount }}
                            </div>
                          </div>
                        </div>
                        <div class="last-login">
                          上次登录时间:{{ user.userLastLoginTime | time }}
                        </div>
                        <div
                          class="text-right"
                          style="display: flex; align-items: center"
                        >
                          <router-link to="/resetpsw" style="margin-right: 10px"
                            >重置密码</router-link
                          >
                          <a @click.stop.pre="logout" href="#">退出</a>
        </div>
                      </div>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div> -->

              <!--
                  <div class="top-right">
                      <i
                          style="font-size: 30px; vertical-align: middle; cursor: pointer"
                          @click="openView('https://iot.tracentsure.com/view')"
                          class="el-icon-s-platform"
                      ></i>
                  </div>
              -->

              <div class="top-right">
                  <div class="top-user">
                      <el-dropdown trigger="click">
                          <div class="el-dropdown-link top-right-item">
                              <compressed-img :src="user.userIcon+'?image&action=resize:w_50,h_50,m_2'" v-if="user.userIcon"/>
                              <img src="@/../static/img/userpic.png" v-else> {{user.userName}}
                              <i class="el-icon-caret-bottom"></i>
                          </div>
                          <el-dropdown-menu class="top-right-user-dropdown" slot="dropdown">
                              <div class="menu-user">
                                  <div class="menu-user-part">
                                      <div>
                                          <oms-upload-picture :photoUrl="user.userIcon ? user.userIcon : ''"
                                                              class="user-img"></oms-upload-picture>
                                      </div>
                                      <div>
                                          <div class="menu-usr-part-user">{{user.userName}}</div>
                                          <div class="menu-usr-part-phone">{{user.userAccount}}</div>
                                      </div>
                                  </div>
                                  <div class="last-login">上次登录时间:{{user.userLastLoginTime | time}}</div>
                                  <div class="text-right">
                                      <router-link style="float: left; margin-top: 2px;" to="/resetpsw">重置密码</router-link>
                                      <a @click.stop.pre="logout" href="#">退出</a>
                                  </div>
                              </div>
                          </el-dropdown-menu>
                      </el-dropdown>
                  </div>
              </div>

          </a-layout-header>
          <a-layout-content style="height: 100%">
              <el-scrollbar
                  style="height: 100%"
                  :class="{ dashboard: $route.path === '/dashboard' }"
                  class="body_scroll"
                  tag="div"
              >
                  <div class="main-body container right-body">
                      <transition appear mode="out-in" name="scale">
                          <div class="app-content-view" style='overflow-x:hidden;'>
                              <router-view></router-view>
                          </div>
                      </transition>
                  </div>
              </el-scrollbar>
          </a-layout-content>
      </a-layout>
    </a-layout>

    <attachmentDialog/>
    <print-dialog/>
    <rule-notify ref="ruleNotify"/>

    </div>
</template>

<script>
    import AppHeader from './app.header.vue';
    import AppFooter from './app.footer.vue';
    import attachmentDialog from '../common/attachment/attachment.dialog.vue';
    import printDialog from '../common/print.loading.vue';
    import ruleNotify from '@/components/common/rule-notify';
    import TimeMixins from '@/mixins/timeMixin';

    // yxh 添加
    import AppLeft from "./app.left.vue";
    import {Auth} from "@/resources";
    import userPic from "../../../static/img/userpic.png";

    import logo_pic from '@/assets/img/logo_pic.png';
    import omsUploadPicture from '@/components/common/upload/upload.user.picture.vue';

export default {
        components: {
            AppHeader,
            AppLeft, // yxh 添加
            AppFooter,
            attachmentDialog,
            printDialog,
            ruleNotify,
            omsUploadPicture
        },
        data() {
            return {
                userPic: userPic,
                collapsed: false,
                newdate: "",
                logo_pic : logo_pic,
                needCheck: false
            };
        },

        // yxh 添加
    computed: {
            user: function () {
                return Object.assign({}, this.$store.state.user);
        },
        updatePassFlag() {
            return this.$store.state.user['updatePassFlag'];
        },
        days() {
            return this.$store.state.user['passwordRule'];
        },
        checkPwd() {
            return this.needCheck && this.updatePassFlag;
        },
        bodyHeight: function () {
            let height = parseInt(this.$store.state.bodyHeight, 10);
            return height + 'px';
        }
    },
    mixins: [TimeMixins],
    beforeRouteUpdate(to, from, next) {
        this.$refs.ruleNotify.resetRightBox();
        if (to.path.includes('distribution') || to.path.includes('dashboard')) {
            return next();
        }
        this.clearAllTimes();
        next();
    },
    watch: {
        checkPwd(val) {
            if (val) {
                setTimeout(this.showTip,200);
            }
        }
    },
    methods: {
        // 显示安全提示
        showTip() {
            // 如果需要修改密码，给出提示：您当前登录密码使用已超过xx天，为保证您的账号安全，请立即修改。
            this.$alert('您当前登录密码使用已超过' + this.days + '天，为保证您的账号安全，请立即修改。', '安全提示', {
                confirmButtonText: '去修改', center: true, showClose: false
            }).then(() => {
                this.$router.replace("/resetpsw")
            }).catch(err => {
                console.log("加载alert异常", err)
            });

            this.needCheck = false;
        },
        getnewdate() {
            setInterval(() => {
                this.newdate = this.$moment().format("YYYY-MM-DD HH:mm:ss");
            }, 1000);
        },
        setBodyHeight: function () {
            this.$store.commit('setBodyHeight', window.innerHeight - 200 + 'px');
        },
        // yxh 添加
        logout: function () {
            window.localStorage.setItem('lastUrl', window.location.href);
            Auth.logout().then(() => {
                window.localStorage.setItem('userId', this.$store.state.user.userId);

                // yxh 修改退出逻辑
                window.localStorage.removeItem('user') ;

                return this.$router.replace('/login');
            });
        },
        /*
               logout: function () {

                   window.localStorage.setItem("lastUrl", window.location.href);
                   Auth.logout().then(() => {
                       window.localStorage.setItem("userId", this.$store.state.user.userId);
                       window.localStorage.removeItem("token");
                       return (window.location.href = "https://iot.tracentsure.com");
                       // this.$router.replace("/login");
                   });
               },
           */
        openView(url) {
            window.open(process.env.VUE_APP_LOGIN_URL + '/view');
        },
    },
    mounted: function () {
        window.addEventListener('resize', (e) => {
            this.setBodyHeight();
        });
        this.setBodyHeight();

        this.needCheck = true;
        // 监听后退和地址栏变化
        window.addEventListener('popstate', (e) => {
            // 当用户手动后退或者修改地址栏的时候，重新触法一次密码校验
            let hash = e.currentTarget.location.hash;
                // console.log("popstate.location.hash",hash);

            // 定义那些页面不需要安全提示
            let ext = hash.indexOf('login') !== -1 || hash.indexOf('resetpsw') !== -1 || hash.indexOf('forget') !== -1;
            if (ext) {
                // console.log("popstate.location.hash",hash);
                return;
            }

            this.needCheck = true;
        });
    }
};
</script>
