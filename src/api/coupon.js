// 该js文件用于优惠券模块的接口
import axios from "~/axios.js";

// 优惠券列表接口
export function getCouponList(page){
  return axios.get(`/admin/coupon/${page}`)
}
// 优惠券新增接口
export function createCouponList(data){
  return axios.post('/admin/coupon',data)
}
// 修改优惠券接口
export function updateCouponList(id,data){
  return axios.post(`/admin/coupon/${id}`,data)
}
// 删除优惠券接口
export function deleteCouponList(id){
  return axios.post(`/admin/coupon/${id}/delete`)
}
// 失效优惠券
export function updateCouponStatus(id){
  return axios.post(`/admin/coupon/${id}/update_status`,{
    status:0

  })
}
