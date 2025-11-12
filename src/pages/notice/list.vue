<template>
  <el-card shadow="never" class=" border-0">
    <!-- 刷新|新增 -->
    <ListHeader @create="handleCreate" @refresh="getData" />
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">

      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" width="380" />
      <!-- 自定义 -->
      <el-table-column label="操作" width="180" align="center">
        <!-- 插槽 -->
        <template #default="scope">
          <!-- 修改按钮 -->
          <!-- scope.row拿到当前对象 -->
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)">
            修改
          </el-button>
          <el-popconfirm title="是否删除该公告?" confirm-button-text="确认" cancel-button-text="取消"
            @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <!-- 删除按钮 -->
              <el-button type="primary" size="small" text>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="flex items-center justify-center  mt-5">
      <el-pagination background layout="prev,pager, next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
    <!-- 抽屉组件 -->
    <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="form.content" placeholder="公告内容" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>

</template>

<script setup>
// 引入·封装好的列表分页和搜索功能
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
// 引入公告列表接口
import {
  getNoticeList,
  createNoticeList,
  updateNoticeList,
  deleteNoticeList
} from '~/api/notice.js'
// 引入封装好的抽屉
import FormDrawer from '~/components/FormDrawer.vue'
// 引入刷新|新增
import ListHeader from '~/components/ListHeader.vue'
const {
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
} = useInitTable({
  getList: getNoticeList,
  delete: deleteNoticeList
})
// 封装新增和修改功能
const {
  FormDrawerRef,
  formRef,
  form,
  rules,
  editId,
  drawerTitle,
  handleSubmit,
  resetForm,
  handleCreate,
  handleEdit,
} = useInitForm({
  // 传数据
  form: {
    title: '',
    content: ''
  },
  // 传规则
  rules: {
    title: [{
      required: true,
      message: '公告标题不能为空',
      trigger: 'blur'
    }],

    content: [{
      required: true,
      message: '公告内容不能为空',
      trigger: 'blur'
    }]
  },
  currentPage,
  // 传组件方法
  getData,
  update: updateNoticeList,
  create: createNoticeList
})




</script>

<style></style>