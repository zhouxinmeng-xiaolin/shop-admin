<!-- 评论列表模块 -->
<template>
  <el-card shadow="never" class=" border-0">
    <!-- 搜索 -->
    <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
      <!-- 默认插槽内容即没有名字的slot -->
      <SearchItem label="关键词">
        <!-- SearchItem的插槽内容 -->
        <el-input v-model="searchForm.title" placeholder="商品标题" clearable></el-input>
      </SearchItem>
    </Search>

    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" default-expand-all>
      <el-table-column type="expand">
        <!-- 评论详情块 -->
        <template #default="{ row }">
          <div class="flex pl-18">
            <!-- 头像 -->
            <el-avatar class="mr-3" :size="50" shape="circle" :src="row.user.avatar" fit="fill"></el-avatar>
            <!-- 昵称等 -->
            <div class="flex-1">
              <h6 class="flex items-center">
                {{ row.user.nickname || row.user.username }}
                <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                <!-- 点击回复就会出现回复框 当textareaText=false时以及没有回复过时才显示-->
                <el-button v-if="!row.textareaEdit && !row.extra" size="small" class="ml-auto"
                  @click="openTextarea(row)">回复</el-button>
              </h6>
              {{ row.review.data }}
              <div class="py-2">
                <!-- img是数组，需要v-for遍历出来 -->
                <el-image v-for="(item, index) in row.review.image" :key="index" :src="item" fit="cover" :lazy="true"
                  style="width: 100px; height: 100px;" class="rounded"></el-image>

                <div v-if="row.textareaEdit">
                  <el-input v-model="textarea" placeholder="请输入评价内容" type="textarea" :rows="2"></el-input>
                  <div class="py-2">
                    <el-button type="primary" size="small" @click="review(row)">回复</el-button>
                    <el-button size="small" class="ml-2" @click="row.textareaEdit = false">取消</el-button>
                  </div>
                </div>
                <template v-else>
                  <div class="mt-3 bg-gray-100 p-3 rounded" v-for="(item, index) in row.extra" :key="index">
                    <h6 class="flex font-bold">
                      客服
                      <el-button type="info" size="small" class="ml-auto"
                        @click="openTextarea(row, item.data)">修改</el-button>
                    </h6>
                    <p>{{ item.data }}</p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" width="70" align="center" prop="id"></el-table-column>
      <el-table-column label="商品" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <!-- 图片 -->
            <el-image :src="row.goods_item ? row.goods_item.cover : ''" fit="fill" :lazy="true"
              style="width: 50px; height: 50px;" class="rounded"></el-image>

            <!-- 昵称和id -->
            <div class="flex-col ml-3">
              <h6>{{ row.goods_item?.title ?? '商品已被删除' }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价信息" width="200px">
        <!-- 自定义插槽 -->
        <template #default="{ row }">
          <div>
            <p>用户：{{ row.user.nickname || row.user.username }}</p>
            <p>
              <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价时间" width="180" align="center" prop="review_time" />

      <!-- 状态 -->
      <el-table-column label="状态">
        <template #default="{ row }">
          <!-- 主要用来切换 “开启 / 关闭” 状态 -->
          <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading"
            :disabled="row.super == 1" @change="handleStatusChange($event, row)">
          </el-switch>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="flex items-center justify-center  mt-5">
      <el-pagination background layout="prev,pager, next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>

  </el-card>

</template>

<script setup>
import { ref } from 'vue'
import { toast } from '~/composables/util.js'
// 引入管理员管理
import {
  getGoodsCommentList,
  updateGoodsCommentStatus,
  reviewGoodsComment
} from '~/api/goods_comment.js'
// 引入·封装好的列表分页和搜索功能
import { useInitTable, useInitForm } from '~/composables/useCommon.js'

// 引入封装的搜索组件
import Search from '~/components/Search.vue'
// 引入封装的搜索内容组件
import SearchItem from '~/components/SearchItem.vue'

// 用空数组接收后台传回来的roles
const roles = ref([])
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
    title: ""
  },
  getList: getGoodsCommentList,
  updateStatus: updateGoodsCommentStatus,
  onGetListSuccess: (res) => {
    total.value = res.totalCount//总页数
    // 给列表数据中的每个对象添加一个statusLoading属性
    tableData.value = res.list.map(o => {
      o.statusLoading = false
      // 给每个对象添加回复框的属性
      o.textareaEdit = false
      return o
    })
    // 将后端roles数据接收
    roles.value = res.roles
  }
})

// 回复框内容
const textarea = ref("")
// 打开回复框方法
const openTextarea = (row, data = "") => {
  textarea.value = data//回复框内容默认为空，当有传值就是传的值
  row.textareaEdit = true
}
// 回复方法
const review = (row) => {
  // 判断有没有输入回复内容
  if (textarea.value == "") {//没有有回复内容
    return toast('回复内容不能为空', 'error')
  }
  reviewGoodsComment(row.id, textarea.value)
    .then(res => {
      row.textareaEdit = false
      toast('回复成功')
      getData()
    })
}
</script>

<style></style>