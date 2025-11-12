// 角色管理接口
import axios from "~/axios.js";

// 角色列表接口
export function getRoleList(page){
  return axios.get(`/admin/role/${page}`)
}
// 角色新增接口
export function createRoleList(data){
  return axios.post('/admin/role',data)
}
// 修改角色接口
export function updateRoleList(id,data){
  return axios.post(`/admin/role/${id}`,data)
}
// 删除角色接口
export function deleteRoleList(id){
  return axios.post(`/admin/role/${id}/delete`)
}
// 修改角色权限状态接口
export function updateRoleStatus(id,status){
  return axios.post(`/admin/role/${id}/update_status`,{status})
}
// 配置权限接口
export function setRoleRules(id,rule_ids){
  return axios.post('/admin/role/set_rules',{id,rule_ids})
}