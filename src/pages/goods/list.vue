<template>
  <div>
    <!-- 标签栏部分 -->
    <el-tabs v-model="searchForm.tab" class="demo-tabs" @tab-change="getData">
      <el-tab-pane v-for="(item, index) in tabbars" :key="index" :label="item.name" :name="item.key"></el-tab-pane>
    </el-tabs>
    <!-- 卡片组件部分 -->
    <el-card shadow="never" class=" border-0">
      <!-- 搜索 -->
      <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
        <!-- 默认插槽内容即没有名字的slot -->
        <SearchItem label="关键词">
          <!-- SearchItem的插槽内容 -->
          <el-input v-model="searchForm.title" placeholder="商品名称" clearable></el-input>
        </SearchItem>
        <!-- 有名字插槽，和template结合使用 ,使用template精准将内容放在名字为show的插槽-->
        <template #show>
          <SearchItem label="商品分类">
            <!-- SearchItem的插槽内容 -->
            <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </SearchItem>
        </template>
      </Search>

      <!-- 刷新|新增 -->
      <ListHeader @create="handleCreate" @refresh="getData" layout="create,refresh">
        <!-- 上架下架按钮--更新商品状态进行上下架   上架状态值为1，下架状态值为0 -->
        <!-- 不是回收站时都显示批量删除 -->
        <el-button type="danger" size="small" @click="handleMultiDelete"
          v-if="searchForm.tab !== 'delete'">批量删除</el-button>
        <el-button type="warning" size="small" @click="handleRestoreGoods" v-else>恢复商品</el-button>
        <el-popconfirm v-if="searchForm.tab == 'delete'" title="是否彻底删除该商品?" confirm-button-text="确认"
          cancel-button-text="取消" @confirm="handleDestroyGoods">
          <template #reference>
            <!-- 删除按钮 -->
            <el-button type="danger" size="small">彻底删除</el-button>
          </template>
        </el-popconfirm>
        <el-button size="small" @click="handleMultiStatusChange(1)"
          v-if="searchForm.tab == 'all' || searchForm.tab == 'off'">上架</el-button>
        <el-button size="small" @click="handleMultiStatusChange(0)"
          v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'">下架</el-button>
      </ListHeader>

      <!-- 表格 -->
      <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
        style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品" width="300">
          <template #default="{ row }">
            <div class="flex">
              <!-- 左边为图片 -->
              <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true"
                style="width: 50px;height: 50px;"></el-image>
              <!-- 右边部分--占满剩余空间 -->
              <div class="flex-1">
                <!-- 标题 -->
                <p>{{ row.title }}</p>
                <!--价格相关  -->
                <div>
                  <span class="text-rose-500">￥{{ row.min_price }}</span>
                  <!-- //分割线 -->
                  <el-divider direction="vertical" />
                  <span class="text-gray-500 text-xs">{{ row.min_oprice }}</span>
                </div>
                <!-- 分类 -->
                <p class="text-gray-400 text-xs mb-1">分类：{{ row.category ? row.category.name : "未分类" }}</p>
                <p class="text-gray-400 text-xs">创建时间：{{ row.create_time }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="实际销量" align="center" width="70" prop="sale_count">
        </el-table-column>
        <!-- 状态 -->
        <el-table-column label="商品状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'" size="small">
              {{ row.status ? '上架' : '仓库' }}</el-tag>
          </template>
        </el-table-column>
        <!-- 审核状态--在回收站内不显示 -->
        <el-table-column label="审核状态" width="120" align="center" v-if="searchForm.tab !== 'delete'">
          <template #default="{ row }">
            <div v-if="row.ischeck == 0" class="flex flex-col">
              <el-tag type="success" size="small" plain>审核通过</el-tag>
              <el-tag class="mt-2" type="danger" size="small" plain>审核拒绝</el-tag>
            </div>
            <span v-else>{{ row.ischeck == 1 ? '通过' : '拒绝' }}</span>
          </template>
        </el-table-column>
        <!-- 总库存 -->
        <el-table-column label="总库存" align="center" width="90" prop="stock">
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <!-- 插槽 -->
          <template #default="scope">
            <!-- 修改按钮 -->
            <!-- scope.row拿到当前对象 -->
            <!-- 当处于回收站时就不显示按钮 -->
            <div v-if="searchForm.tab !== 'delete'">
              <el-button class="px-1" type="primary" size="small" text @click="handleEdit(scope.row)">
                修改
              </el-button>
              <el-button @click="handleSetGoodsSkus(scope.row)" :loading="scope.row.skusLoading" class="px-1"
                size="small" text :type="(scope.row.sku_type == 0 && !scope.row.sku_value) || (scope.row.sku_type == 1
                  && !scope.row.goods_skus.length) ? 'primary' : 'danger'">
                商品规格
              </el-button>
              <!-- 需求：想要给设置轮播图按钮设置loading -->
              <el-button @click="handleSetGoodsBanners(scope.row)" class="px-1"
                :type="scope.row.goods_banner.length ? 'primary' : 'danger'" size="small" text
                :loading="scope.row.bannersLoading">
                设置轮播图
              </el-button>
              <!-- 设置商品详情-需要引入父文本编辑器
               1.安装包npm i tinymce 和npm i @tinymce/tinymce-vue
               2.从node_models/tinymce复制样式文件到public目录下
               -->
              <el-button @click="handleSetGoodsContent(scope.row)" :loading="scope.row.contentLoading" class="px-1"
                :type="scope.row.content ? 'primary' : 'danger'" size="small" text>
                商品详情
              </el-button>
              <el-popconfirm title="是否删除该商品?" confirm-button-text="确认" cancel-button-text="取消"
                @confirm="handleDelete([scope.row.id])">
                <template #reference>
                  <!-- 删除按钮 -->
                  <el-button type="primary" size="small" text>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
            <span v-else class="text-gray-500">暂无操作</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="flex items-center justify-center  mt-5">
        <el-pagination background layout="prev,pager, next" :total="total" :current-page="currentPage"
          :page-size="limit" @current-change="getData" />
      </div>
      <!-- 抽屉组件--表单部分 -->
      <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
          <el-form-item label="商品名称" prop="title">
            <el-input v-model="form.title" placeholder="请输入商品名称，不能超过60个字符"></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <ChooseImage v-model="form.cover" />
          </el-form-item>
          <el-form-item label="商品分类" prop="category_id">
            <!-- 下拉框 -->
            <el-select v-model="form.category_id" placeholder="选择所属商品分类">
              <!-- label给人看，value给程序用 -->
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述" prop="desc">
            <el-input v-model="form.desc" placeholder="选填，商品卖点" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input v-model="form.unit" placeholder="请输入单位" style="width: 50%;"></el-input>
          </el-form-item>
          <el-form-item label="总库存" prop="stock">
            <el-input v-model="form.stock" type="number" style="width: 40%;">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警" prop="min_stock">
            <el-input v-model="form.min_stock" type="number" style="width: 40%;">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低销售价" prop="min_price">
            <el-input v-model="form.min_price" type="number" style="width: 40%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低原价" prop="min_oprice">
            <el-input v-model="form.min_oprice" type="number" style="width: 40%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="form.stock_display">
              <el-radio :label="0">隐藏</el-radio>
              <el-radio :label="1">显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">放入仓库</el-radio>
              <el-radio :label="1">立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

      </FormDrawer>
    </el-card>
    <!-- 轮播图 -->
    <banners ref="bannersRef" @reload-data="getData" />
    <!-- 商品详情弹框 -->
    <content ref="contentRef" @reload-data="getData" />
    <skus ref="skusRef" @reload-data="getData" />

  </div>

