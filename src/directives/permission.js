// 用于实现按钮 / 元素权限控制
// 通过自定义指令 v-permission 控制页面中按钮、菜单等元素的显示 / 隐藏
// 该方法用于判断是否有别名，hasPermission 方法校验当前用户是否有权限
function hasPermission(value,el=false){
  // 如果不是数组
  if(!Array.isArray(value)){
    throw new Error(`需要配置权限，例如v-permission="['getStatistics3,GET']"`)
  }
}
// 1.定义 v-permission 指令，在元素挂载时校验权限：
export default{
  install(app){
    // console.log(app)
    app.directive("permission",{
      mounted(el,binding) {
        // 数据
        hasPermission(binding.value,el)    
      },
    })
  }
}