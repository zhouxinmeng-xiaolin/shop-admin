<template>
  <el-card shadow="never" class=" border-0">
    <!-- 刷新|新增 -->
    <ListHeader @create="handleCreate" @refresh="getData" @delete="handleMultiDelete" layout="create,delete,refresh" />
    <!-- 表格部分 -->
    <el-table ref="multipleTableRef" :data="tableData" stripe style="width: 100%" v-loading="loading"
      @selection-change="handleSelectionChange">
      <!-- 多选框 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="规格名称" />
      <el-table-column prop="default" label="规格值" width="380" />
      <el-table-column prop="order" label="排序" />
      <!-- 状态 -->
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <!-- 主要用来切换 “开启 / 关闭” 状态 -->
          <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading"
            :disabled="row.super == 1" @change="handleStatusChange($event, row)">
          </el-switch>

        </template>
      </el-table-column>
      <!-- 自定义 -->
      <el-table-column label="操作" width="250" align="center">
        <!-- 插槽 -->
        <template #default="scope">
          <!-- 修改按钮 -->
          <!-- scope.row拿到当前对象 -->
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)">
            修改
          </el-button>
          <el-popconfirm title="是否删除该规格?" confirm-button-text="确认" cancel-button-text="取消"
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
    <!-- 抽屉组件--表单部分 -->
    <FormDrawer destroyOnclose ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name" placeholder="规格名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <!-- 组件间交互使用v-model,就要结合modelValue -->
          <!-- {{ form.default }} -->
          <TagInput v-model="form.default" />
        </el-form-item>


      </el-form>

    </FormDrawer>
  </el-card>

</template>

<script setup>
import { ref } from 'vue'
import { toast } from '~/composables/util.js'
// 引入添加规格组件
import TagInput from '~/components/TagInput.vue'
// 引入·封装好的列表分页和搜索功能
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
// 引入菜单列表接口
import {
  getSkusList,
  createSkusList,
  updateSkusList,
  deleteSkusList,
  updateSkusStatus,
} from '~/api/skus.js'
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
  handleStatusChange,
  handleMultiDelete,
  multipleTableRef,
  handleSelectionChange
} = useInitTable({
  getList: getSkusList,
  delete: deleteSkusList,
  updateStatus: updateSkusStatus
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
    name: '',
    status: 1,
    order: 50,
    default: ''
  },
  // 传规则
  rules: {
    name: [{
      required: true,
      message: '规格名称不能为空',
      trigger: 'blur'
    }],
    default: [{
      required: true,
      message: '规格值不能为空',
      trigger: 'blur'
    }],
  },
  currentPage,
  // 传组件方法
  getData,
  update: updateSkusList,
  create: createSkusList
})


</script>

<style></style>