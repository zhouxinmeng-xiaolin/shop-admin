<!-- 规格卡片身体内容 -->
<template>
  <div v-loading="loading">
    <el-tag v-for="(tag, index) in item.goodsSkusCardValue" :key="index" closable :disable-transitions="false"
      @close="handleClose(tag)" class="mx-1" effect="plain">
      <!-- 要修改选项值---先嵌入input输入框 -->
      <!-- $event 就是 “事件本身的信息包”，专门用来传递当前触发事件的各种数据（
        比如输入框的最新值、点击的元素信息等），是 Vue 里自带的 “事件信使”。 -->
      <el-input class="ml-[-10px] w-20" v-model="tag.text" placeholder="选项值" size="small"
        @change="handleChange($event, tag)"></el-input>
    </el-tag>
    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
      @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">
      + 添加选项值
    </el-button>
  </div>
</template>

<script setup>
import {
  initSkuCardItem
} from '~/composables/useSku.js'
// 疑问：id怎么拿？->利用defineProps
const props = defineProps({
  skuCardId: [Number, String]
})
// 接收拿到的对象值
const {
  item,
  inputValue,
  inputVisible,
  InputRef,
  handleClose,
  showInput,
  handleInputConfirm,
  loading,
  handleChange
} = initSkuCardItem(props.skuCardId)

</script>

<style></style>