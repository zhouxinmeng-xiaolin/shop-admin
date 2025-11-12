<!-- 封装搜索功能 -->
<template>
  <el-form :model="model" label-width="80px" class="mb-3" size="small">
    <el-row :gutter="20">
      <!-- 想要将商品名称和商品分类暴露出去，这样父组件可以更改里面的数据，提高复用 -->
      <!-- 1.写插槽slot -->
      <slot />
      <!-- 该插槽不是一直显示的，当showSearch为true才显示 -->
      <template v-if="showSearch">
        <slot name="show" />
      </template>
      <!-- 按钮 -->
      <el-col :span="8" :offset="showSearch ? 0 : 8">
        <div class="flex items-center justify-end">
          <el-button type="primary" @click="$emit('search')">搜索</el-button>
          <el-button @click="$emit('reset')">重置</el-button>
          <!-- 想要实现当没有高级搜索时，就不显示展开收起：当商品分类插槽没有内容就不显示，即名字为show的插槽没有内容
           ->要使用useSlot获取插槽内容 -->
          <el-button v-if="hasSearchShow" type="primary" text @click="showSearch = !showSearch">{{ showSearch ? '收起' :
            '展开' }}
            <el-icon>
              <ArrowUp v-if="showSearch == '收起'" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>

        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, useSlots } from 'vue'
defineProps({
  model: Object
})
// <!--getData和 resetSearchForm在本文件中调用不到？怎么解决？通过组件之间交互，使用defineEmits暴露方法出去 -->
defineEmits(['search', 'reset'])
// 控制收起和展开
const showSearch = ref(false)
// 获取插槽内容
const slots = useSlots()
// console.log(slots)  会发现商品管理的插槽有default和show，而管理员插槽只有default
// 看slots.show有没有值,!!强行转换为boolean值
const hasSearchShow = ref(!!slots.show)
</script>

<style></style>