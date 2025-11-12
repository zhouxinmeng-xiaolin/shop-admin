// 该文件专门用于创建整个应用路由器
// 当组件设置好后，就进行配置路由，就可以实现页面跳转
import {
  createRouter,
  createWebHashHistory
} from 'vue-router'


// 引入后台首页
import Index from '~/pages/index.vue'
// 引入about路由组件

import Login from '~/pages/login.vue'
// 引入404页面
import NotFound from '~/pages/404.vue'
// 引入admin页面
import Admin from '~/layouts/admin.vue'
// 引入goods下的list商品管理页面
import GoodList from '~/pages/goods/list.vue'
// 引入商品分类页面
import CategoryList from '~/pages/category/list.vue'
// 引入用户页面
import UserList from '~/pages/user/list.vue'
// 引入订单列表、
import OrderList from '~/pages/order/list.vue'
import CommentList from '~/pages/comment/list.vue'
import ImageList from '~/pages/image/list.vue'
import NoticeList from '~/pages/notice/list.vue'
import SettingList from '~/pages/setting/base.vue'
import CouponList from '~/pages/coupon/list.vue'
// 引入管理员
import ManagerList from '~/pages/manager/list.vue'
// 引入菜单权限
import AccessList from '~/pages/access/list.vue'
// 引入角色模块路由
import RoleList from '~/pages/role/list.vue'
// 引入商品规格
import SkusList from '~/pages/skus/list.vue'
// 引入会员等价
import LevelList from '~/pages/level/list.vue'
// 引入购买
import SettingBuy from '~/pages/setting/buy.vue'
// 引入物流
import SettingShip from '~/pages/setting/ship.vue'
// 引入分销员管理
import DistributionIndex from '~/pages/distribution/index.vue'
import DistributionSetting from '~/pages/distribution/setting.vue'
// 默认路由，所有组件都可以使用，所有人都能访问的”，比如登录页（/login）、404 页，主页
// 
const routes = [
  {
    // Admin是管布局的
    path: "/",
    name: 'admin',
    component: Admin,
  },
  {
    path: "/login",
    component: Login,
    meta: {
      title: '登录页'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
]
// 动态路由，用于匹配菜单动态添加路由
// 异步路由池）：存了所有 “需要权限控制的页面路由”（比如商品管理、用户管理、管理员管理），
// 相当于一个 “路由仓库”，不是所有人都能拿，要按权限取。
const asyncRouter = [
  {
    path: "/",
    component: Index,
    name: "/",
    meta: {
      title: '后台首页'
    }
  },
  {
    path: '/goods/list',
    name: '/goods/list',
    component: GoodList,
    meta: {
      title: '商品管理'
    }
  },
  {
    path: '/category/list',
    name: '/category/list',
    component: CategoryList,
    meta: {
      title: '商品分类'
    }
  },
  {
    path:'/user/list',
    name:'/user/list',
    component:UserList,
    meta:{
      title:'用户列表'
    }
  },
  {
    path:'/order/list',
    name:'/order/list',
    component:OrderList,
    meta:{
      title:'订单列表'
    }
  },
   {
    path:'/comment/list',
    name:'/comment/list',
    component:CommentList,
    meta:{
      title:'评价列表'
    }
  },
   {
    path:'/image/list',
    name:'/image/list',
    component:ImageList,
    meta:{
      title:'图库列表'
    }
  },
   {
    path:'/notice/list',
    name:'/notice/list',
    component:NoticeList,
    meta:{
      title:'公告列表'
    }
  },
   {
    path:'/setting/base',
    name:'/setting/base',
    component:SettingList,
    meta:{
      title:'配置'
    }
  },
  {
    path:'/coupon/list',
    name:'/coupon/list',
    component:CouponList,
    meta:{
      title:'优惠券列表'
    }
  },
  {
    path:'/manager/list',
    name:'/manager/list',
    component:ManagerList,
    meta:{
      title:'管理员管理'
    }
  },
   {
    path:'/access/list',
    name:'/access/list',
    component:AccessList,
    meta:{
      title:'菜单权限'
    }
  },
  {
    path:'/role/list',
    name:'/role/list',
    component:RoleList,
    meta:{
      title:'角色管理'
    }
  },
  {
    path:'/skus/list',
    name:'/skus/list',
    component:SkusList,
    meta:{
      title:'规格管理'
    }
  }, {
    path:'/level/list',
    name:'/level/list',
    component:LevelList,
    meta:{
      title:'会员等级'
    }
  },
  {
    path:'/setting/buy',
    name:'/setting/buy',
    component:SettingBuy,
    meta:{
      title:'支付设置'
    }
  },
   {
    path:'/setting/ship',
    name:'/setting/ship',
    component:SettingShip,
    meta:{
      title:'物流设置'
    }
  },
  {
    path:'/distribution/index',
    name:'/distribution/index',
    component:DistributionIndex,
    meta:{
      title:'分销员管理'
    }
  },
  {
    path:'/distribution/setting',
    name:'/distribution/setting',
    component:DistributionSetting,
    meta:{
      title:'分销员设置'
    }
  },
  
]

export const router = createRouter({
  // 哈希模式
  history: createWebHashHistory(),
  routes
})

// 动态添加路由----因为要一层层找和匹配所以要使用递归
// 这个 menus 是用户登录后，后端根据用户角色返回的 “菜单列表”（比如普通用户的 menus 里只有 “商品管理”“订单管理”，
// 管理员的 menus 里有所有菜单）。
export const addRoutes = (menus) => {
  // 是否有新的路由
  let hasNewRoutes = false
  // 要递归所以要写一个方法
  const FindAndAddRoute = (arr) => {
    // 遍历数组
    arr.forEach((e) => {
      // 找到路径一样的，路径一样有路由的话就不添加，没有就添加
      let item = asyncRouter.find((o) => o.path == e.frontpath)
      // 路径相同并且路由不存在
      if (item && !router.hasRoute(item.path)) {
        // 添加路由 router.addRoute("父亲路由名字"，子路由)
        router.addRoute("admin", item)
        hasNewRoutes = true
      }
      // 需要层层比较，如果有子路由
      if (e.child && e.child.length > 0) {
        FindAndAddRoute(e.child)
      }
    })
  }
  FindAndAddRoute(menus)
  return hasNewRoutes
}





