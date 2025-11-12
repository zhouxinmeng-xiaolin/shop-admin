// 此文件是自己写的axios文件
// 引入axios
import axios from "axios";
// 引入错误捕获用到的方法
import { ElNotification } from 'element-plus'
// 用于存储token,要使用vueuse中的useCookie
import { useCookies } from '@vueuse/integrations/useCookies'
// 引入封装cookie
import { getToken } from '~/composables/auth'
// 引入消息提示封装
import { toast } from '~/composables/util'
import store from "./store";
// 创建实例----可以看axios官方文档
const service = axios.create({
  // 写到域名就可以，因为前面都是一样的
  baseURL: '/api'
})
// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
  // 在发送请求之前做些什么
  // 给header添加token
  // 给header
  config.headers['token'] = getToken()
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
  // 对响应数据做点什么,
  // 对于login页面想要对token进行存储
  return response.request.responseType == 'blob'?response.data: response.data.data;
}, function (error) {
  // 对响应错误做点什么
  const msg = error.response.data.msg || '请求失败'
  if (msg == "非法token，请先登录！") {//就退出登录
    store.dispatch('logout').finally(() => location.reload())
  }
  toast(msg, 'error')
  return Promise.reject(error);
});
// 暴露
export default service












