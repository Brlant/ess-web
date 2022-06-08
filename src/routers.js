import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export const routes = [
  {
    path: '/',
    component: () => import('./components/layout/index.vue'),
    children: [
      {
        path: '/dashboard',
        component: () => import('./components/dashboard/index.vue'),
        // meta: {moduleId: 'dashboard', title: '首页', icon: 'dashboard', perm: 'ccs-index-scan'},
        meta: { moduleId: 'dashboard', title: '首页', icon: 'el-icon-s-home', perm: 'ccs-index-scan' },
        children: []
      },
      {
        path: '/monitoring',
        component: () => import('./components/common/parent-route.vue'),
        // meta: {moduleId: 'monitoring', title: '监控中心', icon: 'xitongjiankong', perm: 'ccs-monitor-center'},
        meta: { moduleId: 'monitoring', title: '监控中心', icon: 'el-icon-s-platform', perm: 'ccs-monitor-center' },
        children: [
          /*
            yxh 隐藏仓库监控路由
            {
            path: '/monitoring/store/:id',
            component: () => import('./components/monitoring/store/index.vue'),
            meta: {moduleId: 'monitoring', title: '仓库监控', perm: 'ccs-warehouse-scan', subMenuId: 'store'}
          },
          */

          {
            path: '/monitoring/point/:id',
            component: () => import('./components/monitoring/point/index.vue'),

            // yxh 路由名字修改 点位监控 修改为 仓库监控
            // meta: {moduleId: 'monitoring', title: '点位监控', perm: 'ccs-point-warehouse-scan', subMenuId: 'point'}
            meta: { moduleId: 'monitoring', title: '仓库监控', perm: 'ccs-warehouse-manager', subMenuId: 'point' }
          },
          {
            path: '/monitoring/waybill/:id',
            component: () => import('./components/monitoring/waybill/index.vue'),
            meta: { moduleId: 'monitoring', title: '运单监控', perm: 'ccs-transorder-manager', subMenuId: 'waybill' }
          },
          {
            path: '/monitoring/point-dev-history',
            component: () => import('./components/monitoring/point-dev-history/index.vue'),
            meta: { moduleId: 'monitoring', title: '点位设备绑定记录', perm: 'ccs-point-relation-manager', subMenuId: 'point_dev_history' }
          },
          {
            path: '/monitoring/equipment',
            component: () => import('./components/monitoring/equipment/index.vue'),
            meta: { moduleId: 'monitoring', title: '设备监控', perm: 'ccs-monitordev-manager', pageType: 1 }
          },
          /*
            暂时屏蔽 */
            {
              path: '/monitoring/org/hot/spot',
              component: () => import('./components/monitoring/org/route-view.vue'),
              // meta: { moduleId: 'monitoring', title: '货主热点监控', perm: 'ccs-hotmonitor-scan', pageType: 2, subMenuId: 'org' },
              meta: { moduleId: 'monitoring', title: '货主热点监控', perm: 'ccs-hotmonitor-manager', pageType: 2, subMenuId: 'org' },
              children: [
                {
                  path: '',
                  component: () => import('./components/monitoring/org/index.vue'),
                  meta: { moduleId: 'monitoring' }
                },
                {
                  path: '/monitoring/org/hot/spot/temp',
                  component: () => import('./components/monitoring/temp-new/index.vue'),
                  meta: { moduleId: 'monitoring', showDev: false }
                }
              ]
            },
         
          /*
           yxh 隐藏查询历史数据路由
              {
               path: '/monitoring/temp',
               component: () => import('./components/monitoring/temp-new/index.vue'),
               meta: {moduleId: 'monitoring', title: '查询历史数据', perm: 'ccs-devdata-scan', subMenuId: 'temp', showDev: true}
              },
          */


          /*
            // yxh 备份之前查询点位历史数据、查询交接数据、导出历史数据路由信息
            {
                path: '/monitoring/point-dev/temp',
                component: () => import('./components/monitoring/point/temp-new/index.vue'),
                meta: {moduleId: 'monitoring', title: '查询点位历史数据', perm: 'ccs-point-devdata-scan', subMenuId: 'point-temp', showDev: true}
            },
            {
            path: '/monitoring/handover-data',
            component: () => import('./components/monitoring/handover-data/index.vue'),
            meta: {
              moduleId: 'monitoring',
              title: '查询交接数据',
              perm: 'ccs-dev-handover-data-scan',
              subMenuId: 'handover-data'
            }
            },
            {
            path: '/monitoring/export/temp',
            component: () => import('./components/monitoring/export/index.vue'),
            meta: {moduleId: 'monitoring', title: '导出历史数据', perm: 'ccs-dataexport-export'}
            },
          */

          // yxh  合并菜单 查询点位历史数据、查询交接数据、导出历史数据 为 数据查询


          {
            path: '/monitoring/point-dev/temp',
            component: () => import('./components/monitoring/point/temp-new/datasearch.vue'),
            // meta: { moduleId: 'monitoring', title: '数据查询', perm: 'ccs-point-devdata-scan', subMenuId: 'point-temp', showDev: true }
            meta: { moduleId: 'monitoring', title: '数据查询', perm: 'ccs-point-devdata-manager', subMenuId: 'point-temp', showDev: true }
          },

          {
            path: '/monitoring/distribution/:id',
            component: () => import('./components/monitoring/distribution/store/index.vue'),

            // yxh 修改
            // meta: {moduleId: 'monitoring', title: '设备分布', perm: 'ccs-devmap-scan', subMenuId: 'distribution'}
            // meta: { moduleId: 'monitoring', title: '静态场景', perm: 'ccs-devmap-scan', subMenuId: 'distribution' },
            meta: { moduleId: 'monitoring', title: '静态场景', perm: 'ccs-devmap-manager', subMenuId: 'distribution' },
          },
          {
            path: '/monitoring/distributionsetorigin/:id',
            component: () => import('./components/monitoring/distribution/storeSetOrigin/index.vue'),

            // yxh 修改
            // meta: {moduleId: 'monitoring', title: '设备分布', perm: 'ccs-devmap-scan', subMenuId: 'distribution'}
            // meta: { moduleId: 'monitoring', title: '静态场景', perm: 'ccs-devmap-scan', subMenuId: 'distribution' },
            meta: { moduleId: 'monitoring1', title: '静态场景（室内定位）', perm: 'ccs-devmap-manager-set-origin', subMenuId: 'distributionsetorigin' },
          },



          /*
            暂时屏蔽菜单 */
            {
              path: '/monitoring/org-distribution/:id',
              // component: () => import('./components/monitoring/distribution/org-store/index.vue'),
              component: () => import('./components/monitoring/distribution/org-store-modify/index.vue'),
              meta: { moduleId: 'monitoring', title: '单位点位分布', perm: 'ccs-org-devmap-scan', subMenuId: 'org-distribution' }
            },
         

          /*
             // yxh 屏蔽原 车辆分布路由 替换为 动态场景
            {
              path: '/monitoring/vehicle/distribution',
              component: () => import('./components/monitoring/distribution/vehicle/index.vue'),
              meta: {moduleId: 'monitoring', title: '车辆分布', perm: 'ccs-carmap-scan'}
            }
          */

          /*
          // yxh 原动态场景路由 - 参考全溯物联网平台路由
          {
            path: '/monitoring/dynamic',
            name: 'scene-dynamic',
            component: () => import('./components/monitoring/index'),
            meta: {
                moduleId: 'monitoring',
                type: 1,
                title: '动态场景',
                perm: 'ccs-dynamic-scene',
                subMenuId: 'distribution'
            }
          },
          */

          // yxh 添加动态场景路由 - 参考全溯物联网平台路由表
          {
            path: '/monitoring/vehicle/distribution',
            name: 'scene-dynamic',
            component: () => import('./components/monitoring/index'),
            meta: { moduleId: 'monitoring', type: 1, title: '动态场景', subMenuId: 'distribution', perm: 'ccs-dynamic-scene' }
          },

          // yxh 添加场景配置、对象配置路由表
          {
            path: '/configuration/config',
            component: () => import('./components/configuration/config/config.vue'),
            meta: {moduleId: 'configuration', title: '场景配置', perm: 'ccs-scene-configuration'}
          },
          {
              path: '/configuration/config/element',
              component: () => import('./components/configuration/config/element.vue'),
              meta: {moduleId: 'configuration', title: '对象配置', perm: 'ccs-object-management'}
          }

        ]
      },
      {
        path: '/alarm',
        component: () => import('./components/common/parent-route'),
        // meta: {moduleId: 'alarm', title: '告警中心', icon: 'alarm', perm: 'ccs-warn-center'},
        meta: { moduleId: 'alarm', title: '告警中心', icon: 'el-icon-bell', perm: 'ccs-warn-center' },
        children: [
          {
            path: '/alarm/record',
            component: () => import('./components/monitoring/alarm/event/index.vue'),
            meta: { moduleId: 'alarm', title: '告警事件', perm: 'ccs-warn-record-scan' }
          },
          {
            path: '/alarm/send',
            component: () => import('./components/monitoring/alarm/notify/index.vue'),
            meta: { moduleId: 'alarm', title: '告警通知', perm: 'ccs-warn-notify-scan' }
          }
        ]
      },
      {
        path: '/temp',
        component: () => import('./components/common/parent-route'),
        // meta: {moduleId: 'temp', title: '设备资产', icon: 'temp', perm: 'ccs-dev-center'},
        meta: { moduleId: 'temp', title: '设备资产', icon: 'el-icon-t-temp', perm: 'ccs-dev-center' },

        children: [
          {
            path: '/temp/all',
            component: () => import('./components/temp/common/index.vue'),
            meta: {
              moduleId: 'temp', title: '所有设备', perm: 'ccs-wired-watch-all-dev',
              type: 0, perms: ['show', 'ccs-wired-edit-all-dev']
            }
          },
          {
            path: '/temp/wire',
            component: () => import('./components/temp/common/index.vue'),
            meta: {
              moduleId: 'temp', title: '有线温度计', perm: 'ccs-wired-dev-scan',
              type: 1, perms: ['ccs-wired-dev-add', 'ccs-wired-dev-edit']
            }
          },
          {
            path: '/temp/wifi',
            component: () => import('./components/temp/common/index.vue'),
            meta: {
              moduleId: 'temp',
              title: '无线温度计',
              perm: 'ccs-wifi-dev-scan',
              type: 2,
              perms: ['ccs-wifi-dev-add', 'ccs-wifi-dev-edit']
            }
          },
          {
            path: '/temp/freezer',
            component: () => import('./components/temp/common/index.vue'),
            meta: {
              moduleId: 'temp',
              title: '冷柜温度计',
              perm: 'ccs-cool-dev-scan',
              type: 3,
              perms: ['ccs-cool-dev-add', 'ccs-cool-dev-edit']
            }
          },
          {
            path: '/temp/vehicle',
            component: () => import('./components/temp/common/index.vue'),
            meta: {
              moduleId: 'temp',
              title: '车载温度计',
              perm: 'ccs-car-dev-scan',
              type: 4,
              perms: ['ccs-car-dev-add', 'ccs-car-dev-edit']
            }
          },
          {
            path: '/temp/hygrometer',
            component: () => import('./components/temp/common/index.vue'),
            meta: {
              moduleId: 'temp', title: '湿度计', perm: 'ccs-humidity-dev-scan', type: 5,
              perms: ['ccs-humidity-dev-add', 'ccs-humidity-dev-edit']
            }
          },
            {
                path: '/temp/product',
                component: () => import('./components/monitoring/org/route-view.vue'),
                meta: { moduleId: 'monitoring', title: '产品一览', perm: 'ccs-hotmonitor-manager', pageType: 2, subMenuId: 'org' },
                children: [
                    {
                        path: '',
                        component: () => import('./components/temp/common/form/product-list.vue'),
                        meta: { moduleId: 'monitoring' }
                    },
                    //详情
                    {
                        path: '/temp/detail/:id',
                        name:"detail",
                        component: () => import('./components/temp/common/form/product-datail.vue'),
                        meta: { moduleId: 'monitoring', showDev: false }
                    },
                    // 添加
                    {
                        path: '/temp/add',
                        // name:'updata',
                        component: () => import('./components/temp/common/form/product-edit.vue'),
                        meta: { moduleId: 'monitoring', showDev: false }
                    },
                    //修改
                    {
                        path: '/temp/edit/:id',
                        name:'updata',
                        component: () => import('./components/temp/common/form/product-edit.vue'),
                        meta: { moduleId: 'monitoring', showDev: false }
                    }
                ]
            },
            {
              path: '/temp/circle',
              component: () => import('./components//temp/common/form/circle-product.vue'),
              meta: { moduleId: 'monitoring', title: '环控设备管理', perm: 'ccs-hotmonitor-manager', pageType: 2, subMenuId: 'org' },
          },
        ]
      },
      {
        path: '/configuration',
        component: () => import('./components/common/parent-route.vue'),
        // meta: {moduleId: 'configuration', title: '配置中心', icon: 'peizhi', perm: 'ccs-config-center'},
        meta: { moduleId: 'configuration', title: '配置中心', icon: 'el-icon-s-operation', perm: 'ccs-config-center' },

        children: [
          {
            path: '/configuration/alarm/group',
            component: () => import('./components/configuration/alarm-group/index.vue'),
            meta: { moduleId: 'configuration', title: '告警规则组', perm: 'ccs-warn-rule-group-scan' }
          },
          {
            path: '/configuration/alarm',
            component: () => import('./components/configuration/alarm/index.vue'),
            meta: { moduleId: 'configuration', title: '告警规则', perm: 'ccs-warn-rule-scan' }
          },
          {
            path: '/configuration/notification',
            component: () => import('./components/configuration/notification/index.vue'),
            meta: { moduleId: 'configuration', title: '通知列表', perm: 'ccs-notify-scan' }
          }
        ]
      },
      {
        path: '/permission',
        component: () => import('./components/system/index.vue'),
        // meta: {moduleId: 'permission', title: '系统设置', icon: 'setting', perm: 'system-config'}, // ccs-system-config
        meta: { moduleId: 'permission', title: '系统设置', icon: 'el-icon-s-tools', perm: 'system-config' }, // ccs-system-config

        children: [
          {
            path: '/permission/user',
            component: () => import('./components/system/user/user.vue'),
            meta: { moduleId: 'permission', title: '用户管理', perm: 'ccs-platform-user-watch' } // ccs-platform-user-watch
          },
          {
            path: '/permission/role',
            component: () => import('./components/system/role/role.vue'),
            meta: { moduleId: 'permission', title: '角色管理', perm: 'access-role-watch' } // ccs-access-role-watch
          },
          {
            path: '/permission/account',
            component: () => import('./components/system/account/account.vue'),
            meta: { moduleId: 'permission', title: '单位用户管理', perm: 'ccs-org-user-watch' } // ccs-platform-user-watch
          },
          {
            path: '/permission/log',
            component: () => import('./components/common/log/list.vue'),
            meta: { moduleId: 'permission', title: '系统日志', perm: 'ccs-system-log' }
          }
        ]
      }
    ]
  },

  // yxh 添加动态场景全屏组件路由
  {path: '/fullscreen', name: 'fullscreen', component: () => import('./components/common/icon-map/fullscreen')},
  {
      path: '/dynamic/fullscreen',
      name: 'dynamic-fullscreen',
      component: () => import('./components/common/icon-map/dynamic-fullscreen')
  },

  {
    path: '/monitoring/distribution/staticFullScreen/:id',
    component: () => import('./components/monitoring/distribution/store/staticFullScreen.vue'),
    meta: { moduleId: 'monitoring', title: '静态场景全屏', perm: '', subMenuId: 'distribution' },
  },
  {
    path: '/monitoring/distribution/staticSetOriginFullScreen/:id',
    component: () => import('./components/monitoring/distribution/storeSetOrigin/staticSetOriginFullScreen.vue'),
    meta: { moduleId: 'monitoring', title: '静态场景原点设置全屏', perm: '', subMenuId: 'distribution' },
  },
  {
    path: '/monitoring/org-distribution/orgStaticFullScreen/:id',
    component: () => import('./components/monitoring/distribution/org-store-modify/orgStaticFullScreen.vue'),
    meta: { moduleId: 'orgmonitoring', title: '单位点位分布静态场景全屏', perm: '', subMenuId: 'orgdistribution' },
  },
];

