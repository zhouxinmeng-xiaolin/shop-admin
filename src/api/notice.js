// 该js文件用于公告部分的接口
import axios from "~/axios.js";

// 公告列表接口
export function getNoticeList(page){
  return axios.get(`/admin/notice/${page}`)
}
// 公告新增接口
export function createNoticeList(data){
  return axios.post('/admin/notice',data)
}
// 修改公告接口
export function updateNoticeList(id,data){
  return axios.post(`/admin/notice/${id}`,data)
}
// 删除公告接口
export function deleteNoticeList(id){
  return axios.post(`/admin/notice/${id}/delete`)
}