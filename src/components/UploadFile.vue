<!-- 该组件封装拖拽上传文件功能 -->
<template>
  <!-- action是接口地址 -->
  <el-upload drag :action="uploadImageAction" multiple :headers="{ token }" name="img" :data="data"
    :on-success="uploadSuccess" :on-error="uploadError">
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import { uploadImageAction } from '~/api/image.js'
// 引入获取token
import { getToken } from "~/composables/auth.js"
// 引入提示
import { toast } from '~/composables/util.js'
const token = getToken()
// const token = " "

// 上传成功就将消息传给父组件
const emit = defineEmits(["success"])
// 上传·成功
const uploadSuccess = (response, uploadFile, uploadFiles) => {
  console.log(response)//成功结果
  emit("success", {
    response, uploadFile, uploadFiles
  })
}
// 上传失败
const uploadError = (error, uploadFile, uploadFiles) => {
  let msg = JSON.parse(error.message).msg || "上传失败"
  toast(msg, "error")
}
defineProps({
  data: Object
})
</script>

<style></style>