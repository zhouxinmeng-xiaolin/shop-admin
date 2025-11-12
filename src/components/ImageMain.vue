<template>
  <!-- 内容部分 -->
  <el-main class="image-main" v-loading="loading">
    <div class="top p-3">
      <!-- <div v-for="(item, index) in list" :key="index">{{ item.url }}</div> -->
      <!-- layout布局 -->
      <el-row :gutter="20">
        <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
          <!-- 卡片 -->
          <!-- :class="{'border-blue-500':item.checked}"选中图片加边框颜色，加不加取决于item.checked -->
          <el-card shadow="hover" class="relative mb-3" :body-style="{ 'padding': 0 }"
            :class="{ 'border-blue-500': item.checked }">
            <!-- fit="cover"图片会按比例放大 / 缩小，直到刚好填满整个正方形容器 -->
            <el-image :src="item.url" fit="cover" class="h-[150px]" style="width:100%" :preview-src-list="[item.url]"
              :initial-index="0"></el-image>
            <!-- 标题 -->
            <div class="image-title">{{ item.name }}</div>
            <!-- 按钮 -->
            <div class="flex items-center justify-center p-2">

              <!-- 选中图片功能 -->
              <el-checkbox v-model="item.checked" v-if="openChoose" @change="handleChooseChange(item)" />
              <el-button type="primary" size="small" text @click="handleEdit(item)">重命名</el-button>
              <el-popconfirm title="是否删除?" confirm-button-text="确认" cancel-button-text="取消"
                @confirm="handleDelete(item.id)">
                <template #reference>
                  <el-button type="primary" size="small" text class="!m-0">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </div>
    <!-- 分页部分 -->
    <div class="bottom">
      <el-pagination background layout="prev, pager,next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
  </el-main>

  <!-- 抽屉 -->
  <el-drawer v-model="drawer" title="上传图片">
    <UploadFile :data="{ image_class_id }" @success="handleUploadSuccess" />
  </el-drawer>
</template>

<script setup>
import { computed, ref } from 'vue'
// 引入指定图片分类列表接口
import {
  getImageList
} from '~/api/image.js'
// 引入消息输入框工具
import { showPrompt, toast } from '~/composables/util.js'
// 引入重命名接口
import {
  updateImage,
  deleteImage
} from '~/api/image.js'
// 引入拖拽上传文件组件
import UploadFile from './UploadFile.vue'
import { type } from 'windicss/utils'
// 上传图片
const drawer = ref(false)
const openUploadFile = () => drawer.value = true//打开抽屉方法
// 分页部分--想要与接口进行交互
const currentPage = ref(1)//当前页数默认为1
const total = ref(0)//总条数默认为0
const limit = ref(10)//每页默认显示10条
const list = ref([])
const loading = ref(false)
// 当前图库分类id
const image_class_id = ref(0)
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
  getImageList(image_class_id.value, currentPage.value)
    .then((res) => {
      // console.log(res)
      total.value = res.totalCount
      // 将后端的数据给list,拿到对象后，给每个对象加check属性
      list.value = res.list.map(o => {
        o.checked = false
        // 修改完后返回对象
        return o
      })
    }).finally(() => {
      loading.value = false
    })
}
// 根据分类ID重新加载图片列表，也就是显示显示侧边列表，根据第一个激活状态的分类列表加载图片
const loadData = (id) => {
  currentPage.value = 1
  image_class_id.value = id
  getData()
}
// 重命名
const handleEdit = (item) => {
  // 弹出输入框
  showPrompt('重命名', item.name)
    .then(({ value }) => {
      // console.log(value)
      loading.value = true
      updateImage(item.id, value)
        .then(res => {
          // 提示
          toast('重命名成功')
          // 重新获取数据
          getData()
        })
        .finally(() => {
          loading.value = false
        })
    })

}

// 删除图片
const handleDelete = (id) => {
  loading.value = true
  deleteImage([id])
    .then(res => {
      // 提示
      toast('删除成功')
      // 重新获取数据
      getData()
    })
    .finally(() => {
      loading.value = false

    })
}

// 图片上传成功的回调方法
const handleUploadSuccess = () => {
  // 获取第一页数据、、
  getData(1)
}

// 想要实现只有在新增管理员界面会出现图片选中框，其他界面不出现·
const props = defineProps({
  // openChoose为true时才可以选择
  openChoose: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 1
  }
})
// 选中图片，要将图片信息传回给ChooseImage,通知父组件,给父组件传选择事件
const emit = defineEmits(['choose'])

// 获取选中图片(使用计算属性)
const checkedImage = computed(() => list.value.filter(o => o.checked))
// 选中照片功能，并返回照片
const handleChooseChange = (item) => {
  // 需求：最多只能选中一个图片
  // 注意：计算属性也要通过.value才能拿到
  if (item.checked && checkedImage.value.length > props.limit) {
    // 将当前选中设为false
    item.checked = false
    // 给出提示并且终止掉
    return toast(`最多只能选中${props.limit}张`, "error")
  }
  // 将信息传回，将选中的值传回父组件
  emit('choose', checkedImage.value)
}
defineExpose({
  loadData,
  openUploadFile
})


</script>

<style>
.image-main {
  position: relative;
  height: 100%;
}

.image-main .top {
  /* 滚动条 */
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-main .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}

.image-title {
  position: absolute;
  top: 122px;
  left: -1px;
  right: -1px;
  @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>