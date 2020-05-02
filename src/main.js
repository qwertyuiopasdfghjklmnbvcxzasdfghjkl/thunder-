import Vue from 'vue'
import Cookies from 'js-cookie';
import App from './App.vue'
import router from './router/'
import store from './store/'
import axios from 'axios'
import VConsole   from 'vconsole'

import VueI18n from 'vue-i18n' //多语言处理模块
import vueTap from 'v-tap'
import Methods from './assets/js/methods'

import MaskLayer from '@/components/common/mask'
import TopBack from '@/components/common/top_back'
import numberKeyboard from '@/components/common/numberKeyboard'
import SubmitButton from '@/components/common/SubmitButton'
import NoData from "@/components/common/noData";

import VeeValidate from 'vee-validate' // 验证
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.min.css'
import '@/assets/js/vee-validate'
import langApi from '@/api/language'
import VueClipboard from 'vue-clipboard2'
import Config from '@/api/config'

import {
  Indicator, Button, Tabbar, TabItem, Loadmore, InfiniteScroll, Popup,
    Picker, Range, Navbar, TabContainer, TabContainerItem, Switch, Radio, Progress
} from 'mint-ui'

import uiInpu from './components/uiInput'

require('./assets/js/cordovaUtils') //引入cordova工具集
require('./assets/js/directive') //引入全局自定义指令集
require('./assets/js/filter') //引入全局自定义过滤器
require('./assets/js/prototype') //引入全局自定义过滤器

Vue.use(VueI18n)
Vue.use(vueTap)
Vue.use(uiInpu)
Vue.use(VeeValidate, {events: null })
Vue.use(VueAwesomeSwiper)
Vue.component(Button.name, Button)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(Loadmore.name, Loadmore)
Vue.component(Popup.name, Popup)
Vue.use(InfiniteScroll)
Vue.component(Picker.name, Picker)
Vue.component(Range.name, Range)
Vue.component(Navbar.name, Navbar)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Switch.name, Switch);
Vue.component(Radio.name, Radio);
Vue.component(Progress.name, Progress);

Vue.component(MaskLayer.name, MaskLayer)
Vue.component(TopBack.name, TopBack)
Vue.component(numberKeyboard.name, numberKeyboard)
Vue.component(SubmitButton.name, SubmitButton)
Vue.component(NoData.name, NoData)

Vue.use(VueClipboard)
//
// if(process.env.VUE_APP_CURRENTMODE!=='app'){
// window.vConsole = new VConsole()
// }

//全局引入提示函数
window.Tip = require('@/components/common/tip').default
//全局引入加载提示效果
window.Indicator = Indicator

//请求加入随机参数
let $ajax = axios.create({
  contentType: "application/json;charset=utf-8",
  params: {
    _r: new Date().getTime()
  }
})

Vue.prototype.$ajax = $ajax
let LangEn = localStorage.en && JSON.parse(localStorage.en) || require('@/lang/en').default //英文包
let LangZhCN = localStorage['zh-CN'] && JSON.parse(localStorage['zh-CN']) || require('@/lang/zh-CN').default //英文包
let lang = store.getters.getLang
LangZhCN.updateInfo = Config.updateInfo['zh-CN']
LangEn.updateInfo = Config.updateInfo['en']

let i18n = window.$i18n = new VueI18n({
  locale: lang,
    silentTranslationWarn: true,
  messages: {
    'en': LangEn,
    'zh-CN': LangZhCN,
  }
})

Vue.config.productionTip = false


//路由拦截
router.beforeEach((to, from, next) => {
  let login = to.meta.login
  if (login && !Cookies.get('api_token')) {  // 判断是否要求登录才能访问
      next({
          name: 'login',
          query:{curl:to.fullPath}
      });
  } else if (Cookies.get('api_token') &&  ['login','register','findpwd','resetpwd','twoverify','sendemail','activationsuccess'].includes(to.name)) {  // 判断已经登录则不再访问列表中的页面
      next({
          name: 'home'
      });
  } else {
      next();
  }
});


// 非开发环境 禁止打印
if(process.env.NODE_ENV !== 'development'){
    window.console.log = ()=>{}
    window.console.error = ()=>{}
    window.console.warn = ()=>{}
}

let init = ()=>{
  window.vm = new Vue({
        i18n,
        methods:Methods,
        router,
        store,
        render: h => h(App)
    }).$mount('#app')

    // 关闭启动页
    setTimeout(()=>{
      if (window.navigator && window.navigator.splashscreen) {
        window.navigator.splashscreen.hide()
      }
    },3000)

    window.getServeLang = ()=>{
      langApi.getLanguage(lang, (res) => {
          if(Config.updateInfo[lang]){
            res.updateInfo = Config.updateInfo[lang]
          } else {
            res.updateInfo = Config.updateInfo['en']
          }
          i18n.setLocaleMessage(lang, res)
          window.localStorage[lang] = JSON.stringify(res)
      }, msg=>{
        //setTimeout(window.getServeLang, 500)

          i18n.setLocaleMessage(lang, LangZhCN)
      })
    }
    window.getServeLang()
}
$ajax.get(Config.url+'/api/v2/user/gtCaptcha').then(()=>{  //预请求规避首次请求失败情况
  init()
})
setTimeout(()=>{ //接口请求失败补偿机制
  !window.vm && init()
},6000)