</template>

<script setup>
import { ref } from 'vue'

// 引入商品管理
import {
  getGoodsList,
  updateGoodsStatus,
  createGoods,
  updateGoods,
  deleteGoods,
  restoreGoods,
  destroyGoods
} from '~/api/goods.js'
// 引入商品分类
import {
  getCategoryList,
} from '~/api/category.js'
// 引入·封装好的列表分页和搜索功能
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
// 引入封装好的抽屉
import FormDrawer from '~/components/FormDrawer.vue'
// 引入头像组件
import ChooseImage from '~/components/ChooseImage.vue'
// 引入刷新|新增
import ListHeader from '~/components/ListHeader.vue'
// 引入封装的搜索组件
import Search from '~/components/Search.vue'
// 引入封装的搜索内容组件
import SearchItem from '~/components/SearchItem.vue'
// 引入轮播图组件
import banners from './banners.vue'
// 引入商品详情组件
import content from './content.vue'
// 引入商品规格组件
import skus from './skus.vue'
import { toast } from '~/composables/util'
// 封装好的列表分页和搜索功能
const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  multipleTableRef,
  handleSelectionChange,
  handleMultiDelete,
  handleMultiStatusChange,
  multiSelectionIds
} = useInitTable({
  searchForm: {
    tab: 'all',
    title: "",
    // category_id: 0,
  },
  getList: getGoodsList,
  delete: deleteGoods,
  // 批量上架下架
  updateStatus: updateGoodsStatus,
  onGetListSuccess: (res) => {
    // console.log(res)
    total.value = res.totalCount//总页数
    // 给列表数据中的每个对象添加一个statusLoading属性
    tableData.value = res.list.map(o => {
      o.bannersLoading = false
      o.contentLoading = false
      o.skusLoading = false
      return o
    })
  }
})

