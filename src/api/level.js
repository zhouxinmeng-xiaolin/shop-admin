// 会员等级接口
import axios from "~/axios.js";

// 会员等级列表接口
export function getUserLevelList(page){
  return axios.get(`/admin/user_level/${page}`)
}
// 会员等级新增接口
export function createUserLevelList(data){
  return axios.post('/admin/user_level',data)
}
// 修改会员等级接口
export function updateUserLevelList(id,data){
  return axios.post(`/admin/user_level/${id}`,data)
}
// 删除会员等级接口
export function deleteUserLevelList(id){
  return axios.post(`/admin/user_level/${id}/delete`)
}
// 修改会员等级状态接口
export function updateUserLevelStatus(id,status){
  return axios.post(`/admin/user_level/${id}/update_status`,{status})
}
