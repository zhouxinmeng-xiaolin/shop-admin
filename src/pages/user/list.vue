<!-- 用户列表界面 -->
<template>
  <el-card shadow="never" class=" border-0">
    <!-- 搜索 -->
    <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
      <!-- 默认插槽内容即没有名字的slot -->
      <SearchItem label="关键词">
        <!-- SearchItem的插槽内容 -->
        <el-input v-model="searchForm.keyword" placeholder="手机号/邮箱/会员昵称" clearable></el-input>
      </SearchItem>
      <template #show>
        <SearchItem label="会员等级">
          <!-- SearchItem的插槽内容 -->
          <el-select v-model="searchForm.user_level_id" placeholder="请选择会员等级" clearable>
            <el-option v-for="item in user_level" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>

        </SearchItem>
      </template>
    </Search>

    <!-- 原搜索模块，已经被封装 -->
    <!-- <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-form-item label="关键词">
            <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable></el-input>
          </el-form-item>
        </el-col> -->
    <!-- 按钮 -->
    <!-- <el-col :span="8" :offset="8">
          <div class="flex items-center justify-end">
            <el-button type="primary" @click="getData">搜索</el-button>
            <el-button @click="resetSearchForm">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form> -->

    <!-- 刷新|新增 -->
    <ListHeader @create="handleCreate" @refresh="getData" />
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">

      <el-table-column label="会员" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <!-- 头像 -->
            <el-avatar :size="40" :src="row.avatar">
              <!-- 失败时头像 -->
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
            </el-avatar>
            <!-- 昵称和id -->
            <div class="flex-col ml-3">
              <h6>{{ row.username }}</h6>
              <small>ID:{{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" align="center">
        <!-- 自定义插槽 -->
        <template #default="{ row }">
          {{ row.user_level ? row.user_level.name : "-" }}
        </template>
      </el-table-column>
      <el-table-column label="登录注册" align="center">
        <!-- 自定义插槽 -->
        <template #default="{ row }">
          <p v-if="row.last_login_time">最后登录时间：{{ row.last_login_time }}</p>
          <p>注册时间：{{ row.create_time }}</p>

        </template>
      </el-table-column>
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
      <el-table-column label="操作" width="180" align="center">
        <!-- 插槽 -->
        <template #default="scope">
          <!-- 超级管理员就不能进行操作 -->
          <small v-if="scope.row.super == 1" class="text-sm text-gray-500">暂无操作</small>
          <!-- 修改按钮 -->
          <!-- scope.row拿到当前对象 -->
          <div v-else>
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
          </div>
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <!-- 
           这是 Vue 中最常用的 “双向绑定” 交互方式，流程如下：
父组件通过 v-model="form.avatar" 给子组件 <ChooseImage> 传了一个值（form.avatar），子组件用 modelValue 接收这个值。（父 → 子 传值）
当子组件里用户选了图片，点击 “确定” 时，子组件通过 emit('update:modelValue', 新值) 告诉父组件：“我选了这个图片地址，你更新一下吧”。
父组件收到这个通知后，会自动把 form.avatar 的值改成子组件传过来的新图片地址。（子 → 父 传值并修改）
          -->
          <!-- 要拿到头像，要绑定 -->
          <!-- 用v-model把组件和表单的form.avatar绑定起来 -->
          <ChooseImage v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="会员等级" prop="user_level_id">
          <!-- 下拉框 -->
          <el-select v-model="form.user_level_id" placeholder="请选择会员等级" clearable>
            <el-option v-for="item in user_level" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="手机"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>

    </FormDrawer>
  </el-card>

</template>

<script setup>
import { ref } from 'vue'

// 引入管理员管理
import {
  getUserList,
  updateUserStatus,
  createUser,
  updateUser,
  deleteUser
} from '~/api/user.js'
// 引入·封装好的列表分页和搜索功能
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
// 引入封装好的抽屉
import FormDrawer from '~/components/FormDrawer.vue'
// 引入头像组件
import ChooseImage from '~/components/ChooseImage.vue'
// 引入刷新|新增
import ListHeader from '~/components/ListHeader.vue'
// 引入封装的搜索组件
import Search from '~/components/Search.vue'
// 引入封装的搜索内容组件
import SearchItem from '~/components/SearchItem.vue'


// 接收会员等级
const user_level = ref([])
// 封装好的列表分页和搜索功能
const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  handleStatusChange
} = useInitTable({
  searchForm: {
    keyword: "",
    user_level_id: null
  },
  getList: getUserList,
  delete: deleteUser,
  updateStatus: updateUserStatus,
  onGetListSuccess: (res) => {
    total.value = res.totalCount//总页数
    // 给列表数据中的每个对象添加一个statusLoading属性
    tableData.value = res.list.map(o => {
      o.statusLoading = false
      return o
    })
    user_level.value = res.user_level
  }
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
    username: '',
    password: '',
    status: 1,
    nickname: '',
    phone: '',
    email: '',
    avatar: '',
    user_level_id: null
  },
  // 传规则
  rules: {
    username: [{
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    }],

    password: [{
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    }]
  },
  currentPage,
  // 传组件方法
  getData,
  update: updateUser,
  create: createUser
})





</script>

<style></style>