<!-- 导出excel模块 -->
<template>
  <el-drawer title="导出订单" v-model="dialogVisible" size="40%">
    <el-form :model="form">
      <el-form-item label="订单类型">
        <el-select v-model="form.tab" placeholder="请选择">
          <el-option v-for="item in props.tabs" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <!-- 表单按钮部分 -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">导出</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>

</template>

<script setup>
import { toast } from '~/composables/util.js'
import { ref, reactive } from 'vue'
// 引入导出订单接口
import { exportOrder } from '~/api/order.js'
const dialogVisible = ref(false)
const props = defineProps({
  tabs: Array
})
// 表单数据
const form = reactive({
  tab: null,
  time: ""
})
// 打开
const open = () => {
  dialogVisible.value = true
}
// 关闭
const close = () => {
  dialogVisible.value = false
}

// 导出提交按钮
const loading = ref(false)
const onSubmit = () => {
  // console.log(form.time)输出数组，0位置为开始时间，1位置为结束时间
  if (!form.tab) {//tab是必填
    return toast('订单类型不能为空', 'error')
  }
  loading.value = true
  let starttime = null
  let endtime = null
  if (form.time && Array.isArray(form.time)) {
    starttime = form.time[0]
    endtime = form.time[1]
  }
  exportOrder({//query传参方式
    tab: form.tab,
    starttime,
    endtime
  })
    .then(res => {//导出成功后
      // 前端导出 Excel 文件
      // 1. 把后端返回的文件流转成浏览器能识别的临时URL
      let url = window.URL.createObjectURL(new Blob([res]))

      // 2. 创建一个隐藏的a标签（用于触发下载）
      let link = document.createElement('a')
      link.style.display = "none" // 不显示这个a标签

      // 3. 给a标签设置下载地址
      link.href = url // 用上面生成的临时URL作为下载地址

      // 4. 设置下载的文件名（比如“1620000000000.xlsx”）
      let filename = (new Date()).getTime() + '.xlsx' // 用时间戳当文件名，避免重复
      link.setAttribute('download', filename) // 告诉浏览器：点击时下载这个文件，名字是filename

      // 5. 把a标签加到页面里，然后模拟点击下载
      document.body.appendChild(link) // 把a标签偷偷加到页面
      link.click() // 模拟用户点击a标签，触发下载

      // 6. 关闭弹窗（如果有导出弹窗的话）
      close()
    })
    .finally(() => {
      loading.value = false
    })
}
defineExpose({
  open,
  close
})
</script>
