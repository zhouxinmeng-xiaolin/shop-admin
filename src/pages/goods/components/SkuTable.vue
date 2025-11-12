<!-- 该组件是做规格表格 -->
<template>
  <el-form-item label="规格设置">
    <table class="border">
      <!-- 表头 -->
      <thead>
        <!-- 第一行 -->
        <tr>
          <th class="border" v-for="(th, thi) in tableThs" :key="thi" :width="th.width" :rowspan="th.rowspan"
            :colspan="th.colspan">
            {{ th.name }}
          </th>
        </tr>
        <!-- 第二行 遍历规格数组-->
        <tr>
          <th class="border" v-for="(th, thi) in skuLables" :key="thi">
            {{ th.name }}
          </th>
        </tr>
      </thead>
      <!-- 表格身体 -->
      <tbody>
        <tr v-for="(item, index) in sku_list" :key="index">
          <td class="border text-center" v-for="(sku, skuI) in item.skus" :key="skuI">{{ sku.value }}</td>
          <td class="boredr">
            <el-input v-model="item.pprice" size="small" type="number">
            </el-input>
          </td>
          <td class="boredr">
            <el-input v-model="item.oprice" size="small" type="number">
            </el-input>
          </td>
          <td class="boredr ">
            <el-input v-model="item.cprice" size="small" type="number">
            </el-input>
          </td>
          <td class="boredr">
            <el-input v-model="item.stock" size="small" type="number">
            </el-input>
          </td>
          <td class="boredr">
            <el-input v-model="item.weight" size="small" type="number">
            </el-input>
          </td>
          <td class="boredr">
            <el-input v-model="item.code" size="small" type="number">
            </el-input>
          </td>
        </tr>
      </tbody>
    </table>
  </el-form-item>

</template>

<script setup>
// 引入初始化表格方法
import {
  initSkuTable
} from '~/composables/useSku.js'

const {
  skuLables,
  tableThs,
  sku_list
} = initSkuTable()
console.log(sku_list.value)
</script>

<style></style>