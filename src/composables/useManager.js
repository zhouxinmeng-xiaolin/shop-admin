//  该文件是使用Vue 3 中的组合式函数（Composition Function） 进行代码简化


import { ref, reactive } from 'vue'
// 引入退出登录接口文件
import { logout, updatepassword } from '~/api/manager'
// 引入跳转页面useRouter
import { useRouter } from 'vue-router'

// 引入useStore
import { useStore } from 'vuex'
import { toast } from '~/composables/util'
// 引入封装的登录框
import { showModal } from '~/composables/util'
// 修改密码
export function useRePassword() {
  // 接收useRouter
  const router = useRouter()
  const store = useStore()
  // 修改密码
  // 抽屉
  const formDrawerRef = ref(null)
  const form = reactive({
    // 用户名和密码
    oldpassword: '',
    password: '',
    repassword: '',
  })
  // rules里的key要和form里的key相同
  const rules = {
    oldpassword: [
      {
        required: true, //这是必填项
        message: '旧密码不能为空', //写自定义验证提示信息
        trigger: 'blur' //代表元素失去焦点
      },
    ],//[]里面装的是校验规则
    password: [
      {
        required: true, //这是必填项
        message: '新密码不能为空', //写自定义验证提示信息
        trigger: 'blur' //代表元素失去焦点
      },
    ],
    repassword: [
      {
        required: true, //这是必填项
        message: '确认密码不能为空', //写自定义验证提示信息
        trigger: 'blur' //代表元素失去焦点
      },
    ],
  }
  const formRef = ref(null)//定义为响应式
  // console.log(formRef);

  const onSubmit = () => {
    // 手动触发表单验证
    // validate(valid)：表单组件实例上的一个验证方法
    // valid是布尔值
    formRef.value.validate((valid) => {
      // console.log(valid);   这里valid为false
      if (!valid) {//验证不成功情况
        return false
      }
      // 数据提交前将值改为true
      formDrawerRef.value.showLoading()
      //验证成功就得将数据提交

      updatepassword(form).then((res) => {
        toast('修改密码成功，请重新登录')
        // 退出登录，清除token
        store.dispatch('logout')
        router.push("/login")

      }).finally(() => {
        formDrawerRef.value.hideLoading()
      })
    })
  }
  const openRePassword = () => formDrawerRef.value.open()
  return {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRePassword
  }
}

// 退出登录
export function useLogout() {
  // 接收useRouter
  const router = useRouter()
  const store = useStore()
  function handleLogout() {
    // 1.弹出退出登录框----then退出登录成功
    showModal("是否要退出登录？", "warning")
      // 点击确定时都结果
      .then((res) => {
        // 无论退出成功与否都要执行清除token
        logout()
          .finally(() => {

            store.dispatch('logout')
            // 2.退出登录--清除token

            // 3.清理用户信息

            // 4.跳转到登录页面---使用
            router.push('/login')
            //  5.提示退出成功
            toast('成功退出')
          })
      })
  }
  return {
    handleLogout
  }
}