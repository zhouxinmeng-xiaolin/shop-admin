<!-- 本组件用来封装上传图片功能 -->
<template>
  <!-- 图片预览 -->
  <div v-if="modelValue">
    <!-- 不能将数组直接赋值给src， -->
    <el-image v-if="typeof modelValue == 'string'" :src="modelValue" fit="cover"
      class="w-[100px] h-[100px] rounded border mr-2"></el-image>
    <!-- 如果是数组就需要循环遍历一个一个给 -->
    <div v-else class="flex flex-wrap">
      <div class="relative mx-1 mb-2 w-[100px] h-[100px]" v-for="(url, index) in modelValue" :key="index">
        <el-icon @click="removeImage(url)" class="absolute top-[5px] right-[5px] cursor-pointer bg-white rounded-full"
          style="z-index: 10;">
          <CircleClose />
        </el-icon>
        <!-- 图片 -->
        <el-image :src="url" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
      </div>
    </div>
  </div>
  <!-- 点击就可以弹出选择照片的框 -->
  <div class="choose-image-btn" @click="open">
    <el-icon :size="25" class="text-gray-500">
      <Plus />
    </el-icon>
  </div>
  <!-- dialogVisible"设为true就显示，否则就隐藏 -->
  <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
    <!-- 要将图库组件的侧边组件和内容组件引入 -->
    <el-container class="bg-white rounded" style="height: 70vh;">
      <el-header class="image-header">
        <!-- 新增按钮 -->
        <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
        <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
      </el-header>
      <el-container>
        <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
        <ImageMain ref="ImageMainRef" @choose="handleChoose" openChoose :limit="limit" />
      </el-container>
    </el-container>

    <template #footer>
      <span>
        <!-- 点击取消--设为false -->
        <el-button @click="close">取消</el-button>
        <!-- 点击确认--提交 -->
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { ref } from 'vue'
import { type } from 'windicss/utils';
// 引入侧边部分
import ImageAside from '~/components/ImageAside.vue';
// 引入内容部分
import ImageMain from '~/components/ImageMain.vue';
import { toast } from '../composables/util';

const dialogVisible = ref(false)
// 打开
const open = () => {
  dialogVisible.value = true
}
const close = () => {
  dialogVisible.value = false
}

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
// emit 的事件名必须是 update:modelValue，少一个字母都不行，这是 Vue 规定的。
// 父组件用了 v-model，子组件必须用 modelValue 接收，名字要对应上。
// 1. 声明接收父组件传过来的值（v-model绑定的值）
const props = defineProps({
  modelValue: [String, Array],
  limit: {
    type: Number,
    default: 1
  }
})
// 只要执行update:modelValue该事件，就会动态修改modelValue的值
// 2. 声明一个可以“反向修改父组件值”的事件
const emit = defineEmits(['update:modelValue'])
// 接收图片地址
let urls = ref([])
// 选择上传图片--接收ImageMain事件方法,用e接收选中的图片
const handleChoose = (e) => {
  // console.log(e)
  // 需求想要拿到图片的地址e.url
  urls.value = e.map(o => o.url)
}
// 提交图片
const submit = () => {
  let value = []
  // 当可以拿到图片数有限定为1时,如果有长度就拿里面的第0个
  if (props.limit == 1) {
    value = urls.value[0]
  }

  else {
    value = [...props.modelValue, ...urls.value]
    if (value.length > props.limit) {//当选择长度小于限制长度，
      return toast(`最多还能选择${props.limit - props.modelValue.length}张`)
    }
  }
  if (value) {
    emit('update:modelValue', value)
  }
  // 提交完成后关闭
  close()
}

// 移除轮播图方法
const removeImage = (url) => {
  // props.modelValue拿到的是banners.vue里的form.banner,就是地址组成的一维数组
  //过滤,不等于点击的url就留下了
  // 通知父组件更新
  emit('update:modelValue', props.modelValue.filter(u => u != url))
}
</script>
<style>
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}

.image-header {
  @apply flex items-center;
  border-bottom: 1px solid #eeeeee;
}
</style>
