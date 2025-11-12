<!-- 该组件是只用于goods的局部组件，用于设置多规格 -->
<template>
  <el-form-item label="规格选项" v-loading="bodyLoading">
    <el-card shadow="never" class="w-full mb-3" v-for="(item, index) in sku_card_list" :key="item.id"
      v-loading="item.loading">
      <!-- 卡片头部 -->
      <template #header>
        <div class="flex items-center">
          <!-- <!-当输入框发生改变就调用修改规格选项方法-  -->
          <el-input v-model="item.text" placeholder="规格名称" style="width: 200px;" @change="handleUpdate(item)">
            <template #append>
              <!-- 三个小点 -->
              <el-icon class="cursor-pointer" @click="handleChooseSku(item)">
                <more />
              </el-icon>
            </template>
          </el-input>
          <!-- 上移 -->
          <el-button size="small" class="ml-auto" @click="sortCard('up', index)" :disabled="index === 0">
            <el-icon>
              <Top />
            </el-icon>
          </el-button>
          <!-- 下移 -->
          <el-button size="small" @click="sortCard('down', index)" :disabled="index === (sku_card_list.length - 1)">
            <el-icon>
              <Bottom />
            </el-icon>
          </el-button>

          <!-- 删除 -->
          <el-popconfirm title="是否删除该选项?" confirm-button-text="确认" cancel-button-text="取消"
            @confirm="handleDelete(item)">
            <template #reference>
              <!-- 删除按钮 -->
              <el-button size="small">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </template>
          </el-popconfirm>

        </div>

      </template>
      <!-- 卡片身体 --单独放在组件处理-->
      <SkuCardItem :skuCardId="item.id" />
    </el-card>
    <el-button type="success" size="small" :loading="btnLoading" @click="addSkuCardEvent">添加规格</el-button>
  </el-form-item>
  <ChooseSku ref="ChooseSkuRef" />
</template>

<script setup>
import { computed, ref } from 'vue'
// 引入规格卡片身体部分
import SkuCardItem from './SkuCardItem.vue';
// 引入交互规格组件
import {
  sku_card_list,
  addSkuCardEvent,
  btnLoading,
  handleUpdate,
  handleDelete,
  sortCard,
  bodyLoading,
  handleChooseSetGoodsSkusCard
} from '~/composables/useSku.js'
// 引入置商品规格选项和值组件
import ChooseSku from '~/components/ChooseSku.vue'
const ChooseSkuRef = ref(null)
const handleChooseSku = (item) => {
  // 打开弹框
  ChooseSkuRef.value.open((value) => {
    // 回调接收的值就是ChooseSku里form表单的值
    // console.log(value)拿到了选择的规格值
    handleChooseSetGoodsSkusCard(item.id, {
      name: value.name,
      value: value.list
    })
  })
}


</script>

<style>
.el-card__header {
  @apply !p-2 bg-gray-50;
}
</style>