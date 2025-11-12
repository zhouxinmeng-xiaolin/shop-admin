<template>
  <el-drawer title="物流信息" v-model="dialogVisible" direction="rtl" size="40%">
    <!-- 第1个卡片 -->
    <el-card shadow="never" class="border-0 mb-3">
      <!-- 卡片身体 -->
      <div class="flex items-center">
        <el-image class="rounded border" :src="info.logo" fit="fill" :lazy="true"
          style="width: 60px;height: 60px;"></el-image>
        <div class="ml-3">
          <p class="text-sm">物流公司：{{ info.typename }}</p>
          <p class="text-sm">物流单号：{{ info.number }}</p>
        </div>
      </div>
    </el-card>
    <!-- 第2个卡片 -->
    <el-card shadow="never" class="border-0 border-t">
      <!-- 卡片身体 -->
      <el-timeline style="max-width: 600px" class="ml-[-40px]">
        <el-timeline-item :timestamp="item.time" placement="top" v-for="(item, index) in info.list" :key="index">
          <el-card>
            <p>{{ item.status }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>

    </el-card>

  </el-drawer>

</template>

<script setup>
import { ref } from 'vue'
// 导入物流信息
import { getShipInfo } from '~/api/order.js'
import { toast } from '~/composables/util'
const dialogVisible = ref(false)
const info = ref({})
// 打开
const open = (id) => {
  return getShipInfo(id).then(res => {
    // 会有订单号失效的情况
    if (res.status != 0) {//订单号失效情况
      return toast(res.msg, 'error')
    }
    // 成功的情况就需要将信息存起来
    info.value = res.result
    console.log(res.result)
    dialogVisible.value = true
  })
}
// 关闭
const close = () => {
  dialogVisible.value = false

}
defineExpose({
  open,
  close
})
</script>

<style></style>