// 商品分类api接口
import axios from "~/axios.js";

// 商品分类列表
export function getCategoryList(){
  return axios.get('/admin/category')
}
// 新增商品列表接口
export function createCategory(data){
  return axios.post('/admin/category',data)
}
// 修改商品接口
export function updateCategory(id,data){
  return axios.post('/admin/category/'+id,data)
}
// 修改商品权限状态接口
export function updateCategoryStatus(id,status){
  return axios.post(`/admin/category/${id}/update_status`,{status})
}
// 删除商品分类
export function deleteCategory(id){
  return axios.post(`/admin/category/${id}/delete`)
}
// 分类关联产品列表
export function getCategoryGoods(id){
  return axios.get(`/admin/app_category_item/list?category_id=${id}`)
}
// 删除关联产品
export function deleteCategoryGoods(id){
  return axios.post(`/admin/app_category_item/${id}/delete`)
}
// 关联产品
export function connectCategoryGoods(data){
  return axios.post(`/admin/app_category_item`,data)
}