<!-- 封装刷新和新增模板 -->
<template>
  <!-- 新增|刷新 -->
  <div class="flex items-center  justify-between mb-4">
    <!-- 新增按钮 -->
    <!-- $emit('create')通知父组件要用create事件 -->
    <div class="flex items-center ">
      <el-button type="primary" v-if="btns.includes('create')" size="small" @click="$emit('create')">新增</el-button>
      <!-- 通知父组件要用删除事件 -->
      <!-- 使用气泡确认框 -->
      <el-popconfirm v-if="btns.includes('delete')" title="是否删除选中记录?" confirm-button-text="确认" cancel-button-text="取消"
        @confirm="$emit('delete')">
        <template #reference>
          <!-- 删除按钮 -->
          <el-button type="danger" size="small">批量删除</el-button>
        </template>
      </el-popconfirm>

      <!-- 上架下架按钮 -->
      <slot />
    </div>
    <div>
      <!-- 刷新提示 -->
      <el-tooltip effect="dark" v-if="btns.includes('refresh')" content="刷新数据" placement="top">
        <!-- 由于刷新的是当前页不需要传参数 -->
        <el-button text @click="$emit('refresh')" size="small">
          <!-- 刷新图标 -->
          <el-icon :size="15">
            <Refresh />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- 导出数据 -->
      <el-tooltip effect="dark" v-if="btns.includes('download')" content="导出数据" placement="top">
        <el-button text @click="$emit('download')" size="small">
          <!-- 刷新图标 -->
          <el-icon :size="15">
            <Download />
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';


// 想要实现在角色管理页面中不显示批量删除按钮，在规格管理页面显示
// 1.在父组件中使用layout：<ListHeader layout="create,delete,refresh" />
// 2.在子组件中使用defineProps接收layout
const props = defineProps({
  layout: {
    type: String,
    // 默认
    default: "create,refresh"
  }
})
// 3.将props转为一维数组
const btns = computed(() => props.layout.split(","))
// 4.去按钮上使用v-if判断数组里包含delete就显示，使用includes
defineEmits(["create", "refresh", "delete", "download"])
</script>

<style></style>