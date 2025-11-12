<!-- 商品规格组件 -->
<template>
  <FormDrawer ref="formDrawerRef" title="设置商品规格" @submit="submit" size="70%">
    <el-form :model="form">
      <el-form-item label="规格类型">
        <el-radio-group v-model="form.sku_type">
          <el-radio :label="0">
            单规格
          </el-radio>
          <el-radio :label="1">
            多规格
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 显示单规格表单 -->
      <template v-if="form.sku_type == 0">
        <el-form-item label="市场价格">
          <el-input v-model="form.sku_value.oprice" style="width: 35%;">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input v-model="form.sku_value.pprice" style="width: 35%;">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input v-model="form.sku_value.cprice" style="width: 35%;">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.sku_value.weight" style="width: 35%;">
            <template #append>公斤</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input v-model="form.sku_value.volume" style="width: 35%;">
            <template #append>立方米</template>
          </el-input>
        </el-form-item>
      </template>
      <!-- 显示多规格表单 -->
      <template v-else>
        <!-- 规格表单 -->
        <SkusCard />
        <!-- 规格表格 -->
        <SkuTable />
      </template>
    </el-form>
  </FormDrawer>


</template>

<script setup>
import { ref, reactive } from 'vue'
// 引入封装好的弹框
import FormDrawer from "~/components/FormDrawer.vue"
import { toast } from '~/composables/util.js'
// 引入规格组件
import SkusCard from './components/SkusCard.vue'
// 引入规格表格组件
import SkuTable from './components/SkuTable.vue'
// 引入规格数据交互相关
import {
  goodsId,
  initSkuCardList,
  sku_list

} from '~/composables/useSku.js'
// 引入查看资料接口
import {
  readGoods,
  updateGoodsSkus
} from '~/api/goods.js'

const formDrawerRef = ref(null)
// 表单元素
const form = reactive({
  sku_type: 0,
  sku_value: {
    "oprice": 0,
    "pprice": 0,
    "cprice": 0,
    "weight": 0,
    "volume": 0
  }
})

// 打开
const open = (row) => {
  // console.log(row),这里可以拿到当前点击商品id，就可以查看商品资料
  goodsId.value = row.id

  row.skusLoading = true
  // 查看商品资料
  readGoods(goodsId.value)
    .then(res => {//查看资料成功后所作操作
      // form.content = res.content
      form.sku_type = res.sku_type
      form.sku_value = res.sku_value || {
        "oprice": 0,
        "pprice": 0,
        "cprice": 0,
        "weight": 0,
        "volume": 0
      }

      initSkuCardList(res)
      formDrawerRef.value.open()
    })
    .finally(() => {
      row.skusLoading = false

    })

}
const emit = defineEmits(["reload-data"])
// 给按钮加loading
const loading = ref(false)
// 提交方法
const submit = () => {
  formDrawerRef.value.showLoading()
  let data = {
    sku_type: form.sku_type,
    sku_value: form.sku_value,
  }
  if (form.goodsSkus == 1) {
    // 给对象追加数据
    data.goodsSkus = sku_list.value
  }
  updateGoodsSkus(goodsId.value, data)
    .then(res => {//设置轮播图成功后
      // 提示
      toast('设置商品规格成功')
      // 关闭轮播图弹框
      formDrawerRef.value.close()
      // 刷新列表页
      emit("reload-data")

    })
    .finally(() => {
      formDrawerRef.value.hideLoading()
    })
}

defineExpose({
  open
})
</script>

<style></style>