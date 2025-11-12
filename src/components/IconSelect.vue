<!-- 该组件是封装图标选择 -->
<template>
  <div class="flex items-center">
    <!-- 只有选中的时候才显示 -->
    <el-icon :size="20" v-if="modelValue" class="mr-2">
      <!-- 动态图标 -->
      <component :is="modelValue" />
    </el-icon>
    <!-- handleChange监听选择变化  filterable可进行筛选-->
    <el-select filterable :modelValue="modelValue" placeholder="请选择图标" style="width: 240px" @change="handleChange">
      <el-option v-for="item in icons" :key="item" :label="item" :value="item">
        <div class="flex items-center justify-between">
          <el-icon>
            <!-- 动态图标 -->
            <component :is="item" />
          </el-icon>
          <span class="text-gray-500">{{ item }}</span>
        </div>
      </el-option>

    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 引入图标
import * as iconList from '@element-plus/icons-vue'
const icons = ref(Object.keys(iconList))
// 实现组件间的双向联动
defineProps({
  modelValue: String
})
const emit = defineEmits(["update:modelValue"])
// console.log(Object.keys(iconList))//拿到图标的名字组成的一维数组
const handleChange = (icon) => {//e代表选中的值
  emit("update:modelValue", icon)
}
</script>

<style></style>