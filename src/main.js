import Vue from 'vue'
import Cookies from 'js-cookie'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import i18n from './lang'; // Internationalization
import './icons' // icon
import './permission' // permission control

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// global css
import './assets/global.css'
import './assets/style/main.scss'



Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
