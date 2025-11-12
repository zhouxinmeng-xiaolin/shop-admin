import axios from "~/axios";
// 引入query转换为url参数
import {queryParmas} from '~/composables/util.js'
// 评论列表接口
export function getGoodsCommentList(page,query={}){
  let r = queryParmas(query)
  return axios.get(`/admin/goods_comment/${page}${r}`)
}
// 修改评论状态接口
export function updateGoodsCommentStatus(id,status){
  return axios.post(`/admin/goods_comment/${id}/update_status`,{status})
}
// 回复商品评价接口
export function reviewGoodsComment(id,data){
  return axios.post(`/admin/goods_comment/review/${id}`,{data})
}
