<template>
  <div class="f-tag" :style="{ left: $store.state.asideWidth }">
    <!-- 标签 -->
    <el-tabs v-model="activeTab" type="card" class="demo-tabs" @tab-remove="removeTab" style="min-width: 100px;"
      @tab-change="changeTab">
      <el-tab-pane :closable="item.path != '/'" v-for="item in tabList" :key="item.path" :label="item.title"
        :name="item.path">
      </el-tab-pane>
    </el-tabs>

    <!-- 下拉菜单 -->
    <span class="tag-dropdown">
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link">
          <!-- 下拉图标 -->
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
  <!-- 相当于占位符 -->
  <div style="height: 44px"></div>
</template>
<!-- 标签导航组件实现功能：点击menu中的元素，会在导航栏中显示
 需求：让两个组件进行通讯
 使用vue-router提供的onBeforeRouteUpdate进行监听
 逻辑：使用onBeforeRouteUpdate进行监听跳转->使用addTab()添加标签导航，要判断之前是否添加过tab，没有添加过
 就使用push方法进行添加 ->存储到cookie里 -> 想点击tab就能切换到对应页面：使用tab-change -->



<script setup>
import { useTabList } from '~/composables/useTabList';
const {
  activeTab,
  tabList,
  changeTab,
  removeTab,
  handleClose
} = useTabList()
</script>

<style scoped>
.f-tag {
  @apply fixed bg-gray-100 flex items-center px-2;
  height: 44px;
  top: 64px;
  right: 0;
  z-index: 100;
}

.tag-dropdown {
  @apply flex items-center ml-auto px-1 bg-white rounded;
  top: 64px;
  height: 32px;
  width: 32px;

}

:deep(.el-tabs__header) {
  border: 0 !important;
  margin: 0 0 0;
}

:deep(.el-tabs__nav) {
  border: none !important;
}

:deep(.el-tabs__item) {
  border: none !important;
  @apply bg-white mx-1 rounded;
  height: 32px;
  line-height: 32px;
}
</style>