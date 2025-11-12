<!-- 修改轮播图组件 -->
<template>
  <el-drawer title="设置轮播图" v-model="dialogVisible" size="50%" :destroy-on-close="true">
    <el-form :model="form" label-width="80px">
      <el-form-item label="轮播图">
        <ChooseImage v-model="form.banners" :limit="9" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
      </el-form-item>
    </el-form>

  </el-drawer>

</template>

<script setup>
import { ref, reactive } from 'vue'
// 上传图片组件
import ChooseImage from '~/components/ChooseImage.vue'
import { toast } from '~/composables/util.js'
// 引入查看资料接口
import {
  readGoods,
  setGoodsBanner
} from '~/api/goods.js'
// 控制轮播图显示
const dialogVisible = ref(false)
// 表单元素
const form = reactive({
  banners: []//图片url组成的一维数组
})
// 接收商品id
const goodsId = ref(0)
// 需求想让父组件打开轮播图
// 1.写轮播图打开方法,row为当前对象
const open = (row) => {
  // console.log(row),这里可以拿到当前点击商品id，就可以查看商品资料
  goodsId.value = row.id
  // 给设置轮播图加loading
  row.bannersLoading = true
  // 查看商品资料
  readGoods(goodsId.value)
    .then(res => {//查看资料成功后所作操作
      // console.log(res)  
      // 给表单banners赋值
      form.banners = res.goodsBanner.map(o => o.url)
      dialogVisible.value = true
    })
    .finally(() => {
      row.bannersLoading = false

    })

}
const emit = defineEmits(["reload-data"])
// 给按钮加loading
const loading = ref(false)
// 提交方法
const submit = () => {
  loading.value = true
  setGoodsBanner(goodsId.value, form)
    .then(res => {//设置轮播图成功后
      // 提示
      toast('设置轮播图成功')
      // 关闭轮播图弹框
      dialogVisible.value = false
      // 刷新列表页
      emit("reload-data")

    })
    .finally(() => {
      loading.value = false
    })
}
// 2.需要暴露方法让父组件打开抽屉
// 3。在父组件中导入子组件，使用子组件，设置ref，通过ref调用方法
defineExpose({
  open
})
</script>

<style></style>