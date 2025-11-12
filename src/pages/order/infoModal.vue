<template>
  <el-drawer title="订单详情" v-model="dialogVisible" size="50%">
    <!-- 第1个卡片 -->
    <el-card shadow="never" class="mb-3">
      <!-- 卡片头部 -->
      <template #header>
        <b class="text-sm">订单信息</b>
      </template>
      <!-- 卡片身体 -->
      <el-form label-width="80px">
        <el-form-item label="订单号">
          {{ info.no }}
        </el-form-item>
        <el-form-item label="付款方式">
          {{ info.payment_method }}
        </el-form-item>
        <el-form-item label="付款时间">
          {{ info.paid_time }}
        </el-form-item>
        <el-form-item label="创建时间">
          {{ info.create_time }}
        </el-form-item>
      </el-form>

    </el-card>
    <!-- 第2个卡片 -->
    <el-card v-if="info.ship_data" shadow="never" class="mb-3">
      <!-- 卡片头部 -->
      <template #header>
        <b class="text-sm">发货信息</b>
      </template>
      <!-- 卡片身体 -->
      <el-form label-width="80px">
        <el-form-item label="物流公司">
          {{ info.ship_data.express_company }}
        </el-form-item>
        <el-form-item label="运单号">
          {{ info.ship_data.express_no }}
          <el-button :loading="loading" class="ml-3" type="primary" size="small" text
            @click="openShipInfoModal(info.id)">查看物流</el-button>
        </el-form-item>
        <el-form-item label="发货时间">
          {{ info.ship_data.express_time }}
        </el-form-item>
      </el-form>

    </el-card>
    <!-- 第2个卡片 -->
    <el-card shadow="never" class="mb-3">
      <!-- 卡片头部 -->
      <template #header>
        <b class="text-sm">商品信息</b>
      </template>
      <!-- 卡片身体 -->
      <div class="flex mb-2" v-for="(item, index) in info.order_items" :key="index">
        <el-image :src="item.goods_item?.cover ?? ''" fit="fill" :lazy="true" style="width: 60px ;
        height: 60px;"></el-image>
        <div class="ml-2 text-sm">
          <p>{{ item.goods_item?.title ?? '商品已被删除' }}</p>
          <!-- 判断是否是多规格 -->
          <p class="mt-1">
            <el-tag v-if="item.sku" type="info" size="small">
              <!-- skus是一个对象 -->
              {{ item.sku }}
            </el-tag>
          </p>
          <p>
            <b class="text-rose-500 mr-2">￥{{ item.price }}</b>
            <span class="text-xs text-gray-500">x{{ item.num }}</span>
          </p>
        </div>
      </div>
      <el-form label-width="80px">
        <el-form-item label="成交价">
          <span class="text-rose-500 font-bold">￥{{ info.total_price }}</span>
        </el-form-item>

      </el-form>
    </el-card>
    <!-- 第3个卡片 -->
    <el-card shadow="never" v-if="info.address" class="mb-3">
      <!-- 卡片头部 -->
      <template #header>
        <b class="text-sm">收货信息</b>
      </template>
      <!-- 卡片身体 -->
      <el-form label-width="80px">
        <el-form-item label="收货人">
          {{ info.address.name }}
        </el-form-item>
        <el-form-item label="联系方式">
          {{ info.address.phone }}
        </el-form-item>
        <el-form-item label="收货地址">
          {{ info.address.province + info.address.city + info.address.district + info.address.address }}
        </el-form-item>
      </el-form>
    </el-card>
  </el-drawer>
  <ShipInfoModal ref="shipInfoModalRef" />
</template>

<script setup>
import { ref, reactive } from 'vue'
// 引入物流信息组件
import ShipInfoModal from './ShipInfoModal.vue'
const dialogVisible = ref(false)
// 接收父组件传过来的数据
const props = defineProps({
  info: Object
})

// 打开
const open = () => {
  dialogVisible.value = true
  console.log(props.info)
}
// 关闭
const close = () => {
  dialogVisible.value = false
}

// 打开物流信息
const shipInfoModalRef = ref(null)
const loading = ref(false)
const openShipInfoModal = (id) => {
  loading.value = true
  // 因为open方法返回的是promise方法
  shipInfoModalRef.value.open(id).finally(() => {
    loading.value = false
  })
}
defineExpose({
  open,
  close
})
</script>

<style></style>