// 用于封装管理员模块和公告模块相似的地方，实现复用

import {ref,reactive ,computed} from 'vue'
import { toast } from '~/composables/util.js'
// import {ref,reactive} f这个函数叫useInitTable，是一个 "组合式函数"
// （Vue 3 的新特性），接收一个配置对象opt作为参数，返回一系列响应式数据和方法，供表格组件使用。
// 封装列表分页、搜索、删除、修改状态、批量删除功能
export function useInitTable(opt={}){
let searchForm = null
let resetSearchForm = null
if(opt.searchForm){//搜索框存在
  searchForm = reactive({...opt.searchForm})
  // 重置
  resetSearchForm = ()=>{
    for(const key in opt.searchForm){
      searchForm[key] = opt.searchForm[key]
    }
    getData()
  }
}

// 删除管理员方法
const handleDelete = (id) => {
  loading.value = true
  // 请求接口
  opt.delete(id)
    .then(res => {//成功
      // console.log(res)
      //提示
      toast('删除成功')
      // 更新数据
      getData()
    })
    .finally(() => {
      loading.value = false

    })
}


// 修改状态方法
const handleStatusChange = (status, row) => {
  // console.log(status)  接收到的是0或1，0为关闭
  // console.log(row)得到{id: 388, status: 1, create_time:
  //  '2025-10-05 11:17:31', update_time: '2025-10-05 11:21:59', username: 'boluo
  // 如果你想控制 “表格中某一行” 的加载状态 → 必须用 row.statusLoading
  row.statusLoading = true
  opt.updateStatus(row.id, status)
    .then(res => {//执行成功
      // 提示
      toast('修改状态成功')
      // 修改状态,将对象里的状态修改为即将修改的状态值
      row.status = status
    })
    .finally(() => {
      row.statusLoading = false
    })
}

const tableData = ref([])
// 加载动画
const loading = ref(false)
// 分页部分
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

//  获取数据方法
function getData(p = null) {//p代表点击的页码
  // console.log(p)
  if (typeof p == 'number') {
    currentPage.value = p
  }
  loading.value = true
  // 请求接口
  opt.getList(currentPage.value, searchForm)
    .then(res => {
      // 有自定义方法，就按照自定义方法
      if(opt.onGetListSuccess && typeof opt.onGetListSuccess == "function"){
        opt.onGetListSuccess(res)
      }else{
          total.value = res.totalCount//总页数
          tableData.value = res.list//把拿到的值给table  
      }  
    })
    .finally(() => {
      loading.value = false
    })

}

  getData()

// 批量删除方法
  // 批量删除多选框事件监听
// 2.用空数组将拿到的ids记录起来,多选选中id
const multiSelectionIds = ref([])
// 表格节点
const multipleTableRef = ref(null)
// 1.要拿到选中的对象的id组成的以为数组---因为是数组，要拿里面的某类值，要用map遍历e.map(o => o.id)
const handleSelectionChange = (e) => {
  // console.log(e)  得到的是选中的对象数组相关信息
  // console.log(e.map(o => o.id))这样就可以拿到id组成的以为数组
  // 3.将拿到的多选id赋值给新容器
  multiSelectionIds.value = e.map(o => o.id)

}
// 4.拿到id后触发批量删除方法
const handleMultiDelete = () => {
  loading.value = true
  // 5.触发后端接口删除方法
  opt.delete(multiSelectionIds.value)
    .then(res => {//删除成功后做的事？
      // 6.提示
      toast('删除成功')
      // 7.清空选中->拿到表格节点(先绑定)->判断节点是否存在->使用element里提示的清空方法clearSelection()
      // console.log(multipleTableRef.value)显示很多方法
      if (multipleTableRef.value) {
        multipleTableRef.value.clearSelection()
      }
      // 8.刷新数据
      getData()
    })
    .finally(() => {
      loading.value = false

    })
}
// 批量修改状态方法
  const handleMultiStatusChange = (status)=>{
    // loading状态
    loading.value = true
    opt.updateStatus(multiSelectionIds.value,status)
    .then(res=>{
      toast('修改状态成功')
      // 清空选中
       if (multipleTableRef.value) {
        multipleTableRef.value.clearSelection()
      }    
      getData()
    })
    .finally(()=>{
    loading.value = false

    })
  }
  return{
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
    handleDelete,
    handleStatusChange,
    handleMultiDelete,
    multipleTableRef,
    handleSelectionChange,
    handleMultiStatusChange,
    multiSelectionIds
  }
}


// 封装新增和修改功能
// getData()方法需要通过参数传进来，使用opt对象接收
export function useInitForm(opt={}){
  // 表单部分
const FormDrawerRef = ref(null)
const formRef = ref(null)
// 表单---已经将接口body里的参数放在了form里
// 因为要实现复用，可能其他的数据不是这些，所以要进行处理，以实现复用，所以通过opt传过来,
// 下面用到form的就用opt.form代替
const defaultForm = opt.form
const form = reactive({})
// 规则
const rules = opt.rules || {}
// 因为修改和新增公告时会公用一个抽屉弹框，所以要用一个标识区分，=0就代表新增
const editId = ref(0)
const drawerTitle = computed(() => editId.value ? '修改' : '新增')
// 提交表单功能
const handleSubmit = (id) => {
  // 1.触发表单的参数验证
  formRef.value.validate((valid) => {
    if (!valid) return//未验证通过，直接返回
    FormDrawerRef.value.showLoading()//显示提交按钮的loading
    let body = {}
    if(opt.beforeSubmit && typeof opt.beforeSubmit == 'function'){
      body = opt.beforeSubmit({...form})
    }else{
      body = form
    }
    // 要判断是调用修改表单还是新增表单
    // 用opt.update来替代updateManager
    const fun = editId.value ? opt.update(editId.value, body) : opt.create(body)
    // 2.请求提交接口
    fun.then(res => {//成功
      //(1)提示
      toast(drawerTitle.value + '成功')
      //(2)修改刷新当前页，新增刷新第一页
      opt.getData(editId.value ? opt.currentPage.value : 1)
      // (3)关闭抽屉弹框
      FormDrawerRef.value.close()
      form.title = ''
      form.content = ''
    })
      .finally(() => {
        FormDrawerRef.value.hideLoading()
      })
  })

}

// 重置表单方法，点击修改时表单里有内容
function resetForm(row = false) {
  // 判断能否拿到表单节点，能拿到就将之前的验证规则去除
  if (formRef.value) formRef.value.clearValidate()
    for (const key in defaultForm) {
    // 如果 row 有这个属性就用 row 的，否则用默认值
    form[key] = row[key] !== undefined ? row[key] : defaultForm[key]
  } 
}
// 新增管理员(打开抽屉)
const handleCreate = () => {
  // 新增就需要将editId改为0
  editId.value = 0
  // 如果是新增就传空对象
  resetForm(defaultForm)
  FormDrawerRef.value.open()//打开抽屉
}

// 修改管理员方法
const handleEdit = (row) => {
  // 点击修改就将editId等于当前修改接收到的对象id
  editId.value = row.id
  // 如果是修改就将当前订单对象传过去
  resetForm(row)
  // 打开弹框
  FormDrawerRef.value.open()
}
return {
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
}
}


