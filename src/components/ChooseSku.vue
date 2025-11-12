<!-- 选择设置商品规格选项和值组件 -->
<template>
  <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">
    <el-container style="height: 65vh;">
      <!-- 侧边部分 -->
      <el-aside width="220px" class="image-aside">
        <!-- 侧边分为上面内容区域和底部分页部分 -->
        <div class="top">
          <!-- 侧边列表 -->
          <div class="sku-list" :class="{ 'active': (activeId == item.id) }" v-for="(item, index) in tableData"
            :key="index" @click="handleChangeActive(item)">
            {{ item.name }}
          </div>
        </div>
        <!-- 分页部分 -->
        <div class="bottom">
          <el-pagination background layout="prev, next" :total="total" :current-page="currentPage" :page-size="limit"
            @current-change="getData" />
        </div>
      </el-aside>
      <!-- 内容部分 -->
      <el-main>
        <!-- 通过多选框遍历 -->
        <el-checkbox-group v-model="form.list" size="small">
          <el-checkbox v-for="(item) in list" :key="item" :label="item" border>
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </el-main>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
// 引入获取列表数据接口
import { getSkusList } from '~/api/skus.js'
import { useInitTable } from '~/composables/useCommon.js'
// 引入分页
const {
  loading,
  currentPage,
  total,
  tableData,
  limit,
  getData,
} = useInitTable({
  getList: getSkusList,
  // 需求：默认选中列表第一个为激活状态，成功获取数据后要进行其他设置，就用自定义方法
  onGetListSuccess: (res) => {
    // console.log(res)

    total.value = res.totalCount//总页数
    tableData.value = res.list//把拿到的值给table
    // 如果列表有数据
    if (tableData.value.length > 0) {
      // 拿到第一个数据的数据

      // 触发激活状态
      handleChangeActive(tableData.value[0])
    }
  }

})
const dialogVisible = ref(false)
const activeId = ref(0)

// 想通过父组件打开弹框
// 1.定义打开弹框方法
// 子组件（ChooseSku）打开弹窗时，接收父组件传过来的 “回调函数”；
// 等子组件点 “确定” 提交数据时，再通过这个函数把表单数据回传给父组件
// a. 定义 “存回调函数的容器”:这个容器专门用来存父组件传过来的 “回调函数”（也就是那张 “收货单”）
// 。初始值设为 null，表示一开始还没收到父组件的函数。
const callbackFunction = ref(null)
// b.打开弹窗的方法：接收父组件的 “收货单”
const open = (callback = null) => {
  callbackFunction.value = callback//callback是父组件传过来的 把父组件的回调存进容器
  // 打开的时候就获取第一页·数据
  getData(1)
  dialogVisible.value = true

}
const list = ref([])
const form = reactive({
  name: "",
  // 代表选中的值
  list: []
})
// 点击就切换为激活状态的样式
function handleChangeActive(item) {
  activeId.value = item.id
  // 点击成激活状态后，显示对应内容
  list.value = []//点击时将list清空
  // console.log(tableData)列表对应内容是default
  let listItem = tableData.value.find(o => o.id == item.id)
  if (listItem) {
    list.value = listItem.default.split(",")
    form.name = listItem.name
    // 要把form里的数据传回父组件SkusCard
  }

}
// c. 提交按钮的方法：用 “收货单” 给父组件传数据
const submit = () => {
  if (typeof callbackFunction.value === 'function') {
    callbackFunction.value(form)// 调用回调函数，把表单数据传过去
  }
  dialogVisible.value = false
}
// 2.通过defineExpose将方法导出去
defineExpose({
  open
})
// 3.在父组件中引入子组件，并使用子组件，使用ref使用子组件里的方法
</script>

<style>
.image-aside {
  border-right: 1px solid #eeeeee;
  /* 想要实现滚动条要给父元素加 position: relative; */
  position: relative;
  height: 100%;
}

.image-aside .top {
  /* 滚动条 */
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-aside .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}

/* 列表样式 */
.sku-list {
  border-bottom: 1px solid #f4f4f4;
  @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}

.sku-list:hover,
.active {
  @apply bg-blue-50;
}
</style>