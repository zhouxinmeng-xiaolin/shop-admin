import axios from "~/axios";
// 引入query转换为url参数
import {queryParmas} from '~/composables/util.js'
// 用户列表接口
export function getUserList(page,query={}){
  let r = queryParmas(query)
  return axios.get(`/admin/user/${page}${r}`)
}
// 修改用户状态接口
export function updateUserStatus(id,status){
  return axios.post(`/admin/user/${id}/update_status`,{status})
}
//增加用户接口
export function createUser(data){
  return axios.post('/admin/user',data)
}
//修改用户接口
export function updateUser(id,data){
  return axios.post(`/admin/user/${id}`,data)
}
//删除用户接口
export function deleteUser(id){
  return axios.post(`/admin/user/${id}/delete`)
}