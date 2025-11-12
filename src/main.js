import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入路由器
import { router } from './router'
//引入图标
// 引入创建好的store
import store from './store'
// 引入权限文件
import './permission'
// 引入nprogress的css,实现切换时的loading,即加载页面进度条
import 'nprogress/nprogress.css'
const app = createApp(App)

// 使用路由器
app.use(router)
app.use(ElementPlus)
// 使用store
app.use(store)
// 使用图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
import 'virtual:windi.css'
import permission from '~/directives/permission.js'
app.use(permission)
app.mount('#app')
