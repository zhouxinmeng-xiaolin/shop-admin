<!-- 该组件封装搜索里的内容，如搜索框 -->
<template>
  <el-col :span="8" :offset="0">
    <!-- 关键字以后其他模块不一定叫该名字，所以可以使用props进行暴露，由父组件进行定义 -->
    <el-form-item :label="label">
      <!-- 输入框这部分可能是输入框、可能是下拉框，所以就用插槽接收 -->
      <slot />
    </el-form-item>
  </el-col>
</template>

<script setup>
defineProps({
  label: String
})
</script>

<style></style>