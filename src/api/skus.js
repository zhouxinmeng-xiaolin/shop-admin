// 规格管理接口
import axios from "~/axios.js";

// 规格列表接口
export function getSkusList(page){
  return axios.get(`/admin/skus/${page}`)
}
// 规格新增接口
export function createSkusList(data){
  return axios.post('/admin/skus',data)
}
// 规格修改接口
export function updateSkusList(id,data){
  return axios.post(`/admin/skus/${id}`,data)
}
// 规格删除接口
export function deleteSkusList(ids){
  // 确保传的是数组
  ids = !Array.isArray(ids)?[ids]:ids
  return axios.post('/admin/skus/delete_all',{ids})
}
// 修改规格状态接口
export function updateSkusStatus(id,status){
  return axios.post(`/admin/skus/${id}/update_status`,{status})
}