// 封装新增和修改功能 
const {
  FormDrawerRef,
  formRef,
  form,
  rules,
  editId,
  drawerTitle,
  handleSubmit,
  resetForm,
  handleCreate,
  handleEdit,
} = useInitForm({
  // 传数据
  form:
  {
    title: null,//商品名称
    category_id: null,//商品分类
    cover: null,//商品封面
    desc: null,//商品描述
    unit: "件",//商品单位
    stock: 100,//总库存
    min_stock: 10,//库存预警
    status: 1,//是否上架 0仓库 1上架
    stock_display: 1,//库存显示  0隐藏  1显示 
    min_price: 0,//最低销售价
    min_oprice: 0//最低原价
  },

  // 传规则
  rules: {
    username: [{
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    }],

    password: [{
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    }]
  },
  currentPage,
  // 传组件方法
  getData,
  update: updateGoods,
  create: createGoods
})


// 标签栏
// all全部，checking审核中，saling出售中，off已下架，min_stock库存预警，delete回收站
const tabbars = [
  {
    key: 'all',
    name: '全部'
  },
  {
    key: 'checking',
    name: '审核中'
  },
  {
    key: 'saling',
    name: '出售中'
  },
  {
    key: 'off',
    name: '已下架'
  },
  {
    key: 'min_stock',
    name: '库存预警'
  },
  {
    key: 'delete',
    name: '回收站'
  },
]



// 商品分类
const category_list = ref([])
getCategoryList()
  .then(res => {//获取分类数据成功后的操作
    // console.log(res.cates)
    category_list.value = res
  })


// 设置轮播图
const bannersRef = ref(null)
//打开轮播图
const handleSetGoodsBanners = (row) => {
  bannersRef.value.open(row)
}

// 设置商品详情
const contentRef = ref(null)
// 打开详情弹窗
const handleSetGoodsContent = (row) => {
  contentRef.value.open(row)
}

// 设置商品规格
const skusRef = ref(null)
// 打开商品规格弹窗
const handleSetGoodsSkus = (row) => {
  skusRef.value.open(row)
}

// 恢复商品方法
const handleRestoreGoods = () => {
  useMultiAction(restoreGoods, '恢复')
}

// 彻底删除方法
const handleDestroyGoods = () => {

  useMultiAction(destroyGoods, '彻底删除')
}

// 封装恢复商品和彻底删除方法
function useMultiAction(func, msg) {
  loading.value = true
  func(multiSelectionIds.value)
    .then(res => {
      toast(msg + '成功')
      if (multipleTableRef.value) {
        multipleTableRef.value.clearSelection()
      }
      getData()
    })
    .finally(() => {
      loading.value = false

    })
}
</script>

<style></style>