// 商品管理接口
// 引入axios实例
import axios from "~/axios";
// 引入query转换方法
import {queryParmas} from '~/composables/util.js'

// 商品列表接口
// query是可选参数（比如有时候不需要传 keyword），直接拼接会出现问题：
export function getGoodsList(page,query={}){
  let r = queryParmas(query)
  
  return axios.get(`/admin/goods/${page}${r}`)
}
// 批量上架下架
export function updateGoodsStatus(ids,status){
  return axios.post(`/admin/goods/changestatus`,{ids,status})
}
//增加商品接口
export function createGoods(data){
  return axios.post('/admin/goods',data)
}
//修改商品接口
export function updateGoods(id,data){
  return axios.post(`/admin/goods/${id}`,data)
}
//删除商品接口
export function deleteGoods(ids){
  return axios.post(`/admin/goods/delete_all`,{ids})
}
// 批量恢复商品接口
export function restoreGoods(ids){
  return axios.post(`/admin/goods/restore`,{ids})
}
//彻底删除商品接口
export function destroyGoods(ids){
  return axios.post(`/admin/goods/destroy`,{ids})
}
// 查看商品资料接口
export function readGoods(id){
  return axios.get(`/admin/goods/read/${id}`)
}
// 设置商品轮播图接口
export function setGoodsBanner(id,data){
  return axios.post(`/admin/goods/banners/${id}`,data)
}
// 更新商品规格接口
export function updateGoodsSkus(id,data){
 return  axios.post(`/admin/goods/updateskus/${id}`,data)
} 
// 添加商品规格
export function createGoodsSkusCard(data){
 return  axios.post(`/admin/goods_skus_card`,data)
} 
// 修改商品规格选项接口
export function updateGoodsSkusCard(id,data){
 return  axios.post(`/admin/goods_skus_card/${id}`,data)
} 
// 删除商品规格选项接口
export function deleteGoodsSkusCard(id){
 return  axios.post(`/admin/goods_skus_card/${id}/delete`)
} 

// 排序商品规格选项接口
export function sortGoodsSkusCard(data){
 return axios.post(`/admin/goods_skus_card/sort`,data)
} 
// 添加商品规格的值
export function createGoodsSkusCardValue(data){
 return  axios.post(`/admin/goods_skus_card_value`,data)
} 
// 修改商品规格的值
export function updateGoodsSkusCardValue(id,data){
 return  axios.post(`/admin/goods_skus_card_value/${id}`,data)
} 
// 删除商品规格的值
export function deleteGoodsSkusCardValue(id){
 return  axios.post(`/admin/goods_skus_card_value/${id}/delete`)
} 
// 选择设置商品规格选项和值
export function chooseAndSetGoodsSkusCard(id,data){
  return axios.post(`/admin/goods_skus_card/${id}/set`,data)
}