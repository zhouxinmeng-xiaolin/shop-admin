<!-- 订单列表页面 -->
<template>
  <div>
    <!-- 标签栏部分 -->
    <el-tabs v-model="searchForm.tab" class="demo-tabs" @tab-change="getData">
      <el-tab-pane v-for="(item, index) in tabbars" :key="index" :label="item.name" :name="item.key"></el-tab-pane>
    </el-tabs>
    <!-- 卡片组件部分 -->
    <el-card shadow="never" class=" border-0">
      <!-- 搜索 -->
      <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
        <!-- 默认插槽内容即没有名字的slot -->
        <SearchItem label="关键词">
          <!-- SearchItem的插槽内容 -->
          <el-input v-model="searchForm.no" placeholder="订单编号" clearable></el-input>
        </SearchItem>
        <!-- 有名字插槽，和template结合使用 ,使用template精准将内容放在名字为show的插槽-->
        <template #show>
          <SearchItem label="收货人">
            <el-input v-model="searchForm.name" placeholder="收货人" clearable></el-input>
          </SearchItem>
          <SearchItem label="手机号">
            <el-input v-model="searchForm.phone" placeholder="手机号" clearable></el-input>
          </SearchItem>
          <SearchItem label="开始时间">
            <el-date-picker v-model="searchForm.starttime" value-format="YYYY-MM-DD" type="date" placeholder="开始日期"
              style="width: 90%;" />
          </SearchItem>
          <SearchItem label="结束时间">
            <el-date-picker v-model="searchForm.endtime" value-format="YYYY-MM-DD" type="date" placeholder="结束日期"
              style="width: 90%;" />
          </SearchItem>
        </template>
      </Search>

      <!-- 刷新|新增 -->
      <ListHeader layout="refresh,download" @refresh="getData" @download="handleExportExcel">
        <!-- 上架下架按钮--更新商品状态进行上下架   上架状态值为1，下架状态值为0 -->
        <!-- 不是回收站时都显示批量删除 -->
        <el-button type="danger" size="small" @click="handleMultiDelete">批量删除</el-button>
      </ListHeader>

      <!-- 表格 -->
      <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
        style="width: 100%" v-loading="loading">
        <!-- 第1列 -->
        <el-table-column type="selection" width="55" />
        <!-- 第2列 -->
        <el-table-column label="商品" width="300">
          <template #default="{ row }">
            <div>
              <div class="flex text-sm">
                <div class="flex-1">
                  <p>订单号：</p>
                  <small>{{ row.no }}</small>
                </div>
                <div>
                  <p>下单时间：</p>
                  <small>{{ row.create_time }}</small>
                </div>
              </div>
              <div class="flex py-2" v-for="(item, index) in row.order_items" :key="index">
                <el-image :src="item.goods_item ? item.goods_item.cover : ''" fit="cover" :lazy="true"
                  style="width:30px ; height: 30px;"></el-image>
                <p class=" text-blue-500 ml-2">
                  {{ item.goods_item ? item.goods_item.title : '商品已被删除' }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- 第3列 -->
        <el-table-column label="实际付款" align="center" width="120" prop="total_price">
        </el-table-column>
        <!-- 第4列 -->
        <el-table-column label="交易状态" width="170" align="center">
          <template #default="{ row }">
            <!-- 分为3行 -->
            <div>
              付款状态：
              <el-tag v-if="row.payment_method == 'wechat'" type="success" size="small">微信支付</el-tag>
              <el-tag v-else-if="row.payment_method == 'alipay'" size="small">支付宝支付</el-tag>
              <el-tag v-else type="info" size="small">未支付</el-tag>
            </div>
            <div>
              发货状态：
              <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{ row.ship_data ? "已发货" : "未发货"
              }}</el-tag>
            </div>
            <div>
              收货状态：
              <el-tag :type="row.ship_status == 'received' ? 'success' : 'info'" size="small">
                {{ row.ship_status == 'received' ? "已收货" : "未收货" }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <!-- 总库存 -->
        <el-table-column label="总库存" align="center" width="90" prop="stock">
        </el-table-column>
        <!-- 操作 -->
        <!-- 第5列 -->
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <!-- 点击的是某一订单，而不是全部订单，需要将当前对象传过去openInfoModal(row) -->
            <el-button class="px-1" type="primary" size="small" @click="openInfoModal(row)">订单详情</el-button>
            <el-button v-if="searchForm.tab === 'noship'" class="px-1" type="primary" size="small">订单发货</el-button>
            <el-button v-if="searchForm.tab === 'refunding'" class="px-1" type="primary" size="small"
              @click="handleRefund(row.id, 1)">同意退款</el-button>
            <el-button v-if="searchForm.tab === 'refunding'" class="px-1" type="primary" size="small"
              @click="handleRefund(row.id, 0)">拒绝退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="flex items-center justify-center  mt-5">
        <el-pagination background layout="prev,pager, next" :total="total" :current-page="currentPage"
          :page-size="limit" @current-change="getData" />
      </div>
    </el-card>
    <ExportExcel ref="exportExcelRef" :tabs="tabbars" />
    <infoModal ref="infoModalRef" :info="info" />
  </div>

</template>

<script setup>
import { ref } from 'vue'

// 引入商品管理
import {
  getOrderList,
  deleteOrder,
  refundOrder
} from '~/api/order.js'
// 弹出提示框和输入框
import {
  showModal,
  showPrompt
} from '~/composables/util.js'
// 引入·封装好的列表分页和搜索功能
import { useInitTable } from '~/composables/useCommon.js'
// 引入刷新|新增
import ListHeader from '~/components/ListHeader.vue'
// 引入封装的搜索组件
import Search from '~/components/Search.vue'
// 引入封装的搜索内容组件
import SearchItem from '~/components/SearchItem.vue'
// 引入封好的弹框组件
import infoModal from './infoModal.vue'
import { toast } from '~/composables/util'
// 引入导出excel弹框
import ExportExcel from './ExportExcel.vue'
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
  multipleTableRef,
  handleSelectionChange,
  handleMultiDelete,
  multiSelectionIds
} = useInitTable({
  searchForm: {
    tab: 'all',
    no: '',
    starttime: '',
    // endtime: '',
    // name: '',
    phone: '',
  },
  getList: getOrderList,
  delete: deleteOrder,
  onGetListSuccess: (res) => {
    // console.log(res)
    total.value = res.totalCount//总页数
    // 给列表数据中的每个对象添加一个statusLoading属性
    tableData.value = res.list.map(o => {
      o.bannersLoading = false
      o.contentLoading = false
      o.skusLoading = false
      return o
    })
  }
})

