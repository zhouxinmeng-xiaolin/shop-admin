// 简化FTagList文件的标签代码
import { ref } from 'vue'
import {useRoute,onBeforeRouteUpdate} from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import {router} from '~/router'

export function useTabList(){
const route = useRoute()
const cookie = useCookies()
// 拿到当前的路径
const activeTab = ref(route.path)
const tabList = ref([
  {
    title: '后台首页',
    path: '/',
  },
    
])
// 初始化标签导航列表：从cookie中取tabList->如果有就给tabList.value赋值
// 这段代码的作用，用大白话讲就是：“页面刚打开的时候，先看看之前有没有把标签栏的内容存
// 在浏览器里，如果有就直接拿出来用，没有就不管了”，
// 刷新页面，标签不丢失（Cookie 持久化）靠initTabList函数实现
function initTabList(){
  let tbs = cookie.get("tabList")
  // 如果有就赋值
  if(tbs){
    tabList.value = tbs
  }
}
initTabList()
// 添加路由方法
function addTab(tab){
  // 使用findIndex方法查看tablist之前有没有添加方法
 let noTab = tabList.value.findIndex((t)=>t.path==tab.path) == -1//表示没有添加
 if(noTab){
  tabList.value.push(tab)//添加
 }
//  添加到cookie---使用cookieStore.set方法
cookie.set('tabList',tabList.value)

}

// 使用onBeforeRouteUpdate进行监听
onBeforeRouteUpdate((to,from)=>{
  // 使其处于激活状态
  activeTab.value = to.path
  // console.log(to);
  //1. 拿到title和path
  // console.log({
  //   title:to.meta.title,
  //   path:to.path
  // });
  // 2.添加路由
   addTab({
     title:to.meta.title,
     path:to.path
   })
})

// 实现点击tab就跳转到对应页面
const changeTab = (t) =>{
  // console.log(t);---t代表点击tab的路径
  // 让当前激活状态等于t
  activeTab.value = t
  // 跳转使用router.push
  router.push(t)
  
}
// <!-- 关闭标签导航功能：
// 1.点击关闭
// (1)拿到当前激活状态的值，判断关闭的标签是否为当前激活的那一个
// (2)如果是就要拿到下一个或上一个
// ->自动跳转到下一个标签->关闭最后一个自动切换到上一个
//  -->
const removeTab = (t) => {
  // console.log(t);点击关闭就可以拿到关闭页面的path值
  // 定义接收导航的数组
  const tabArr = tabList.value   
  // 1.拿激活状态值
  let a = activeTab.value
  // 判断当前要删除的是不是激活的值
  if(a == t){
  // 遍历数组tab,index当前标签导航对象和标签索引
  tabArr.forEach((tab,index)=>{
    if(tab.path == t){//如果路径相同
      // 就去拿删除标签的上一个和下一个
      const nextTab = tabArr[index+1] || tabArr[index-1]
      if(nextTab){//如果有下一个和上一个，就将下一个或下一个设置为激活状态
        a = nextTab.path
        // 跳转页面
        router.push(a) 
        // 过滤,,只有不等于当前关闭的才能留下来
        tabList.value = tabList.value.filter((tab)=>tab.path != t)
        // 存储在cookie中
        cookie.set('tabLIst',tabList.value)
      }
    }
  })
}
// 去修改当前激活状态的值
activeTab.value = a
}

// 实现在下拉菜单中关闭其他和关闭所有标签的功能：
// 1.给下拉选项使用command
// 2.在下拉菜单绑定command事件，进行回调
// 3.
const handleClose = (cmd)=>{
  console.log(cmd);
  // 清除所有就将标签激活状态切换回首页，并且将标签过滤为只剩首页
  if(cmd==="clearAll"){
    activeTab.value = '/'
    router.push('/')
    // 标签过滤为只剩首页
    tabList.value = [{
      title: '后台首页',
      path: '/',
    }]
  }else if(cmd==="clearOther"){
    // 过滤只剩下首页和当前激活页
    // filter是筛选满足条件的保留下来,筛选完记得赋值给原数组
   tabList.value = tabList.value.filter((tab)=> tab.path === '/' || tab.path === activeTab.value)
  }
  // 更新存储
  cookie.set('tabList',tabList.value)
}
return {
  activeTab,
  tabList,
  changeTab,
  removeTab,
  handleClose
}
}