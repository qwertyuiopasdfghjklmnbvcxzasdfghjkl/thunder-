import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import modules from './modules'

const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Router.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

Vue.use(Router)

let home = [{path: '/', name: 'home', component: Home, meta: {nav: true}}] //首页
let nomatched = [{path: '*', redirect:'/'}] // 未知页面转向首页
let routes = home.concat(modules,nomatched)
export default new Router({
  routes:routes
})
