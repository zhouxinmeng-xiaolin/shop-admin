<!-- 推荐商品弹框 -->
<template>

  <FormDrawer ref="formDrawerRef" title="推荐商品" @submit="handleConnect" confirmText="关联">
    <!-- 有表格就涉及表格数据--来自接口 -->
    <el-table :data="tableData" border stripe style="width: 100%;">
      <!-- prop="字段名" → 告诉表格列 “显示哪段数据”，从每行数据对象里抓指定字段的值 -->
      <!-- label 是个超级直白的属性，用大白话讲就是：“给这一列起个标题，显示在表格最上面的表头里”。 -->
      <!-- 第1列 商品id-->
      <el-table-column prop="goods_id" label="ID" width="60" />
      <!-- 商品封面是自定义的 -->
      <!-- 第2列 商品封面-->
      <el-table-column label="商品封面" width="180">
        <template #default="{ row }">
          <div>
            <el-image :src="row.cover" fit="fill" :lazy="true" style="width: 64px;height: 64px;"></el-image>
          </div>
        </template>
      </el-table-column>
      <!-- 第3列商品名称 -->
      <el-table-column prop="name" label="商品名称" width="180" />
      <!-- 第4列 操作 -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-popconfirm title="是否删除该记录?" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleDelete(row)">
            <template #reference>
              <el-button type="primary" text size="small" :loading="row.loading">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>

    </el-table>
  </FormDrawer>
  <!-- 关联商品弹框 -->
  <ChooseGoods ref="chooseGoodsRef" />
</template>

<script setup>
// 引入弹框组件
import FormDrawer from '~/components/FormDrawer.vue'
import { ref } from 'vue'
import {
  getCategoryGoods,
  deleteCategoryGoods,
  connectCategoryGoods
} from '~/api/category.js'
import { toast } from '~/composables/util.js'
// 引入推荐商品弹框组件
import ChooseGoods from '~/components/ChooseGoods.vue'
const formDrawerRef = ref(null)
const category_Id = ref(0)
const tableData = ref([])//存拿到的分类表格数据
// 打开,拿到list.vue传过来的data
const open = (item) => {
  category_Id.value = item.id
  // 打开弹框前就获取到数据
  // 因为getData()返回的是promise，可以then
  item.goodsDrawerLoading = true
  getData()
    .then(res => {
      // open里又传回调函数
      formDrawerRef.value.open()
    })
    .finally(() => {
      item.goodsDrawerLoading = false
    })
}

// 将获取数据方法单独写成函数，后面其他方法会用
function getData() {
  // 返回的是promise
  return getCategoryGoods(category_Id.value)
    .then(res => {
      // console.log(res)res就是表格数据,且是一个数组
      // 增加删除loading
      tableData.value = res.map(o => {
        o.loading = false
        return o
      })
    })
}

// 删除关联商品
const handleDelete = (row) => {
  row.loading = true
  deleteCategoryGoods(row.id)
    .then(res => {//删除成功
      toast('删除成功')
      getData()
    })
}
// 关联商品方法
const chooseGoodsRef = ref(null)
// <!-- 点击推荐商品表单弹框 的提交就会弹出关联商品弹框-->
const handleConnect = () => {
  chooseGoodsRef.value.open((goods_ids) => {
    formDrawerRef.value.showLoading()
    // console.log(goods_ids)拿到选中商品id组成的数组
    connectCategoryGoods({
      category_id: category_Id.value,
      goods_ids: goods_ids
    }).then(res => {
      getData()
      toast('关联成功')
    }).finally(() => {
      formDrawerRef.value.hideLoading()

    })
  })
}

defineExpose({
  open
})
</script>

<style></style>