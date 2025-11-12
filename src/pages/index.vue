<template>
  <div>
    <!-- 分为四栏 用element里的layout布局使用24分栏-->
    <el-row :gutter="20">
      <!-- 想要实现：在数据内容还没有显示出来时骨架屏先出来，在设置loading加载状态 ---使用element骨架屏
     v-for="i in 4"分为4份-->
      <!-- 当数组长度等于0的时候才显示 -->
      <template v-if="panels.length === 0">
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
                <!-- 分割线使用element提供的divider -->
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>
      <!-- 使用v-for将res数组里的值遍历出来 -->
      <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
        <!-- 卡片 -->
        <!-- shadow="always"阴影效果  -->
        <el-card shadow="hover" class="border-0">
          <!-- 头部插槽 -->
          <template #header>
            <div class="flex justify-center">
              <!-- 头部左边部分---标题 -->
              <span class="text-sm">{{ item.title }}</span>
              <!-- 头部右边部分---tag    type对应颜色值-->
              <el-tag :type="item.unitColor || 'info'" effect="plain" class="ml-auto">
                {{ item.unit }}
              </el-tag>
            </div>
          </template>
          <!--  body 部分-->
          <span class="text-3xl font-bold text-gray-500">
            <!-- 调用数字滚动动画组件 -->
            <CountTo :value="item.value" />
          </span>
          <!-- 分割线使用element提供的divider -->
          <el-divider />
          <div class="flex justify-center text-sm text-gray-500">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <IndexNavs />

    <el-row :gutter="20" class="mt-5">
      <el-col :span="12" :offset="0">
        <!-- 放图表 -->
        <IndexChart v-permission="['getStatistics3,GET']" />
      </el-col>
      <el-col :span="12" :offset="0">
        <!-- 放最后一个模块 -->
        <IndexCard title="店铺及商品提示" tip="店铺及商品提示" :btns="goods" class="mb-3" />
        <IndexCard title="交易提示" tip="需要立即处理的交易订单" :btns="order" />
      </el-col>
    </el-row>
  </div>


</template>

<script setup>
// 引入接口---从后端得到的数据
import { getStatistics1, getStatistics2 } from "~/api/index.js"
import { ref } from 'vue'
// 引入数字滚动动画组件
import CountTo from "~/components/CountTo.vue"
// 引入分栏布局组件
import IndexNavs from "~/components/IndexNavs.vue"
// 引入图表组件
import IndexChart from "~/components/IndexChart.vue"
// 引入主页最后一个模块
import IndexCard from "~/components/IndexCard.vue"
// 引入之后就要进行调用--思考需不需要传参--只需要请求头，请求头已经在拦截器传入了--只需调用方法
// .then就可以获取结果
// 使用数组接收res
const panels = ref([])
getStatistics1().then((res) => {
  // console.log(res);得到的是panels数组
  panels.value = res.panels
  // console.log(panels.value);
  // console.log(res)

})
  // .catch获取错误
  .catch((err) => { })

const goods = ref([])
const order = ref([])
// 最后一个模块
getStatistics2().then((res) => {
  // console.log(res)
  goods.value = res.goods
  order.value = res.order
})

</script>

<style></style>