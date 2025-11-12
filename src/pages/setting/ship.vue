<!-- 支付设置 -->
<!-- 配置模块 -->
<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="160px" :inline="false">
      <el-tabs>
        <el-form-item label="物流查询key">
          <div>
            <el-input v-model="form.ship" placeholder="物流查询key">
            </el-input>
            <small class="flex text-gray-400">
              用于查询物流信息，接口申请(仅供参考)</small>
          </div>
        </el-form-item>
        <!-- 保存按钮 -->
        <el-form-item>
          <el-button type="primary" size="default" @click="submit">保存</el-button>
        </el-form-item>
      </el-tabs>

    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  getSysconfig,
  setSysconfig,
} from '~/api/sysconfig.js'
import { toast } from '../../composables/util'

const loading = ref(false)
// 表单数据
const form = reactive({
  ship: '',
})
// 获取数据方法
const getData = () => {
  loading.value = true
  getSysconfig()
    .then(res => {//获取数据成功
      console.log(res)
      // 因为res有很多数据是不传的
      for (const key in form) {
        form[key] = res[key]//将后端数据传给form
      }
    })
    .finally(() => {
      loading.value = false

    })
}
getData()

// 保存提交方法
const submit = () => {
  loading.value = true
  setSysconfig({
    ...form,
  })
    .then(res => {
      toast('修改成功')
      getData()

    })
    .finally(() => {
      loading.value = false

    })
}

</script>

<style></style>