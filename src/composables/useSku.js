// 该文件是利用组合式api实现多规格数据的传递以及数据响应式
// 需求：1.要将从skus.vue里拿到的数据给SkusCard.vue和SkuCardItem.vue
// 2.拿到的数据里有goodsSkusCard(给SkusCard.vue)
// 以及goodsSkusCard里的goodsSkusCardValue(给SkuCardItem.vue)

// 1.因为是响应式数据，引入ref'
import {ref,nextTick,computed} from 'vue'
// 引入增加商品规格接口
import {
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
  createGoodsSkusCardValue,
  updateGoodsSkusCardValue,
  deleteGoodsSkusCardValue,
  chooseAndSetGoodsSkusCard
} from '~/api/goods.js'
// 引入上移和下移方法
import {
  useArrayMoveUp,
  useArrayMoveDown,
  cartesianProductOf
} from '~/composables/util.js'
// 2.存储当前商品ID,并导出,方便后期进行数据交互
export const goodsId = ref(0) //所有组件，哪里需要使用goodsId，引入就可以，引入后也是响应式的
// 3.规格选项列表
export const sku_card_list = ref([])
// 存储表格数据
export const sku_list = ref([])
// 4.初始化规格选项列表 ,用d接收对象,-->要在skus.vue中引入,并在获取数据那里将对象传过来
export function initSkuCardList(d){
  // console.log(d)--这样就拿到当前对象数据 
  // 5.将数据赋值给该组件变量
  sku_card_list.value = d.goodsSkusCard.map(item=>{
    // 在该对象里重新加上一个text，给每个对象加上loading
    item.text = item.name
    item.loading = false
    // 列表数据
    item.goodsSkusCardValue.map(v=>{
      v.text = v.value || '属性值'
      return v
    })
    return item//一定要return回去  
  })
  // console.log(d)表哥数据存在goodsSkus数组中
  sku_list.value = d.goodsSkus
  // console.log(sku_list.value)
}

// 添加规格选项
export const btnLoading = ref(false)
export function  addSkuCardEvent(){
btnLoading.value=true
createGoodsSkusCard({
  goods_id: goodsId.value,
  name: "规格选项",
  order: 50,
  type: 0,
})
.then(res=>{//添加成功之后的逻辑
  // res拿到的是这些数据
  // "goods_id": 26,
  //       "name": "规格名称",
  //       "order": 50,
  //       "type": 0,
  //       "id": "135"
  sku_card_list.value.push({
    ...res,
    text:res.name,
    loading:false,
    goodsSkusCardValue:[]
  })
})
.finally(()=>{
btnLoading.value=false

})
}


// 修改规格选项
export function handleUpdate(item){
  // console.log(item)拿到当前修改选项对象，其中text就是我们修改后的值name为还没修改值
  // 如果修改成功就将name值改为text值
  item.loading=true
 updateGoodsSkusCard(item.id,{
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: 0
 })
 .then(res=>{
  item.name = item.text
 })
 .catch(err=>{
  item.text = item.name
 })
 .finally(()=>{
  item.loading=false
 })
}

// 删除规格选项
export function handleDelete(item){
  item.loading=true
  deleteGoodsSkusCard(item.id)
  .then(res=>{
    // 拿到当前索引
   const i = sku_card_list.value.findIndex(o=>o.id == item.id)
  //  判断索引是否存在
    if(i != -1){
      // 移除数据
      sku_card_list.value.splice(i,1)
    }
    getTableData()
  })
  .finally(()=>{
    item.loading=false
  })

}

