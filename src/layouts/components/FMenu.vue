<template>
  <div class="f-menu" :style="{ width: $store.state.asideWidth }">
    <!-- 使用element plus里的菜单结构 -->
    <!--  :default-active="defaultActive"：控制哪个菜单是「高亮选中」的，值是当前路由路径； -->
    <!-- :collapse="isCollapse"：控制菜单是否折叠（true = 折叠，false = 展开） -->
    <!-- unique-opened：只能同时展开一个二级子菜单（避免多个子菜单堆在一起） -->
    <el-menu :default-active="defaultActive" class="border-0" @select="handleSelect" :collapse="isCollapse"
      :collapse-transition="false" unique-opened>

      <!-- unique-opened只能展开一个子菜单 -->
      <template v-for="(item, index) in asideMenus" :key="index">
        <!-- 第一个menu开始 -->
        <!-- 有子菜单才显示父菜单容器 -->
        <el-sub-menu :index="item.name" v-if="item.child && item.child.length > 0">
          <!-- 一级标题 -->
          <template #title>
            <el-icon>
              <!-- 使用component动态组件语法，is后面决定要显示什么组件 -->
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <!-- 二级 -->
          <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath">
            <el-icon>
              <component :is="item2.icon"></component>
            </el-icon>
            <span>{{ item2.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 第一个menu结束 -->
        <!-- 第二个memu 没有子菜单直接渲染为普通菜单项-->
        <el-menu-item v-else :index="item.frontpath">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useStore } from 'vuex'
import { ref } from 'vue'
// 进行路由跳转
const router = useRouter()
const store = useStore()
// 拿到当前路由信息
const route = useRoute()
// 默认获取当前路径显示高亮
const defaultActive = ref(route.path)
// 监听路由变化,当切换导航栏，侧边栏也会跟着变，实现联动
onBeforeRouteUpdate((to, from) => {
  defaultActive.value = to.path
})
// 菜单里的东西
// computed(() => store.state.menus) 的作用是 “创建一个响应式的
//  asideMenus，让它始终与 Vuex 中的 menus 状态保持同步”
const asideMenus = computed(() => store.state.menus)
// 跳转页面
const handleSelect = (e) => {
  // e代表目标路径
  // console.log(e)
  router.push(e)
}

// 控制折叠界面
const isCollapse = computed(() => !(store.state.asideWidth == '250px'))

</script>

<style>
.f-menu {
  /* width: 250px; */
  transition: all 0.2s;
  @apply shadow-md fixed bg-light-50;
  top: 64px;
  left: 0px;
  bottom: 0px;
  /* 超出部分滚动 */
  /* overflow-y: auto 让垂直方向内容超了就显示滚动条 */
  overflow-y: auto;
  /* overflow-x: hidden 让水平方向内容超了也不显示滚动条 */
  overflow-x: hidden;
}

/* 将滚动条隐藏---隐藏的同时能正常滚动 */
.f-menu::-webkit-scrollbar {
  width: 0px;
}
</style>
