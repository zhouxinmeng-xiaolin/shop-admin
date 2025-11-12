<template>
  <el-card shadow="never" class=" border-0">
    <!-- 刷新|新增 -->
    <ListHeader @create="handleCreate" @refresh="getData" />
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">

      <el-table-column label="优惠券名称" width="350">
        <!-- 插槽 -->
        <template #default="{ row }">
          <div class="border border-dashed py-2 px-4 rounded" :class="row.statusText == '领取中' ? 'active' : 'inactive'">
            <h5 class="font-bold text-md">{{ row.name }}</h5>
            <small>{{ row.start_time }}~{{ row.end_time }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="statusText" label="状态" />
      <el-table-column label="优惠" width="150">
        <!-- 插槽 -->
        <template #default="{ row }">
          {{ row.type ? "折扣" : "满减" }} {{ row.type ? (row.value + '折') : ('￥' + row.value) }}
        </template>
      </el-table-column>
      <el-table-column prop="total" label="发放数量" />
      <el-table-column prop="used" label="已使用" />
      <!-- 自定义 -->
      <el-table-column label="操作" width="180" align="center">
        <!-- 自定义插槽 -->
        <template #default="scope">
          <!-- 修改按钮 -->
          <!-- scope.row拿到当前对象 -->
          <el-button v-if="scope.row.statusText == '未开始'" type="primary" size="small" text
            @click="handleEdit(scope.row)">
            修改
          </el-button>
          <el-popconfirm v-if="scope.row.statusText != '领取中'" title="是否删除该优惠券?" confirm-button-text="确认"
            cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <!-- 删除按钮 -->
              <el-button type="primary" size="small" text>删除</el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm v-if="scope.row.statusText == '领取中'" title="是否要让该优惠券失效?" confirm-button-text="失效"
            cancel-button-text="取消" @confirm="handleStatusChange(0, scope.row)">
            <template #reference>
              <!-- 删除按钮 -->
              <el-button type="danger" size="small">失效</el-button>
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
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="form.name" placeholder="优惠券名称" style="width: 50%;"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="0">
              满减
            </el-radio>
            <el-radio :label="1">
              折扣
            </el-radio>
          </el-radio-group>

        </el-form-item>
        <el-form-item label="面值" prop="value">
          <el-input v-model="form.value" placeholder="面值" style="width: 50%;">
            <template #append>{{ form.type ? '折扣' : '元' }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="发行量" prop="total">
          <el-input-number v-model="form.total" :min="0" :max="10000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="最低使用价格" prop="min_price">
          <el-input v-model="form.min_price" placeholder="最低使用价格" type="number"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker v-model="timerange" value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange"
            range-separator="To" start-placeholder="开始时间" end-placeholder="结束时间" :editable="false" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" placeholder="描述" type="textarea" :rows="5"></el-input>
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
  getCouponList,
  createCouponList,
  updateCouponList,
  deleteCouponList,
  updateCouponStatus
} from '~/api/coupon.js'
// 引入封装好的抽屉
import FormDrawer from '~/components/FormDrawer.vue'
// 引入刷新|新增
import ListHeader from '~/components/ListHeader.vue'
import { computed } from 'vue'
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
  getList: getCouponList,
  delete: deleteCouponList,
  onGetListSuccess: (res) => {
    // console.log(res)可以拿到优惠券相关数据
    tableData.value = res.list.map(o => {
      // 3.转化优惠券状态，给数据里加入statusText
      o.statusText = formatStatus(o)
      return o
    })
    total.value = res.totalCount
  },
  updateStatus: updateCouponStatus
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
  // 传数据--表单使用
  form: {
    name: '',
    type: 0,
    value: 0,
    total: 100,
    min_price: 0,
    start_time: null,
    end_time: null,
    order: 50,
    desc: ""
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
  update: updateCouponList,
  create: createCouponList,
  // 提交时间之前的方法
  beforeSubmit: (f) => {
    // 判断时间是否为时间戳
    // 因为后端接口存的时间是时间戳格式，所以如果不是，就要转为时间戳格式
    if (typeof f.start_time != 'number') {
      f.start_time = (new Date(f.start_time)).getTime()
    }
    if (typeof f.end_time != 'number') {
      f.end_time = (new Date(f.end_time)).getTime()
    }
    return f
  }
})


// 优惠券状态--通过开始事件和最后事件进行判断
function formatStatus(row) {
  // 1.默认显示领取中,获取开始和最后时间(拿到的是字符串，需要转换为时间戳)
  // new Date()--拿到当前时间戳
  let s = '领取中'
  let start_time = (new Date(row.start_time)).getTime()
  let now = (new Date()).getTime()
  let end_time = (new Date(row.end_time)).getTime()
  // 2.进行判断，开始时间>现在时间--还没开始，结束时间<现在时间--已结束，
  if (row.status == 0) { // 先判断手动失效状态
    s = "已失效"
  } else if (start_time > now) { // 再判断未开始
    s = "未开始"
  } else if (end_time < now) { // 最后判断已结束
    s = "已结束"
  }
  // 将s返回去
  return s
}


// 活动时间范围
const timerange = computed({
  get() {
    return form.start_time && form.end_time ? [form.start_time, form.end_time] : []
  },
  set(val) {
    // console.log(val)
    form.start_time = val[0]
    form.end_time = val[1]
  }
})
</script>

<style scoped>
/* 要定义两个样式，激活状态和非激活状态 */
.active {
  @apply border-rose-200 bg-rose-50 text-red-400;
}

.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>