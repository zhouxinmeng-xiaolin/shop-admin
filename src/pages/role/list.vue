<template>
  <el-card shadow="never" class=" border-0">
    <!-- 刷新|新增 -->
    <ListHeader @create="handleCreate" @refresh="getData" />
    <!-- 表格部分 -->
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">

      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="desc" label="角色描述" width="380" />
      <!-- 状态 -->
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <!-- 主要用来切换 “开启 / 关闭” 状态 -->
          <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading"
            :disabled="row.super == 1" @change="handleStatusChange($event, row)">
          </el-switch>

        </template>
      </el-table-column>
      <!-- 自定义 -->
      <el-table-column label="操作" width="250" align="center">
        <!-- 插槽 -->
        <template #default="scope">
          <!-- 配置权限按钮 -->
          <el-button type="primary" size="small" text @click="openSetRule(scope.row)">
            配置权限
          </el-button>
          <!-- 修改按钮 -->
          <!-- scope.row拿到当前对象 -->
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)">
            修改
          </el-button>
          <el-popconfirm title="是否删除该公告?" confirm-button-text="确认" cancel-button-text="取消"
            @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <!-- 删除按钮 -->
              <el-button type="primary" size="small" text>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="flex items-center justify-center  mt-5">
      <el-pagination background layout="prev,pager, next" :total="total" :current-page="currentPage" :page-size="limit"
        @current-change="getData" />
    </div>
    <!-- 抽屉组件 -->
    <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="form.desc" placeholder="角色描述" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>

    </FormDrawer>


    <!-- 抽屉组件 用于放配置权限的表单-->
    <FormDrawer ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
      <!-- 配置权限表单数据来自于菜单权限管理的list -->
      <!-- 把ruleList放在表单里 -->

      <!-- 用虚拟树形控件 -->
      <el-tree-v2 ref="elTreeRef" node-key="id" :default-expanded-keys="defaultExpandedKeys" style="max-width: 600px"
        :data="ruleList" :props="{ value: 'id', label: 'name', children: 'child', }" show-checkbox :height="treeHeight"
        @check="handleTreeCheck" :check-strictly="checkStrictly">
        <template #default="{ data }">
          <div class="flex items-center">
            <!-- 左边为标签 -->
            <el-tag :type="data.menu ? 'primary' : 'info'" size="small">{{ data.menu ? "菜单" : "权限" }}</el-tag>
            <!-- 右边 -->
            <span class="ml-2 text-sm">{{ data.name }}</span>
          </div>
        </template>
      </el-tree-v2>

    </FormDrawer>
  </el-card>

</template>

<script setup>
import { ref } from 'vue'
import { toast } from '~/composables/util.js'
// 引入·封装好的列表分页和搜索功能
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
// 引入菜单列表接口
import {
  getRoleList,
  createRoleList,
  updateRoleList,
  deleteRoleList,
  updateRoleStatus,
  setRoleRules
} from '~/api/role.js'
// 菜单权限管理获取数据方法
import { getRuleList } from '~/api/rule.js'
// 引入封装好的抽屉
import FormDrawer from '~/components/FormDrawer.vue'
// 引入刷新|新增
import ListHeader from '~/components/ListHeader.vue'
const {
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  handleStatusChange
} = useInitTable({
  getList: getRoleList,
  delete: deleteRoleList,
  updateStatus: updateRoleStatus
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
  form: {
    name: '',
    status: 1,
    desc: ''
  },
  // 传规则
  rules: {
    name: [{
      required: true,
      message: '角色名称不能为空',
      trigger: 'blur'
    }],
  },
  currentPage,
  // 传组件方法
  getData,
  update: updateRoleList,
  create: createRoleList
})

// 权限配置
const setRuleFormDrawerRef = ref(null)
// 定义一个数组拿list
const ruleList = ref([])
// 高度
const treeHeight = ref(0)
// 将id记录下来，在提交的时候需要知道哪个角色的id
const roleId = ref(0)
const defaultExpandedKeys = ref([])
const elTreeRef = ref(null)
// 当前用户拥有的权限id需要记录
const rulesId = ref([])
const checkStrictly = ref(false)
// 打开配置权限表单方法
const openSetRule = (row) => {
  roleId.value = row.id
  // 树形控件高度
  treeHeight.value = window.innerHeight - 180
  // console.log(row) 可以得到当前对象object值
  // console.log(setRuleFormDrawerRef.value)  能看到在FormDrawer封装的open等方法
  // 获取数据前设置为不关联
  checkStrictly.value = true
  // 获取权限数据
  getRuleList(1).then(res => {
    // console.log(res)显示拿到了数据
    ruleList.value = res.list
    // 拿到以及节点的id
    defaultExpandedKeys.value = ruleList.value.map(o => o.id)
    // 打开表单方法---一定要拿完数据后才打开弹框
    setRuleFormDrawerRef.value.open()


    // 实现默认选中功能
    // 获取当前角色拥有的权限ID
    // console.log(rulesId.value = row.rules.map(o => o.id))//得到id组成的数组
    rulesId.value = row.rules.map(o => o.id)
    // console.log(elTreeRef)
    // 打开后渲染完后再拿到节点
    setTimeout(() => {
      elTreeRef.value.setCheckedKeys(rulesId.value)
      checkStrictly.value = false
    }, 150)
  })
}
// 提交
const handleSetRuleSubmit = () => {
  setRuleFormDrawerRef.value.showLoading()
  // 实现交互roleId.value,rulesId.value当前角色id和当前角色所拥有的权限id
  setRoleRules(roleId.value, rulesId.value)
    .then(res => {//请求成功后
      // 提示
      toast('配置成功')
      // 刷新数据
      getData()
      // 关闭弹窗
      setRuleFormDrawerRef.value.close()
    })
    .finally(() => {
      setRuleFormDrawerRef.value.hideLoading()
    })
}
//  
const handleTreeCheck = (...e) => {
  // 获取到的是点击选中权限的对象
  // checkedKeys选中对象的key值
  // halfCheckedKeys和checkedKeys组成rule_ids
  // console.log(e)
  // 解构出来
  const { checkedKeys, halfCheckedKeys } = e[1]
  // 两个数组进行合并，可以用扩展运算符
  rulesId.value = [...checkedKeys, ...halfCheckedKeys]
}

</script>

<style></style>