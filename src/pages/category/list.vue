<!-- 商品分类模块 -->
<template>
  <el-card shadow="never" class="border-0">
    <!-- 刷新|新增 -->
    <!-- handleCreate触发打开弹框方法 -->
    <ListHeader @refresh="getData" @create="handleCreate" />
    <!-- label代表树形列表的名称   children代表树形列表子节点-->
    <el-tree style="max-width: 100%" :data="tableData" :props="{ label: 'name', children: 'child' }" v-loading="loading"
      node-key="id">
      <!-- data就是当前的对象 -->
      <template #default="{ data }">
        <div class="custom-tree-node">

          <!-- 标题 -->
          <span>{{ data.name }}</span>

          <!-- switch开关 -->
          <div class="ml-auto">
            <el-button text type="primary" size="small" @click="openGoodsDrawer(data)"
              :loading="data.goodsDrawerLoading">推荐商品</el-button>
            <el-switch @change="handleStatusChange($event, data)" :modelValue="data.status" :active-value="1"
              :inactive-value="0" />

            <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
            <el-popconfirm title="是否删除该记录?" confirm-button-text="确认" cancel-button-text="取消"
              @confirm="handleDelete(data.id)">
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
    <!-- 想要实现切换菜单/规则，显示不同的表单 -->
    <!-- 抽屉组件 -->
    <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="分类名称"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
    <!-- 推荐产品弹框 -->
    <GoodsDrawer ref="goodsDrawerRef" />
  </el-card>

</template>

<script setup>
import { ref } from 'vue'
// 引入刷新|新增
import ListHeader from '~/components/ListHeader.vue'
// 引入推荐产品弹框组件
import GoodsDrawer from './components/GoodsDrawer.vue'
// 引入菜单权限接口
import {
  getCategoryList,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory
} from '~/api/category.js'
import {
  useInitTable,
  useInitForm
} from '~/composables/useCommon.js'
// 引入封装好的抽屉
import FormDrawer from '~/components/FormDrawer.vue'
// 
const {
  loading,
  tableData,
  getData,
  currentPage,
  handleStatusChange,
  handleDelete

} = useInitTable({
  getList: getCategoryList,
  onGetListSuccess: (res) => {
    tableData.value = res.map(o => {
      o.goodsDrawerLoading = false
      // 记住！！！！给对象增加东西要返回
      return o
    })

  },
  delete: deleteCategory,
  updateStatus: updateCategoryStatus,
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
  // 传数据,就是接口body的参数
  form: {
    name: '',
  },
  // 传规则
  rules: {},
  currentPage,
  // 传组件方法
  getData,
  update: updateCategory,
  create: createCategory
})
// 推荐商品打开
const goodsDrawerRef = ref(null)
const openGoodsDrawer = (data) => {
  goodsDrawerRef.value.open(data)
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}

.el-tree-node__content {
  padding: 20px 0px;
}
</style>