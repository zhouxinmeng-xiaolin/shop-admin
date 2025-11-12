<!-- 修改轮播图组件 -->
<template>
  <FormDrawer ref="formDrawerRef" title="设置商品详情" @submit="submit">
    <el-form :model="form">
      <el-form-item>
        <Editor v-model="form.content" />
      </el-form-item>
    </el-form>
  </FormDrawer>

</template>

<script setup>
import { ref, reactive } from 'vue'
// 引入封装好的弹框
import FormDrawer from "~/components/FormDrawer.vue"
import { toast } from '~/composables/util.js'
// 引入富文本编辑器
import Editor from '~/components/Editor.vue'
// 引入查看资料接口
import {
  readGoods,
  updateGoods
} from '~/api/goods.js'

const formDrawerRef = ref(null)
// 表单元素
const form = reactive({
  content: "",
})
// 接收商品id
const goodsId = ref(0)
// 需求想让父组件打开轮播图
// 1.写轮播图打开方法,row为当前对象
const open = (row) => {
  // console.log(row),这里可以拿到当前点击商品id，就可以查看商品资料
  goodsId.value = row.id
  // 给设置轮播图加loading
  row.contentLoading = false
  // 查看商品资料
  readGoods(goodsId.value)
    .then(res => {//查看资料成功后所作操作
      // console.log(res)  
      // 给表单content赋值
      form.content = res.content
      formDrawerRef.value.open()
    })
    .finally(() => {
      row.contentLoading = false

    })

}
const emit = defineEmits(["reload-data"])
// 给按钮加loading
const loading = ref(false)
// 提交方法
const submit = () => {
  formDrawerRef.value.showLoading()
  updateGoods(goodsId.value, form)
    .then(res => {//设置轮播图成功后
      // 提示
      toast('设置商品详情成功')
      // 关闭轮播图弹框
      formDrawerRef.value.close()
      // 刷新列表页
      emit("reload-data")

    })
    .finally(() => {
      formDrawerRef.value.hideLoading()
    })
}
// 2.需要暴露方法让父组件打开抽屉
// 3。在父组件中导入子组件，使用子组件，设置ref，通过ref调用方法
defineExpose({
  open
})
</script>

<style></style>