// 用于图库分类的接口处理

import axios from "~/axios.js";
// 图库列表接口
export function getImageClassList(page){
  return axios.get('/admin/image_class/'+page)
}
// 增加图库分类接口
export function createImageClassList(data){
  return axios.post('/admin/image_class',data)
}
// 修改图库分类接口
export function updateImageClassList(id,data){
  return axios.post('/admin/image_class/'+id,data)
}
// 删除图库分类接口
export function deleteImageClassList(id){
  return axios.post(`/admin/image_class/${id}/delete`)
}