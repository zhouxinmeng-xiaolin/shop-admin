import axios from "~/axios";
// 指定分类下的图片列表
export function getImageList(id,page=1){
  return axios.get(`/admin/image_class/${id}/image/${page}`)
}
// 修改图片
export function updateImage(id,name){
  return axios.post(`/admin/image/${id}`,{name})
}
// 删除图片   ids是数组
export function deleteImage(ids){
  return axios.post('/admin/image/delete_all',{ids})
}
// 导出上传图片的api接口地址
export const uploadImageAction = "/api/admin/image/upload"