export const basicRoutes = [
  { path: '/resetpsw', component: () => import('./components/login/resetpsw.vue') },
  { path: '/404', component: () => import('./components/error/error_404.vue') },
  { path: '/500', component: () => import('./components/error/error_500.vue') },
  { path: '/login', component: () => import('./components/login/login.vue') },
  { path: '/forget', component: () => import('./components/login/forget.vue') },
  { path: '/code/:id', component: () => import('./components/login/resetpwd.vue') }
];

export const ErrorPage = [
  { path: '*', component: () => import('./components/error/error_404.vue') }
];
//  不需要鉴权的路径
// const permissive = ['/login', '/404', '/500'];

const router = new VueRouter({
  //  mode: 'history',
  routes: basicRoutes,
  base: '/'
});

// yxh 添加全局守卫逻辑 针对 user 
router.beforeEach((to, from, next) => {
  let val = localStorage.getItem( 'user' ) ;

  if( !val ){ // 如果没有登录 
    if( to.path !== '/login' ){ // 如果没有登录你还想访问其它的界面, 你必须先登录, 回登录界面去吧！~ 

      //【 注意: 没有登录时可以访问 2 个界面, 一个是登录界面, 一个是忘记密码界面 】 所以这里要做判定
      if( ~to.path.toLowerCase().indexOf( 'forget' ) ){ // 如果是忘记密码界面, 则正常走流程
        next() ;
      } else {
        next( { path : '/login' } ) ; // 回登录界面
      }

    } else { // 否则没有登录的其它情况
      next() ; // 其它没有登录的情况正常执行.
    }
  } else { // 如果已经有登录信息
    if( to.path === '/login' ){ // 如果已经有登录信息, 这个时候你来访问登录界面~ 你是不能访问的，先回首界面看看吧!
      next( { path : '/' } ) ; // 回首界面
    } else { // 否则登录的其它情况
      next() ; // 其它登录的情况正常执行 .
    }
  }

}) ;

export default router;
