<template>
  <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
    <el-header class="image-header">
      <!-- 新增按钮 -->

      <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
      <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
    </el-header>
    <el-container>
      <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
      <ImageMain ref="ImageMainRef" />
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
// 引入侧边部分
import ImageAside from '~/components/ImageAside.vue';
// 引入内容部分
import ImageMain from '~/components/ImageMain.vue';

// 拿到整个页面高度或浏览器高度
const windowHeight = window.innerHeight || document.documentElement.clientHeight
const h = windowHeight - 64 - 44 - 40

// 侧边的打开抽屉方法
const ImageAsideRef = ref(null)
const ImageMainRef = ref(null)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()
const handleAsideChange = (image_class_id) => {
  // console.log(image_class_id);可以拿到分类id
  ImageMainRef.value.loadData(image_class_id)//根据当前激活状态的分类id进行加载图片
}

// 打开上传图片抽屉
const handleOpenUpload = () => {
  ImageMainRef.value.openUploadFile()
}
</script>

<style>
.image-header {
  @apply flex items-center;
  border-bottom: 1px solid #eeeeee;
}
</style>