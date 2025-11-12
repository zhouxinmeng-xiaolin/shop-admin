<!-- 会员等级页面 -->
<template>
  <el-card shadow="never" class=" border-0">
    <!-- 刷新|新增 -->
    <ListHeader @create="handleCreate" @refresh="getData" />
    <!-- 表格部分 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">

      <el-table-column prop="name" label="会员等级" />
      <el-table-column prop="discount" label="折扣率" align="center" />
      <el-table-column prop="level" label="等级序号" align="center" />

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
          <el-popconfirm title="是否删除该记录?" confirm-button-text="确认" cancel-button-text="取消"
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
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="form.name" placeholder="等级名称"></el-input>
        </el-form-item>
        <el-form-item label="等级权重" prop="level">
          <el-input v-model="form.level" placeholder="等级权重"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="升级条件">
          <div>
            <small class="text-xs mr-2">累计消费满</small>
            <el-input v-model="form.max_price" type="number" placeholder="累计消费" style="width: 50%;">
              <template #append>元</template>
            </el-input>
            <small class="text-gray-400 flex">
              设置会员等级所需要的累计消费必须大于等于0，单位：元
            </small>
          </div>
          <div>
            <small class="text-xs mr-2">累计次数满</small>
            <el-input v-model="form.max_times" type="number" placeholder="累计次数" style="width: 50%;">
              <template #append>次</template>
            </el-input>
            <small class="text-gray-400 flex">
              设置会员等级所需要的购买量必须大于等于0，单位：笔
            </small>
          </div>
        </el-form-item>
        <el-form-item label="折扣率(%)" prop="discount">
          <el-input v-model="form.discount" type="number" style="width: 50%;">
            <template #append>%</template>
          </el-input>
          <small class="text-gray-400 flex">
            折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买
          </small>
        </el-form-item>
      </el-form>

    </FormDrawer>
  </el-card>

</template>

<script setup>
import { ref } from 'vue'
// 引入·封装好的列表分页和搜索功能
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
// 引入菜单列表接口
import {
  getUserLevelList,
  createUserLevelList,
  updateUserLevelList,
  deleteUserLevelList,
  updateUserLevelStatus,
} from '~/api/level.js'
// 菜单权限管理获取数据方法
import { getRuleList } from '~/api/rule.js'
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
  handleStatusChange
} = useInitTable({
  getList: getUserLevelList,
  delete: deleteUserLevelList,
  updateStatus: updateUserLevelStatus
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
    level: 100,
    status: 1,
    discount: 0,
    max_price: 0,
    max_times: 0
  },
  // 传规则
  rules: {
    name: [{
      required: true,
      message: '会员等级名称不能为空',
      trigger: 'blur'
    }],
  },
  currentPage,
  // 传组件方法
  getData,
  update: updateUserLevelList,
  create: createUserLevelList
})



</script>

<style></style>