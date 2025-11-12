// 订单模块
import axios from "~/axios";
// 引入query转换为url参数
import {queryParmas} from '~/composables/util.js'
// 订单列表接口
export function getOrderList(page,query={}){
  let r = queryParmas(query)
  return axios.get(`/admin/order/${page}${r}`)
}
//删除订单接口
export function deleteOrder(ids){
  return axios.post(`/admin/order/delete_all`,{ids})
}
// 导出订单接口
export function exportOrder(query={}){
  let r = queryParmas(query)
  return axios.post(`/admin/order/excelexport${r}`,{},{
    // 告诉 Axios，后端返回的不是普通文字（比如 JSON、字符串），
    // 而是一个 “二进制文件”（像 Excel、图片、PDF 这些），你要按文件的格式来接收。
    responseType:'blob'
  })
}
// 查看订单物流信息
export function getShipInfo(id){
  return axios.get(`/admin/order/${id}/get_ship_info`)
}
// 拒绝or同意退款
export function refundOrder(id,data){
  return axios.post(`/admin/order/${id}/handle_refund`,data)
}