// 系统配置接口
import axios from "~/axios.js";
// 获取原有系统设置
export function getSysconfig(){
  return axios.get(`/admin/sysconfig`)
}
// 修改系统设置
export function setSysconfig(data){
  return axios.post(`/admin/sysconfig`,data)
}
// 上传文件
export const uploadAction  = "/api/admin/sysconfig/upload"