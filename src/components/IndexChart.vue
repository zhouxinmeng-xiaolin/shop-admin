<!-- 该文件是用于封装图表组件 -->
<template>
  <!-- 卡片 -->
  <el-card shadow="never">
    <!-- 卡片头部 -->
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">订单统计</span>
        <div>
          <!-- checked 就是控制这个 <el-check-tag> 组件是否 “被选中” 的开关。 -->
          <!-- 实现options之间的切换 添加click事件-->
          <!-- 判断 “当前选中的 current” 和 “当前标签的 item.value” 是否相等，相等就选中，不相等就不选中。 -->
          <el-check-tag :checked="current == item.value" v-for="(item, index) in options" :key="index"
            style="margin-right:8px" @click="handleChoose(item.value)">
            {{ item.text }}
          </el-check-tag>
        </div>
      </div>
    </template>
    <!-- 柱状图图表  卡片身体-->
    <div id="chart" ref="el" style="width: 100%;height: 300px;"></div>
  </el-card>

</template>

<!-- 要拿到chart的DOM元素，一定要渲染完才能拿，就要使用生命周期 ,因为setup这里生命周期还没有渲染-->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
// 引入图表
import * as echarts from 'echarts';
// 引入API接口方法
import { getStatistics3 } from '~/api/index.js'
// 引入针对页面缩放resize
import { useResizeObserver } from '@vueuse/core'
// 定义响应当前状态的默认值
const current = ref("week")
const options = [{
  text: '近1个月',
  value: "month"
}, {
  text: '近1周',
  value: "week"
}, {
  text: '近24小时',
  value: "hour"
},
]

// 实现options之间的切换
const handleChoose = (type) => {
  // 将current.value换为当前点击的值
  current.value = type
  // 想要实现点击options后就切换数据,调用getdata()重新获取数据
  getData()

}
// 等页面渲染完毕才能拿到DOM值
var myChart = null
onMounted(() => {
  var chartDom = document.getElementById('chart');
  myChart = echarts.init(chartDom);
  getData()
})
// 在图表容器被销毁之后，调用 echartsInstance.dispose 销毁实例，
// 在图表容器重新被添加后再次调用 echarts.init 初始化。
onBeforeUnmount(() => {
  // 如果有图表就要进行销毁
  if (myChart) {
    echarts.dispose(myChart)
  }
})

// 获取数据方法
function getData() {
  let option = {
    // x轴
    xAxis: {
      type: 'category',
      data: []
    },
    // y轴
    yAxis: {
      type: 'value'
    },
    // 柱状图数据：每个日期对应的订单数
    series: [
      {
        data: [],
        type: 'bar'
      }
    ]
  };

  // option && myChart.setOption(option);


  // 想要实现在在切换日期的时候有loading加载状态
  // 在获取数据前，显示loading
  myChart.showLoading();
  // 将当前选中的值拿进来，相当于将后端的数据拿出来
  getStatistics3(current.value)
    .then((res) => {
      // console.log(res)
      // 要将后端发过来的数据放在图表上
      option.xAxis.data = res.x
      option.series[0].data = res.y
      myChart.setOption(option)

    }).finally(() => {
      myChart.hideLoading();
    })

}
const el = ref(null)
// <!-- 想要实现页面缩放时图表变化不乱--使用vueuse里的resize -->
useResizeObserver(el, (entries) => {
  // console.log(entries)
  // 使用Echarts里的resize改变图表尺寸
  myChart.resize()
})
</script>

<style></style>