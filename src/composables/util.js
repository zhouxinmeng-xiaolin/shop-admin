// 封装提示方法
// 引入
import { ElNotification ,ElMessageBox,ElMessage} from 'element-plus'
// 引入退出登录所需方法
// 引入进度条方法
import nprogress from 'nprogress'

// 消息提示
export function toast(message, type = 'success', dangerouslyUseHTMLString = false) {
  ElNotification({
    message,
    type,
    duration: 3000,
  })
}

// 退出登录方法封装并暴露
export function showModal(text = "", type = "", title) {
  return ElMessageBox.confirm(
    text,
    title,
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type,
    }
  )
}

// 开启全局loading ----全局进度条
export function showFullLoading() {
  nprogress.start()//开启
}
// 隐藏全局loading-----
export function hideFullLoading() {
  nprogress.done()//隐藏
}

// 弹出输入框
export function showPrompt(tip,value=""){
    return ElMessageBox.prompt(tip,'', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue:value
  })
}

// 将query对象转成url参数
export function queryParmas(query){
  let q = []// 定义一个空数组，用来存处理后的查询条件
     // 遍历 query 对象的每个属性（比如 key 先取到 'limit'，再取到 'keyword'）
    for(const key in query){
      q.push(`${key}=${encodeURIComponent(query[key])}`)
       // 把属性名和值拼成 "key=值" 的形式，比如 "limit=10"、"keyword=ceshi"
       // encodeURIComponent 是为了处理特殊字符（比如关键词有空格或中文时转成浏览器能识别的格式）
      //  循环结束后，q 数组会变成 ["limit=10", "keyword=ceshi"]
    }
    let r = q.join("&")// 用 & 符号把数组元素连起来，变成 "limit=10&keyword=ceshi"
    r = r ? ("?"+r) : ""
    return r
}

// 排序方法
// 上移方法--往上挪位置
export function useArrayMoveUp(arr,index){
  swapArray(arr,index,index-1)
}
// 下移方法-往下挪位置
export function useArrayMoveDown(arr,index){
   swapArray(arr,index,index+1)
}

// 数组调换索引方法index1,index2：调换之前和调换之后的位置
function swapArray(arr,index1,index2){
  // 语法：`数组.splice(开始位置, 要删的个数, 要加的新元素)`---
  // arr.splice(index2,1,arr[index1])返回的是被删掉元素组成的数组
  // 如[1,2,3,4]->[2,1,3,4]:可以从索引号1开始，删除1个元素，加上索引为0的元素arr.splice(1,1,arr[0])
  // arr.splice(1,1,arr[0])此时arr[1,1,3,4],arr.splice(1,1,arr[0])返回[2]
  // arr[0]=arr.splice(1,1,arr[0])[0]
  arr[index1]= arr.splice(index2,1,arr[index1])[0]
  return arr
}

// sku排列算法
export function cartesianProductOf(){
  return Array.prototype.reduce.call(arguments,function(a,b){
    var ret = [];
    a.forEach(function (a){
      b.forEach(function (b){
        ret.push(a.concat([b]));
      });
    });
    return ret;
  },[
    []
  ])
}