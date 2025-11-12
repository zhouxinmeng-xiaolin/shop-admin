<!-- 该组件是用来封装抽屉的 -->
<template>
  <el-drawer v-model="showDrawer" :title="title" :size="size" :close-on-click-modal="false"
    :destroy-on-close="destroyOnClose">
    <div class="formDrawer">
      <div class="body">
        <slot></slot>
      </div>
      <div class="actions">
        <!-- 点击提交要向外暴露提交事件---使用defineEmits -->
        <el-button type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
        <el-button type="default" @click="close">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
// 定义控制抽屉的状态
const showDrawer = ref(false)

// 使用defineProps对外暴露属性
const props = defineProps({
  title: {
    type: String,
  },
  size: {
    type: String,
    default: '45%'
  },
  // 控制是否在关闭 Drawer 之后将子元素全部销毁
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  // 提交按钮
  confirmText: {
    type: String,
    default: '提交'
  }
})

const loading = ref(false)
// 向外暴露提交事件
const emit = defineEmits(["submit"])
const submit = () => emit("submit")

// 封装打开方法
const open = () => showDrawer.value = true

// 封装关闭方法
const close = () => showDrawer.value = false

// 显示提交按钮loading
const showLoading = () => loading.value = true
// 隐藏提交按钮loading
const hideLoading = () => loading.value = false
// setup中的方法是封闭的需要进行暴露
defineExpose({
  open,
  close,
  showLoading,
  hideLoading
})

</script>

<style>
.formDrawer {
  width: 100%;
  height: 100%;
  @apply flex flex-col;
  position: relative;
}

.formDrawer .body {
  /* 子绝父相 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  flex: 1;
  overflow-y: auto;
}

.formDrawer .actions {
  height: 50px;
  /* 有两个子 */
  @apply mt-auto flex items-center;

}
</style>