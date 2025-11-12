<!-- 分销板块 -->
<template>
  <div>
    <panel />
    <el-card shadow="never" class=" border-0">
      <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
        <!-- 默认插槽内容即没有名字的slot -->
        <SearchItem label="时间选择">
          <el-radio-group v-model="searchForm.type">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="today">今天</el-radio-button>
            <el-radio-button label="yesterday">昨天</el-radio-button>
            <el-radio-button label="last7days">最近7天</el-radio-button>
          </el-radio-group>
        </SearchItem>

        <template #show>
          <SearchItem label="开始时间">
            <el-date-picker v-model="searchForm.starttime" value-format="YYYY-MM-DD" type="date" placeholder="开始日期"
              style="width: 90%;" />
          </SearchItem>
          <SearchItem label="结束时间">
            <el-date-picker v-model="searchForm.endtime" value-format="YYYY-MM-DD" type="date" placeholder="结束日期"
              style="width: 90%;" />
          </SearchItem>
          <SearchItem label="关键词">
            <!-- SearchItem的插槽内容 -->
            <el-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable></el-input>
          </SearchItem>
        </template>
      </Search>

      <!-- 表格 -->
      <el-table :data="tableData" stripe width="100%" v-loading="loading">
        <!-- 第1列 -->
        <el-table-column label="ID" prop="id" align="centter" />
        <!-- 第2列 头像 -->
        <el-table-column label="头像" width="65">
          <template #default="{ row }">
            <!-- 头像 -->
            <el-avatar :size="40" :src="row.avatar">
              <!-- 失败时头像 -->
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
            </el-avatar>
          </template>
        </el-table-column>
        <!-- 第3列 用户信息 -->
        <el-table-column label="用户信息" width="200">
          <!-- 自定义插槽 -->
          <template #default="{ row }">
            <div class="text-xs">
              <p>用户：{{ row.username }}</p>
              <p>昵称：{{ row.nickname }}</p>
              <p>姓名：{{ row.user_info.name }}</p>
              <p>电话：{{ row.phone }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推广用户数量" prop="share_num" align="center" width="120" />
        <el-table-column label="订单数量" prop="share_order_num" align="center" width="120" />
        <el-table-column label="订单金额" prop="order_price" align="center" width="120" />
        <el-table-column label="账户佣金" prop="commission" align="center" width="120" />
        <el-table-column label="已提现金额" prop="cash_out_price" align="center" width="120" />
        <el-table-column label="提现次数" prop="cash_out_time" align="center" width="120" />
        <el-table-column label="未提现金额" prop="no_cash_out_price" align="center" width="120" />
        <!-- 自定义 -->
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template #default="{ row }">
            <!-- 修改按钮 -->
            <div>
              <el-button type="primary" size="small" text @click="openDataDrawer(row.id, 'user')">
                推广人
              </el-button>
              <el-button type="primary" size="small" text @click="openDataDrawer(row.id, 'order')">
                推广订单
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="flex items-center justify-center  mt-5">
        <el-pagination background layout="prev,pager, next" :total="total" :current-page="currentPage"
          :page-size="limit" @current-change="getData" />
      </div>
    </el-card>
    <dataDrawer ref="dataDrawerRef" />
    <dataDrawer ref="orderDataDrawerRef" type="order" />

  </div>
</template>

<script setup>
import { ref } from 'vue'
// 引入组件
import panel from './panel.vue';
// 引入管理员管理
import {
  getAgentList,
  getAgentOrderList,
  getAgentStatistics
} from '~/api/distribution.js'
// 引入·封装好的列表分页和搜索功能
import { useInitTable } from '~/composables/useCommon.js'
// 引入封装的搜索组件
import Search from '~/components/Search.vue'
// 引入封装的搜索内容组件
import SearchItem from '~/components/SearchItem.vue'
// 引入推荐人列表组件
import dataDrawer from './dataDrawer.vue';
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
} = useInitTable({
  searchForm: {
    keyword: "",
    type: 'all',
    starttime: '',
    // endtime: '',
  },
  getList: getAgentList,
  onGetListSuccess: (res) => {
    total.value = res.totalCount//总页数

    tableData.value = res.list
  }
})

// 推荐人列表// 推广订单列表
const orderDataDrawerRef = ref(null)
const dataDrawerRef = ref(null)
const openDataDrawer = (id, type) => {
  (type == 'user' ? dataDrawerRef : orderDataDrawerRef).value.open(id)

}



</script>

<style></style>