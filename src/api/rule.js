// 该js文件用于菜单权限的接口
import axios from "~/axios.js";

// 菜单列表接口
export function getRuleList(){
  return axios.get('/admin/rule/1')
}
// 新增菜单列表接口
export function createRule(data){
  return axios.post('/admin/rule',data)
}
// 修改菜单接口
export function updateRule(id,data){
  return axios.post('/admin/rule/'+id,data)
}
// 修改菜单权限状态接口
export function updateRuleStatus(id,status){
  return axios.post(`/admin/rule/${id}/update_status`,{status})
}
// 删除菜单权限状态接口
export function deleteRule(id){
  return axios.post(`/admin/rule/${id}/delete`)
}