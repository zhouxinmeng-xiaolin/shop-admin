// 分销模块
// 引入query转换为url参数
import {queryParmas} from '~/composables/util.js'
import axios from "~/axios";
export function getAgentStatistics(){
  return axios.get('admin/agent/statistics')
}

// 分销列表接口
export function getAgentList(page,query={}){
  let r = queryParmas(query)
  return axios.get(`/admin/agent/${page}${r}`)
}
// 推广订单列表
export function getAgentOrderList(page,query={}){
  let r = queryParmas(query)
  return axios.get(`/admin/user_bill/${page}${r}`)
}
// 获取分销设置
export function getConfig(){
  return axios.get(`/admin/distribution_setting/get`)
}
// 修改分销设置
export function setConfig(data){
  return axios.post(`/admin/distribution_setting/set`,data)
}