export const bodyLoading = ref(false)
// 排序规格选项方法,action告诉要用的是上移还是下移
export function sortCard(action,index){
  // 拷贝一份数组
  let oList = JSON.parse(JSON.stringify(sku_card_list.value))
  // func得到的是函数
  let func = action == 'up' ? useArrayMoveUp : useArrayMoveDown
  func(oList,index)
  
  // 排序后的结果
  let sortData = oList.map((o,i)=>{
      return {
        id:o.id,
        order:i+1
    }
    })
    //  得到排序后的对象数组，并且要将该数组传给后端
    // console.log(sortData) 
    bodyLoading.value = true
  // 要将改的顺序给api接口
  sortGoodsSkusCard({
    sortdata:sortData
  })
  .then(res=>{//排序成功后
    // sku_card_list.value 是你页面上正在显示的 “规格卡片数组”（比如页面上的 “尺寸”“颜色” 排序）
    // ，是 Vue 的响应式数据 —— 改它会直接让页面跟着变。
// 但这里一开始不能直接改它，因为要先给后端发请求：
    // oList 是 “给后端发请求用的临时草稿”，改它不影响页面；sku_card_list.value 
    // 是 “页面显示的正式数据”，只有后端确认成功后，改它才能让用户看到排序结果，保证前后端数据和页面显示一致。
     func(sku_card_list.value,index)
     getTableData()
  })
  .finally(()=>{
    bodyLoading.value = false
  })
}

// 选择设置规格
export function handleChooseSetGoodsSkusCard(id,data){
  let item = sku_card_list.value.find(o=>o.id == id)
  item.loading=true
  chooseAndSetGoodsSkusCard(id,data)
  .then(res=>{
    // console.log(res)
    // 根据后端的变化更改前端页面的值
    item.name = item.text = res.goods_skus_card.name
    item.goodsSkusCardValue = res.goods_skus_card_value.map(o=>{
      o.text = o.value || '属性值'
      return o
    })
     getTableData()

  })
  .finally(()=>{
  item.loading=false

  })
}
// 6.初始化规格值
export function initSkuCardItem(id){
  // console.log(id)拿到规格值的id
 const item =  sku_card_list.value.find(o=>o.id==id)
 const loading = ref(false)
//  console.log(item)可以拿到选中id对于的对象值
// tag标签
const inputValue = ref('') 
// 是否显示input框
const inputVisible = ref(false)
const InputRef = ref()
const handleClose = (tag) => {
  loading.value=true
  deleteGoodsSkusCardValue(tag.id)
  .then(res=>{//删除成功后
    // 查索引
   let i = item.goodsSkusCardValue.findIndex(o=>o.id==tag.id)
    // 进行删除
    if(i!=-1){
      item.goodsSkusCardValue.splice(i,1)
    }
     getTableData()
    
  })
  .finally(()=>{
  loading.value=false
  })

}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

const handleInputConfirm = () => {
  // 如果输入框没有值，就隐藏输入框，并且return终止掉
  if(!inputValue.value){
    inputVisible.value = false
    return 
  }
  loading.value = true
  // 有值就拿到input输入框1的值
  createGoodsSkusCardValue({
    goods_skus_card_id:id,
    name:item.name,
    order:50,
    value:inputValue.value
  })
  .then(res=>{//添加规格值成功后
    item.goodsSkusCardValue.push({
      ...res,
      text:res.value
    })
     getTableData()

  })
  .finally(()=>{//执行结束后，将输入框隐藏并清空
    inputVisible.value = false
    inputValue.value = ''
     loading.value = false
  })  
}

// 修改选项值方法
const handleChange = (value,tag)=>{
  // console.log(value)  得到的是修改后的规格值
  // console.log(tag)拿到当前修改对象text表示修改后值，value表示修改前值
  loading.value = true
  updateGoodsSkusCardValue(tag.id,{
    goods_skus_card_id: id,
    name: item.name,
    order: tag.order,
    value:value
  })
  .then(res=>{//成功后要同步到前端
    tag.value=value
     getTableData()

  })
  .catch(err=>{//失败后将tag值改回来
    tag.text = tag.value
  })
  .finally(()=>{
  loading.value = false

  })
}


// 以对象形式返回
return {
  item,
  inputValue,
  inputVisible,
  InputRef,
  handleClose,
  showInput,
  handleInputConfirm,
  loading,
  handleChange
}
} 

