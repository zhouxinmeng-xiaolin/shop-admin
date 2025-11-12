<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-center">
        <!-- 头部左边部分---标题 -->
        <span class="text-sm">{{ title }}</span>
        <!-- 头部右边部分---tag    type对应颜色值-->
        <el-tag type="danger" effect="plain" class="ml-auto">
          {{ tip }}
        </el-tag>
      </div>
    </template>
    <!-- body部分·也是用的卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" :offset="0" v-for="(item, index) in btns" :key="index">
        <!-- 卡片，一共有四个 -->
        <el-card shadow="hover" class="border-0 bg-light-400 ">
          <div class="flex flex-col items-center justify-center">
            <span class="text-xl mb-2">{{ item.value }}</span>
            <span class="text-xs text-gray-500">{{ item.label }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </el-card>

</template>

<script setup>
defineProps({
  title: String,
  tip: String,
  btns: Array
})
</script>

<style></style>