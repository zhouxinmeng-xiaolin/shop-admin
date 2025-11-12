<template>
  <el-row :gutter="20" class="mb-5">
    <template v-if="loading">
      <el-col :span="6" v-for="i in 4" :key="i">
        <!-- 骨架屏 -->
        <el-skeleton style="width: 100%" animated loading>
          <template #template>
            <!-- 卡片 -->
            <!-- shadow="always"阴影效果  -->
            <el-card shadow="hover" class="border-0">
              <!-- 头部插槽 -->
              <template #header>
                <div class="flex justify-between">
                  <!-- 头部左边部分---标题 -->
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <!-- 头部右边部分---tag    type对应颜色值-->
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </template>
              <!--  body 部分-->
              <el-skeleton-item variant="h3" style="width: 80%" />

            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </template>
    <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
      <el-card shadow="never">
        <!-- 卡片身体 -->
        <div class="flex items-center">
          <!-- 图标 -->
          <el-icon :size="20" :class="item.color" class="text-white w-[40px] h-[40px] rounded-full">
            <User v-if="index == 0" />
            <ShoppingCart v-if="index == 1" />
            <PriceTag v-if="index == 2" />
            <Timer v-if="index == 3" />
          </el-icon>
          <div class="ml-2">
            <h2 class="text-lg font-bold">{{ item.value }}</h2>
            <small class="text-xs text-gray-400">{{ item.label }}</small>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>

</template>

<script setup>
import { ref } from 'vue'
import {
  getAgentStatistics,
} from '~/api/distribution.js'
const loading = ref(false)
// 获取数据
const list = ref([])
loading.value = true
getAgentStatistics().then(res => {
  // console.log(res)
  list.value = res.panels
}).finally(() => {
  loading.value = false

})
</script>

<style></style>