<template>
  <div class="aside-list" :class="{ 'active': active }">
    <!-- truncate超出的部分会给... -->
    <span class="truncate">
      <slot />
    </span>
    <!-- 按钮图标 -->
    <el-button class="ml-auto px-1" text type="primary" size="small" @click.stop="$emit('edit')">
      <el-icon :size="12">
        <Edit />
      </el-icon>
    </el-button>
    <!-- 阻止冒泡 -->
    <span @click.stop="() => { }">
      <el-popconfirm title="是否要删除?" confirm-button-text="确认" cancel-button-text="取消" @confirm.stop="$emit('delete')">
        <template #reference>
          <el-button text type="primary" size="small">
            <el-icon :size="12">
              <Close />
            </el-icon>
          </el-button>
        </template>
      </el-popconfirm>
    </span>
  </div>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
// 将两个按钮事件暴露出去
defineEmits(['edit', 'delete'])
</script>

<style>
.aside-list {
  border-bottom: 1px solid #f4f4f4;
  @apply flex items-center p-3 text-sm text-gray-600;
  cursor: pointer;
}

.aside-list:hover,
.active {
  @apply bg-blue-50;
}
</style>