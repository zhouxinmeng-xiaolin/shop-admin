<template>
  <!-- 指定显示路由组件的位置 -->
  <router-view></router-view>
</template>

<script>
export default {

}
</script>

<style>
/* 给body背景颜色 */
body {
  @apply bg-gray-100;
}

#nprogress .bar {
  background-color: #f4f4f4 !important;
  height: 3px !important;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-corner {
  display: block;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
}

/* 轨道
 */
::-webkit-scrollbar-thumb,
::-webkit-scrollbar-track {
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>