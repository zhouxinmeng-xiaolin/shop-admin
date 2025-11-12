// api里都是用于处理接口类的文件---管理员模块接口
// 引入axios实例
import axios from "~/axios";
// 引入query转换为url参数
import {queryParmas} from '~/composables/util.js'
// 登录页面需要向后端提交数据，使用post
// axios.post(url,data)
//定义登录方法，并暴露
// 看接口文档需要传入两个参数
export function login(username, password) {
  // 提供给后端,记得返回给login方法
  return axios.post('/admin/login', {
    // data里传接口文档body里写的需要传入数据
    username,
    password
  })
}
export function getInfo() {
  return axios.post('/admin/getinfo')
}
// 退出登录接口
export function logout() {
  return axios.post('/admin/logout')
}
// 修改密码
export function updatepassword(data) {
  return axios.post('/admin/updatepassword', data)
}
// 管理员列表接口
// query是可选参数（比如有时候不需要传 keyword），直接拼接会出现问题：
export function getManagerList(page,query={}){
  let r = queryParmas(query)
  return axios.get(`/admin/manager/${page}${r}`)
}
// 修改管理员状态接口
export function updateManagerStatus(id,status){
  return axios.post(`/admin/manager/${id}/update_status`,{status})
}
//增加管理员接口
export function createManager(data){
  return axios.post('/admin/manager',data)
}
//修改管理员接口
export function updateManager(id,data){
  return axios.post(`/admin/manager/${id}`,data)
}
//删除管理员接口
export function deleteManager(id){
  return axios.post(`/admin/manager/${id}/delete`)
}
