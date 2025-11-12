<template>
  <!-- el-container外部容器 -->
   <!-- el-header头部 -->
  <el-container>
    <el-header><FHeader/></el-header>
    <el-container>
      <el-aside :width="$store.state.asideWidth">
        <FMenu/>
      </el-aside>
      <el-main>
        <FTagList/>
        <!-- 主要内容用router-view渲染 -->
         <!-- 解构组件：从一堆东西里，精准拿出我们需要的那个‘组件’” -->
          <!-- {Component} 解构就像 “精准提取”—— 从 router-view 提供的信息里，直接拿出当前路由对应的页面组件，目的
           是让我们能对这个组件做额外操作（比如缓存、加动画、权限控制等）， 。不是让它被 router-view 直接显示就完事了。 -->
        <router-view v-slot="{Component}">
          <!-- 最多只能缓存十个，最久没有被访问的就会被清除 -->
          <transition name="fade">
            <keep-alive :max="10">
            <component :is="Component"></component>
            </keep-alive>
          </transition>
        </router-view>

      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
// 引入组件
import FHeader from './components/FHeader.vue';
import FMenu from './components/FMenu.vue';
import FTagList from './components/FTagList.vue';
</script>

<style>
.el-aside{
  transition: all 0.2s;
}
/* 实现效果：由透明改为不透明 */
/* 进入之前动画 */
.fade-enter-from{
  /* 透明度为0 */
   opacity: 0;
}
/* 进入之后动画 */
.fade-enter-to {
   opacity: 1;
}
/* 离开之前动画 */
.fade-leave-from{
  opacity: 1;
}
/* 离开之后动画 */
.fade-leave-to{
   opacity: 0;
}
/* 加上动画时长等效果 */
/* 进入动画 */
.fade-enter-active,
.fade-leave-active {
  /* 希望所有都有动画效果，动画时间为0.3s */
  transition: all 0.3s;
}
/* 想实现功能：在切换时，先让动画走完再进入下一个界面 
实现方法：将进入动画时长延长*/
.fade-enter-active{
  transition-delay: 0.3s;
}
</style>


