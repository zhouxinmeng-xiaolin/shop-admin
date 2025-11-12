<!-- 权限菜单模块 -->
<template>
  <el-card shadow="never" class="border-0">
    <!-- 刷新|新增 -->
    <!-- handleCreate触发打开弹框方法 -->
    <ListHeader @refresh="getData" @create="handleCreate" />
    <!-- label代表树形列表的名称   children代表树形列表子节点-->
    <el-tree style="max-width: 100%" :data="tableData" :props="{ label: 'name', children: 'child' }" v-loading="loading"
      node-key="id" :default-expanded-keys="defaultExpandedKeys">
      <!-- data就是当前的对象 -->
      <template #default="{ data }">
        <div class="custom-tree-node">
          <!-- 标签 -->
          <el-tag size="small" :type="data.menu ? 'primary' : 'info'">{{ data.menu ? "菜单" : "权限" }}</el-tag>
          <el-icon v-if="data.icon" :size="16" class="ml-2">
            <!-- 动态图标 -->
            <component :is="data.icon"></component>
          </el-icon>
          <!-- 标题 -->
          <span>{{ data.name }}</span>

          <!-- switch开关 -->
          <div class="ml-auto">
            <el-switch @change="handleStatusChange($event, data)" :modelValue="data.status" :active-value="1"
              :inactive-value="0" />
            <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
            <el-button text type="primary" size="small" @click.stop="addChild(data.id)">增加</el-button>
            <el-popconfirm title="是否删除该记录?" confirm-button-text="确认" cancel-button-text="取消"
              @confirm="handleDelete(data.id)">
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
    <!-- 想要实现切换菜单/规则，显示不同的表单 -->
    <!-- 抽屉组件 -->
    <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="上级菜单" prop="rule_id">
          <el-cascader v-model="form.rule_id" :options="options"
            :props="{ value: 'id', label: 'name', children: 'child', checkStrictly: true, emitPath: false }"
            placeholder="请选择上级菜单" />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="form.menu">
            <el-radio :label="1" border>菜单</el-radio>
            <el-radio :label="0" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 30%;" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
          <IconSelect v-model="form.icon" />
        </el-form-item>
        <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 1 && form.rule_id > 0">
          <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
        </el-form-item>
        <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
          <el-input v-model="form.condition" placeholder="后端规则"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
          <el-select v-model="form.method" placeholder="请选择请求方式" style="width: 240px">
            <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000" />
        </el-form-item>
      </el-form>

    </FormDrawer>
  </el-card>

</template>

<script setup>
import { ref } from 'vue'
// 引入刷新|新增
import ListHeader from '~/components/ListHeader.vue'
// 引入图标下拉选择
import IconSelect from '~/components/IconSelect.vue'
// 引入菜单权限接口
import {
  getRuleList,
  createRule,
  updateRule,
  updateRuleStatus,
  deleteRule
} from '~/api/rule.js'
import {
  useInitTable,
  useInitForm
} from '~/composables/useCommon.js'
// 引入封装好的抽屉
import FormDrawer from '~/components/FormDrawer.vue'
// 将传回来的的rules接收
const options = ref([])
const defaultExpandedKeys = ref([])
// 
const {
  loading,
  tableData,
  getData,
  currentPage,
  handleStatusChange,
  handleDelete

} = useInitTable({
  getList: getRuleList,
  onGetListSuccess: (res) => {
    options.value = res.rules
    tableData.value = res.list
    // 得到id值,默认展开一级菜单
    defaultExpandedKeys.value = res.list.map(o => o.id)
  },
  delete: deleteRule,
  updateStatus: updateRuleStatus,
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
  // 传数据,就是接口body的参数
  form: {
    rule_id: 0,
    menu: 0,
    name: '',
    condition: '',
    method: 'GET',
    status: 1,
    order: 50,
    icon: '',
    frontpath: ''
  },
  // 传规则
  rules: {},
  currentPage,
  // 传组件方法
  getData,
  update: updateRule,
  create: createRule
})


//添加子分类
const addChild = (id) => {
  // console.log(id) 当前对象的id值
  // 打开弹框
  handleCreate()
  // 将系统里的id赋值给表单里的id
  form.rule_id = id
  form.status = 1

}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}

.el-tree-node__content {
  padding: 20px 0px;
}
</style>