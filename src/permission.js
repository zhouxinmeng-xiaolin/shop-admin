// 本文件是用于处理权限校验的
// 该文件是放全局都会使用的方法

// 引入路由
import { router, addRoutes } from "~/router"
// 引入获取token
import { getToken } from "~/composables/auth"
// 引入消息提示
import { toast, showFullLoading, hideFullLoading } from "~/composables/util"
import store from "./store"

// 解决加载慢的问题--没有在调用getinfo之前就改为false--防止重复性加载getinfo
let hasGetInfo = false
// 全局前置路由----初始化时就会进行权限校验
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  showFullLoading()
  // console.log(to, from);
  // 1.要验证是否通过登录进入主页---是否有token，没有将强制返回登录页面
  const token = getToken()//获取token
  if (!token && to.path != '/login') {//如果没有token并且去的路径还不是登录页面
    toast('请先登录', 'error')
    return next({ path: '/login' })//强制回登录页
  }
  // 2.防止重复登录---有token并且to.path还是登录页面---就要强制去主页
  if (token && to.path == '/login') {
    toast('请勿重复登录', 'error')
    return next({ path: from.path ? from.path : '/' })//如果有frompath就回去，没有就去主页
  }
  // 如果登录成功就在放行前将用户信息进行存储在vuex
  let hasNewRoutes = false
  // GeiInfo为true的时候加载
  if (token && !hasGetInfo) {//异步操作
    let { menus } = await store.dispatch('getInfo')
    // 加载完后将hasGetInfo设置为true
    hasGetInfo = true
    // 动态添加路由
    hasNewRoutes = addRoutes(menus)
  }

  // console.log(to.meta.title);
  document.title = (to.meta.title ? to.meta.title : "") + "-喵喵编程商城后台"

  // 其他情况要放行！！！！
  hasNewRoutes ? next(to.fullpath) : next()
})

// 全局后置路由
router.afterEach((to, from) => hideFullLoading())

