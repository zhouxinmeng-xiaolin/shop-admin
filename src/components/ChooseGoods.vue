<!-- 选择关联商品组件 -->
<template>
  <!-- 输入框，搜索框
   商品列表 -->
  <el-dialog title="商品选择" v-model="dialogVisible" width="80%" destroy-on-close>
    <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
      style="width: 100%" v-loading="loading" height="300px">
      <!-- 第1列 -->
      <el-table-column type="selection" width="55" />
      <!-- 第2列 -->
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex">
            <!-- 左边为图片 -->
            <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true"
              style="width: 50px;height: 50px;"></el-image>
            <!-- 右边部分--占满剩余空间 -->
            <div class="flex-1">
              <!-- 标题 -->
              <p>{{ row.title }}</p>
              <!-- 分类 -->
              <p class="text-gray-400 text-xs mb-1">分类：{{ row.category ? row.category.name : "未分类" }}</p>
              <p class="text-gray-400 text-xs">创建时间：{{ row.create_time }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- 第3列总库存 -->
      <el-table-column label="总库存" align="center" width="90" prop="stock">
      </el-table-column>
      <!-- 第3列价格 -->
      <el-table-column label="价格(元)" align="center" width="150">
        <template #default="{ row }">
          <span class="text-rose-500">￥{{ row.min_price }}</span>
          <!-- 竖分割线 -->
          <el-divider direction="vertical" />
          <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="flex items-center justify-center  mt-5">
      <el-pagination background layout="prev,pager, next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
    <template #footer>
      <!-- 底部区域两个按钮 -->
      <span>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { ref } from 'vue'
// 引入商品列表接口
import { getGoodsList } from '~/api/goods.js'
import { useInitTable } from '~/composables/useCommon.js'
const {
  searchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  multipleTableRef,
  handleSelectionChange,
  multiSelectionIds
} = useInitTable({
  searchForm: {
    tab: 'all',
    title: "",
    // category_id: 0,
  },
  getList: getGoodsList,
  onGetListSuccess: (res) => {
    // console.log(res)
    total.value = res.totalCount//总页数
    // 给列表数据中的每个对象添加一个statusLoading属性
    tableData.value = res.list
  }
})
//  控制对话框
const dialogVisible = ref(false)

// 关闭对话框
function close() {
  dialogVisible.value = false
}
// 打开对话框方法
const callbackFunction = ref(null)
const open = (callback = null) => {
  callbackFunction.value = callback
  dialogVisible.value = true
}

//  提交对话框
const submit = () => {
  if (typeof callbackFunction.value === 'function') {
    callbackFunction.value(multiSelectionIds.value)
  }
  close()
}
// 将方法暴露出去
defineExpose({
  open
})
</script>

<style></style>