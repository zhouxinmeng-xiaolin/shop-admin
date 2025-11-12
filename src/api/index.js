// 此文件是后台首页接口交互模块



// 第一步：引入axios
import axios from "~/axios";
// 第二步：写接口方法(记得暴露)
export function getStatistics1(){
  // 记得返回
  return axios.get('/admin/statistics1')
}
// 后台统计3
export function getStatistics3(type){
  // 记得返回
  return axios.get('/admin/statistics3?type='+type)
}

// 后台统计2
export function getStatistics2(type){
  // 记得返回
  return axios.get('/admin/statistics2')
}