// 初始化表格
export function initSkuTable() {//主要是处理表头相关
  // 要判断有无选项值，没有就不要加入表格中
  const skuLables = computed(() => sku_card_list.value.filter(o => o.goodsSkusCardValue.length > 0))
  // 获取表头--使用响应式
  const tableThs = computed(() => {
    let length = skuLables.value.length
    return [{
      name: "商品规格",
      colspan: length,//表头合并列数等于规格选项的个数
      width: "",
      rowspan: length > 0 ? 1 : 2// 如果有规格，就占1行；没有规格，就占2行
    }, {
      name: "销售价",
      width: "100",
      rowspan: 2//合并两行
    }, {
      name: "市场价",
      width: "100",
      rowspan: 2//合并两行

    }, {
      name: "成本价",
      width: "100",
      rowspan: 2//合并两行

    }, {
      name: "库存",
      width: "100",
      rowspan: 2//合并两行

    }, {
      name: "体积",
      width: "100",
      rowspan: 2//合并两行

    }, {
      name: "重量",
      width: "100",
      rowspan: 2//合并两行

    }, {
      name: "编码",
      width: "100",
      rowspan: 2//合并两行

    }
    ]
  })
  // 返回数据
  return {
    skuLables,
    tableThs,
    sku_list
  }
}

// 获取规格表格数据--当操作规格选项，规格值的时候，表格也能同步变化
export function getTableData(){
  setTimeout(()=>{
    // 如果没有规格选项就返回
  if(sku_card_list.value.length === 0) return []
  // 存放规格选项值组成的数组
  let list = []
  // forEach 就是用来 “遍历数组” 的工具 —— 简单说就是
  //  “把数组里的每个元素都拎出来，挨个做一件事”，不用自己写循环，省事儿又不容易错。
  sku_card_list.value.forEach(o=>{
    if(o.goodsSkusCardValue&&o.goodsSkusCardValue.length>0){
      list.push(o.goodsSkusCardValue)
    }
  })
  if(list.length == 0){
    return []
  }

  // 排列组合后的值
  let arr = cartesianProductOf(...list)

  // 获取之前的规格列表，将规格ID排序之后转化为字符串
  let beforeSkuList = JSON.parse(JSON.stringify(sku_list.value)).map(o=>{
    // 给对象加上Id
    // 对象里的skus变为了对象，要转成数组
    if(!Array.isArray(o.skus)){//不是数组时
      // 将对象转换为数组Object.keys(o.skus)->[0,1]
      o.skus=Object.keys(o.skus).map(k=>o.skus[k])
    }
    // 排序arr.sort((a, b) => a - b); // 比较函数：a - b 是升序
    o.skusId = o.skus.sort((a,b)=>a.id-b.id).map(s=>s.id).join(",")
    return o
    // o.skusId = 

  })
  // console.log(arr)
   sku_list.value = []
  // 把整理后的值给表格
 sku_list.value =  arr.map(skus=>{
  let o = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)),beforeSkuList)
    return{
      code:o?.code ||"",
      cprice:o?.cprice ||"0.00",
      goods_id:goodsId.value,
      image:o?.image ||'',
      oprice:o?.oprice ||"0.00",
      pprice:o?.pprice ||"0.00",
      skus:skus,
      stock:o?.stock ||0,
      volume:o?.volume ||0,
      weight:o?.weight ||0
    }
  })
  },200)  
}
function getBeforeSkuItem(skus,beforeSkuList){
  let skusId = skus.sort((a,b)=>a.id-b.id).map(s=>s.id).join(",")
  return beforeSkuList.find(o=>{
    // 新的长度大于旧的长度，用新的作为标准
    if(skus.length>o.skus.length){
     return skusId.indexOf(o.skusId) != -1
    }
    return o.skusId.indexOf(skusId) != -1
  })
}

