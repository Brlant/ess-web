import Vue from 'vue';
import router from './routers';
import tinyVue from './lib/tinyVue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '@/assets/scss/index.scss';
import './assets/css/basic.css';
import './assets/fonts/iconfont.css';
import Vuex from 'vuex';
import store from './store';
import {init} from './tools/init';
import App from './App.vue';

import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/dataZoom';
import ECharts from 'vue-echarts/components/ECharts.vue';
// 引入高德地图vue组件
import VueAMap, {lazyAMapApiLoaderInstance} from 'vue-amap';

/* yxh 之前引入*/
    // import * as Sentry from '@sentry/browser';
    // import * as Integrations from '@sentry/integrations';


import Layout from 'ant-design-vue'
import ElementUI from 'element-ui'
import 'ant-design-vue/dist/antd.css';

// // 初始化视口宽度
// initViewPort(router);

// 引入 vue-draggable-resizable 组件
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
Vue.component('vue-draggable-resizable', VueDraggableResizable) ; 

Vue.component('ECharts', ECharts);
Vue.use(require('vue-moment'), {moment});
Vue.use(tinyVue);
Vue.use(Vuex);
Vue.use(VueAMap);

// yxh modify
Vue.use(Layout);
Vue.use(ElementUI);

if (process.env.NODE_ENV === 'production') {
    /* yxh 之前引入*/
    // Sentry.init({
    //     dsn: 'https://eb94ae86f9104780be615d09d50416f2@f-log.sinopharm-bio.com/3',
    //     environment: 'vss',
    //     integrations: [new Integrations.Vue({Vue, attachProps: true})],
    //     shouldSendCallback: (date) => {// 过滤错误日志
    //         let filterArray = ['Request failed with status code 401', 'Request failed with status code 502'];
    //         if (date && date.hasOwnProperty('exception') && date.exception.hasOwnProperty('values') && filterArray.indexOf(date.exception.values[0].value) > -1 || date && date.transaction && date.transaction.indexOf('http://requirejs.org/docs/errors.html') > -1) {
    //             return false;
    //         }
    //         return date;
    //     }
    // });

}

init(Vue);



window.$mapInit = function () {
    if (lazyAMapApiLoaderInstance) return;
    VueAMap.initAMapApiLoader({
        key: '6c228c74ad098018b2e889b27a303a07',
        plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolB ar', 'AMap.MapType', 'AMap.Geocoder'],
        uiVersion: '1.0',
        v: '1.4.13'
    });
};

window.$lazyAMapApiLoaderInstance = function () {
    window.$mapInit();
    return lazyAMapApiLoaderInstance.load();
};

// window.$mapInit();

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

