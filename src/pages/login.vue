<!-- 该文件是写登录页面的 -->

<template>
  <!-- 加背景颜色  设置最低高度-->
  <!-- 最大的盒子 -->
  <el-row class="login-container">
    <!-- 通过基础的 24 分栏，迅速简便地创建布局。
     flex items-center justify-center将文字盒子进行水平垂直居中
    -->
    <!-- 左边盒子 -->
    <!-- 响应式布局lg	≥1200px 时就让它保持左边占16，右边占8
       md	≥992px时让它保持左边占12，右边占12
      -->
    <el-col :lg="16" :md="12" class="left">
      <div>
        <!-- text-left text-light-50 text-5xl font-bold mb-4
            分别设置字体左靠齐，字体颜色，字体大小，字体粗细 下边距0.25rem=1px-->
        <div>欢迎光临</div>
        <div>此站点《vue3+vite实战商城后台开发》视频课程的演示地址，
          <a href="" class="font-bold">点击立即学习</a>
        </div>
      </div>
    </el-col>
    <!-- 右边背景颜色为白色 -->
    <!-- 右边盒子 -->
    <!-- flex-col设置flex方向为垂直方向 -->
    <el-col :lg="8" :md="12" class="right">
      <h2 class="title">欢迎回来</h2>
      <!-- my-5垂直方向即上下方向离其他组件的距离 -->
      <div>
        <!-- 线可以通过设置宽高来做class="h-[1px] w-16 bg-gray-400" -->
        <span class="line "></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>
      <!-- 表单框 -->
      <!-- 添加表单验证
        1.先在el-form中绑定rules规则 
        2.在el-form-item添加prop=rules里的key值
        3.写验证规则
        触发登录时表单验证：
        1.el-form定义ref
        2.让ref变为响应式，使用ref定义
        3.调用validate-->

      <el-form :model="form" class="w-[250px]" :rules="rules" ref="formRef">
        <!-- 用户名框 -->
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <!-- 使用插槽版本的图标 -->
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 密码框 -->
        <el-form-item prop="password">
          <!-- show-password就是密码框后面的眼睛 -->
          <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password>
            <!-- 使用插槽版本的图标  prefix代表图标放在前面 -->
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round @click="onSubmit" class="w-[250px]" color="#626aef"
            :loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<!-- setup语法糖 -->
<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
// 用于跳转页面，从vue-router中引入useRouter
import { useRouter } from 'vue-router'
// 用于存储token,要使用vueuse中的useCookie
import { useCookies } from '@vueuse/integrations/useCookies'
// 引入消息提示封装方法
import { toast } from '~/composables/util'
// 从vuex中引入useStore,用于共享数据
import { useStore } from 'vuex'
// 防止用户重复点击登录
const loading = ref(false)
// 拿到useRouter
const router = useRouter()
// 拿到useCookies
const cookie = useCookies()
// 拿到useStore
const store = useStore()
const form = reactive({
  // 用户名和密码
  username: '',
  password: ''
})
// rules里的key要和form里的key相同
const rules = {
  username: [
    {
      required: true, //这是必填项
      message: '用户名不能为空', //写自定义验证提示信息
      trigger: 'blur' //代表元素失去焦点
    },
  ],//[]里面装的是校验规则
  password: [
    {
      required: true, //这是必填项
      message: '密码不能为空', //写自定义验证提示信息
      trigger: 'blur' //代表元素失去焦点
    },
  ]
}
const formRef = ref(null)//定义为响应式
// console.log(formRef);

const onSubmit = () => {
  // 手动触发表单验证
  // validate(valid)：表单组件实例上的一个验证方法
  // valid是布尔值
  formRef.value.validate((valid) => {
    // 这里valid为false
    console.log(valid);
    if (!valid) {//验证不成功情况
      alert('密码和用户名不能为空')
      return false
    }
    // 数据提交前将值改为true
    loading.value = true
    //验证成功就得将数据提交

    store.dispatch('login', form).then((res) => {
      toast('登录成功')
      router.push("/")
    }).finally(() => {
      loading.value = false
    })
    // 调用后端登录功能->.then接收登录成功->提示登录成功->存储token->跳转页面到首页
    // login(form.username,form.password)
    // .then((res)=>{
    //   //  console.log(res.data.data.token)
    //   // 提示成功
    //   toast('登录成功')
    //     // 存储token
    //       setToken(res.token)
    //     // 获取用户相关信息---刷新界面时会消失--使用vuex action解决
    //     // 跳转到后台首页:要使用vue-router中的useRouter方法里的push
    //       router.push("/")
    // })
    // .finally(()=>{
    //   loading.value=false
    // })

  })
}
//  监听回车事件
function onKeyUp(e) {
  // console.log(e);
  // 当e.key=enter，才进行提交登录
  if (e.key == 'Enter') {
    onSubmit()
  }

}
// 添加键盘监听
// 在页面渲染完毕前添加监听事件
onMounted(() => {
  document.addEventListener('keyup', onKeyUp)
})
// 在卸载前清除监听事件
onBeforeUnmount(() => {
  document.removeEventListener('keyup', onKeyUp)
})



</script>

<style>
/* 抽离class样式 */
.login-container {
  @apply bg-indigo-500 min-h-screen;
}

.login-container .left,
.login-container .right {
  @apply flex items-center justify-center;
}

.login-container .right {
  @apply bg-light-50 flex-col;
}

.left>div>div:first-child {
  @apply text-left text-light-50 text-5xl font-bold mb-4;
}

.left>div>div:last-child {
  @apply text-gray-200;
}

.right .title {
  @apply text-gray-800 font-bold text-2xl;
}

.right>div {
  @apply text-sm text-gray-300 flex items-center content-center space-x-2 my-5;
}

.right .line {
  @apply h-[1px] w-16 bg-gray-200;
}
</style>