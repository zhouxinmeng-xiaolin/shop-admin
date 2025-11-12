<!-- 该文件是用来封装gsap库里的，用来实现数字的跳动 -->

<template>
  <!--   滚动时小数点后的位数太多，保留两位小数 -->
  {{ data.num.toFixed(2) }}
</template>
<script setup>
// 引入gsap库
import gsap from "gsap"
import { reactive, watch } from 'vue'
// 要接收从index.vue组件里面传过来的数据，可以使用defineProps接收
const props = defineProps({
  // 接收数据,该值是希望滚动到的终点
  value: {
    type: Number,
    default: 0
  }
})
// 因为数据是动态的，就可以定义为响应式数据
const data = reactive({
  // 滚动的数字放在num里
  num: 0
})
//定义动画方法
function AnimateTovalue() {
  // 使用gsap.to方法
  gsap.to(data, {
    // 相当于通过0.5s的动画将num值变为value值，实现动画
    duration: 0.5,//持续时间
    num: props.value
  })
}
AnimateTovalue()
// 监听
// 这里的watch功能很简单，就是 “盯着” 从外面传进来的value值。
// 当value值发生变化时（比如从 10 变成 20，或者从 50 变成 100），
// watch就会立刻察觉到，然后自动调用AnimateTovalue()这个函数，让数字重新从当前值动画跳转到新的value值。
// 没有watch的话，只有第一次会有动画，后面value再变，数字就不会动了。
watch(() => props.value, () => AnimateTovalue())
</script>

<style></style>