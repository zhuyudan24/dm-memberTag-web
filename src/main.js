import promise from 'es6-promise';
promise.polyfill();
// import Vue from 'vue';
import App from './App';
import router from './router';
import { Message } from 'element-ui';
import VueAxios from 'vue-axios';
import axios from 'axios';
import store from './store/store';
/* eslint-disable */
import * as types from './store/types';
// import 'element-ui/lib/theme-chalk/index.css'
import '../theme/index.css';
import '../static/css/index.less';
import '../static/font/iconfont.css';
import vueGicDatepicker from '@gic-test/vue-gic-datepicker';

/* import vueGicHeader from '@gic-test/vue-gic-header';
import vueGicAsideMenu from '@gic-test/vue-gic-aside-menu';
import vueAreaAb from '@gic-test/vue-area-ab';
// 新增公共 footer插件
import vueGicFooter from '@gic-test/vue-gic-footer';
import vueGicImgPreview from '@gic-test/vue-gic-img-preview';
import vueGicStoreNew from '@gic-test/vue-gic-store-new';

Vue.use(vueGicStoreNew);
Vue.use(vueGicImgPreview);
Vue.use(vueGicFooter);
Vue.use(vueAreaAb);
Vue.use(vueGicAsideMenu);
Vue.use(vueGicHeader); */

Vue.use(vueGicDatepicker);
Vue.config.devtools = true;
// Vue.config.productionTip = true;
// Vue.use(ElementUI, { size: 'large' });
Vue.use(VueAxios, axios);
Vue.axios.defaults.withCredentials = true; // 跨域cookie访问
Vue.axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
Vue.axios.interceptors.response.use(
  response => {
    // console.log("main:", response);
    if (response.status == 200 && response.data.errorCode == 1) {
      // router.replace({
      //   path: 'login',
      //   query: {redirect: router.currentRoute.fullPath}
      // })
    }
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          // store.commit(types.LOGOUT);
          // router.replace({
          //   path: 'login',
          //   query: {redirect: router.currentRoute.fullPath}
          // });
          window.location.href = window.location.origin + '/gic-web/#/';
        case 500:
          Message.error('服务器500');
      }
    }
    return Promise.reject(error.response.data);
  }
);

// router.beforeEach((to, from, next) => {
//   if (window.location.pathname.slice(-1) !== '/') {
//     window.location = window.location.pathname + '/';
//   }
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

console.log(Vue.config);