// 标签栏
// 订单类型：all全部，nopay待支付
// ，noship待发货，shiped待收货，received已收货，finish已完成，closed已关闭，refunding退款中
const tabbars = [
  {
    key: 'all',
    name: '全部'
  },
  {
    key: 'nopay',
    name: '待支付'
  },
  {
    key: 'noship',
    name: '待收货'
  },
  {
    key: 'shiped',
    name: '待收货'
  },
  {
    key: 'received',
    name: '已收货'
  },
  {
    key: 'finish',
    name: '已完成'
  },
  {
    key: 'closed',
    name: '已关闭'
  },
  {
    key: 'refunding',
    name: '退款中'
  },

]
// 导出excel
const exportExcelRef = ref(null)
const handleExportExcel = () => {
  exportExcelRef.value.open()
}
// 订单详情板块
//打开弹出层方法
const infoModalRef = ref(null)
const info = ref(null)
const openInfoModal = (row) => {
  row.order_items = row.order_items.map(o => {
    if (o.skus_type == 1 && o.goods_skus) {
      // 遍历对象使用for in
      let s = []
      for (const k in o.goods_skus.skus) {
        // 拿到里面的value值
        s.push(o.goods_skus.skus[k].value)
      }
      o.sku = s.join(',')
    }
    return o
  })
  info.value = row
  infoModalRef.value.open()

}
// 同意/拒绝退款
const handleRefund = (id, agree) => {
  // 同意退款
  (agree ? showModal("是否要同意该订单退款") : showPrompt("请输入拒绝理由？"))
    .then(({ value }) => {
      // 如果是拒绝退款value返回的是拒绝理由，如果是成功退款返回的是undefined
      // console.log(value)
      let data = { agree }
      if (!agree) {
        data.disagree_reason = value
      }
      refundOrder(id, data)
        .then(res => {
          getData()
          toast('操作成功')
        })
    })
}
</script>

<style></style>