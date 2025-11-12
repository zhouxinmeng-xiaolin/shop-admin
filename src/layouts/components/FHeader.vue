<template>
  <div class="f-header">
    <!-- 左边 -->

    <span class="logo">
      <el-icon class="mr-1">
        <ElemeFilled />
      </el-icon>
      喵喵编程
    </span>
    <!-- 折叠图标 -->
    <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
      <!-- 全屏状态时的折叠图标 -->
      <Fold v-if="$store.state.asideWidth == '250px'" />
      <Expand v-else />
    </el-icon>
    <!-- 刷新 -->
    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon class="icon-btn" @click="handleRefresh">
        <Refresh />
      </el-icon>
    </el-tooltip>

    <!-- 右边 -->
    <div class="ml-auto flex items-center justify-center">
      <!-- 全屏 -->
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <el-icon class="icon-btn" @click="toggle">
          <!-- 不是全屏状态用全屏图标 -->
          <FullScreen v-if="!isFullscreen" />
          <Aim v-else />
        </el-icon>

      </el-tooltip>
      <!-- 下拉菜单 -->
      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="flex items-center">
          <el-avatar class="mr-2" :size="30" :src="$store.state.user.avatar" />
          {{ $store.state.user.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <!-- 下拉内容 -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>

          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <!-- 修改密码抽屉框 -->
  <!-- formDrawerRef是子组件创建暴露的，父组件通过ref就可以调用 -->
  <FormDrawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
    <div style="height: 1000px;">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" size="small">
        <!-- 旧密码框 -->
        <el-form-item prop="oldpassword" label="旧密码">
          <!-- show-password就是密码框后面的眼睛 -->
          <el-input type="password" v-model="form.oldpassword" show-password placeholder="请输入旧密码">
          </el-input>
        </el-form-item>
        <!-- 新密码框 -->
        <el-form-item prop="password" label="新密码">
          <!-- show-password就是密码框后面的眼睛 -->
          <el-input type="password" v-model="form.password" show-password placeholder="请输入新密码">
          </el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="repassword" label="确认密码">
          <!-- show-password就是密码框后面的眼睛 -->
          <el-input type="password" v-model="form.repassword" show-password placeholder="请输入确认密码">
          </el-input>
        </el-form-item>
      </el-form>

    </div>
  </FormDrawer>

</template>

<script setup>
// 引入封装抽屉
import FormDrawer from '~/components/FormDrawer.vue'
// 引入跳转页面useRouter
import { useRouter } from 'vue-router'
// 引入useStore
import { useStore } from 'vuex'
// 实现全屏功能
import { useFullscreen } from '@vueuse/core'
// 引入修改密码,退出登录
import { useRePassword, useLogout } from '~/composables/useManager'

const {
  // 是否全屏状态
  isFullscreen,
  // 切换全屏
  toggle
} = useFullscreen()

// 使用useRePassword
const {
  formDrawerRef,
  form,
  rules,
  formRef,
  onSubmit,
  openRePassword
} = useRePassword()

const {
  handleLogout
} = useLogout()

// 接收useRouter
const router = useRouter()
const store = useStore()



function handleCommand(e) {
  // console.log(e);
  switch (e) {
    case "logout":
      handleLogout()
      break;
    case "rePassword":
      // showDrawer.value=true
      openRePassword()
      break;
  }

}
// 实现刷新功能
function handleRefresh() {
  location.reload()
}



</script>

<style>
.f-header {
  @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
  z-index: 1000;
}

.logo {
  width: 250px;
  @apply flex items-center justify-center text-lg font-thin;
}

.icon-btn {
  @apply flex items-center justify-center;
  width: 42px;
  height: 64px;
  /* 鼠标指上去有手型 */
  cursor: pointer;
}

.icon-btn:hover {
  @apply bg-indigo-600;
}

.f-header .dropdown {
  height: 64px;
  cursor: pointer;
  @apply flex items-center justify-center text-light-50 mx-5;
}
</style>