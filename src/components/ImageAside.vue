<!-- 图库列表中的侧边部分 -->

<template>
  <!-- 侧边部分· -->
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <!-- 侧边分为上面内容区域和底部分页部分 -->
    <div class="top">
      <!-- 侧边列表 -->
      <AsideList :active="activeId == item.id" v-for="(item, index) in list" :key="index" @edit="handleEdit(item)"
        @delete="handleDelete(item.id)" @click="handleChangeActiveId(item.id)">
        {{ item.name }}
      </AsideList>
    </div>
    <!-- 分页 -->
    <div class="bottom">
      <el-pagination background layout="prev, next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
  </el-aside>
  <!-- 调用表单抽屉 -->
  <FormDrawer :title="drawerTitle" ref="FormDrawerRef" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.order" prop="order" :min="0" :max="1000" />
      </el-form-item>
    </el-form>

  </FormDrawer>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
// 引入接口
import {
  getImageClassList,
  createImageClassList,
  updateImageClassList,
  deleteImageClassList
} from '~/api/image_class.js'
import AsideList from './AsideList.vue';
// 引入写好的表单抽屉组件
import FormDrawer from './FormDrawer.vue';
// 引入消息提示工具
import { toast } from '~/composables/util.js'
// 加载动画
const loading = ref(false)
const list = ref([])

// 修改和新增的id
const editId = ref(0)
// 抽屉标题
const drawerTitle = computed(() => editId.value ? "修改" : "新增")

// 分页部分--想要与接口进行交互
const currentPage = ref(1)//当前页数默认为1
const total = ref(0)//总条数默认为0
const limit = ref(10)//每页默认显示10条

// 获取数据方法
function getData(p = null) {
  // console.log(p)  这里p拿到的是2，页数2
  if (typeof p == "number") {
    // 这个判断用来接收分页器传来的新页码，更新当前页码后再去请求对应页的数据。
    currentPage.value = p
  }
  // 请求拿数据时让loading为true
  loading.value = true
  // 还没分页先默认拿第一页，获取当前页码的数据
  getImageClassList(currentPage.value)
    .then((res) => {
      // console.log(res)
      total.value = res.totalCount
      // 将后端的数据给list
      list.value = res.list
      // 想要进入页面的时候默认选择第一个为激活状态
      let item = list.value[0]
      if (item) {
        handleChangeActiveId(item.id)
      }

    }).finally(() => {
      loading.value = false
    })
}
// 调用方法
getData()

// 增加列表--抽屉部分
const FormDrawerRef = ref(null)


// 抽屉表单内容
const form = reactive({
  name: '',
  order: 50
})
// 验证规则---规则是一个对象
const rules = {
  name: [{
    required: true,
    message: '图库分类名称不能为空',
    trigger: 'blur'
  }]
}
const formRef = ref(null)
// 验证方法
// 提交
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      return
    }

    FormDrawerRef.value.showLoading()//z在请求接口前处于loading状态
    // 验证通过后提交的数据要往后端传
    // 要通过editId的值进行判断，是进行新增还是修改,editId>0修改,fun得到的是promise对象
    const fun = editId.value ? updateImageClassList(editId.value, form) : createImageClassList(form)
    //新增接口
    fun.then((res) => {//请求成功结果
      // console.log(res)输出为{name: '小霖', order: 50, id: '603'}
      // 提示提交成功
      toast(drawerTitle.value + '成功')
      // 得到了数据，要将数据放在列表中，重新加载数据
      getData(editId.value ? currentPage.value : 1)
      // 关闭弹框
      FormDrawerRef.value.close()
    })
      .finally(() => {//请求结束后隐藏loading
        FormDrawerRef.value.hideLoading()
      })
  })
}

// 新增列表
const handleCreate = () => {
  editId.value = 0
  form.name = ''
  form.order = 50
  FormDrawerRef.value.open()
}


// 修改列表

const handleEdit = (row) => {
  // console.log(row)  输出{id: 168, name: '化妆品', order: 1001, images_count: 27}
  editId.value = row.id
  // 将抽屉表单的内容进行初始化，变成现在要点击修改的内容
  form.name = row.name
  form.order = row.order
  // 打开抽屉
  FormDrawerRef.value.open()
}
// 删除列表
const handleDelete = (id) => {
  loading.value = true
  deleteImageClassList(id)
    .then((res) => {
      toast('删除成功')
      // 重新获取数据
      getData()

    })
    .finally(() => {
      loading.value = false
    })
}

// 选中图库分类ID 
const activeId = ref(0)
// 想要实现list能够接收ImageMain里的loadData方法？怎么办？ 
const emit = defineEmits(['change'])
// 点击进行切换分类
function handleChangeActiveId(id) {
  activeId.value = id
  emit('change', id)
}
// 暴露方法
defineExpose({
  handleCreate
})
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
</style>