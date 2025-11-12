<!-- 封装增加规格组件 -->
<template>
  <div class="flex gap-2">
    <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
      {{ tag }}
    </el-tag>
    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
      @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">
      + 添加值
    </el-button>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
// 组件间交互，父组件使用v-model子组件要做以下操作
// 1.使用defineProps来接收modelValue,必须是叫modelValue，并使用props接收
const props = defineProps({
  modelValue: String
})
// 3.一旦我们进行删除或添加值，就要通知父组件更新对应值，使用defineEmits('update:modelValue'),固定写法
const emit = defineEmits(['update:modelValue'])
const inputValue = ref('')
// 2.将接收到的modelValue给dynamicTags，并且要转为数组，字符串->数组：使用split方法
const dynamicTags = ref(props.modelValue ? props.modelValue.split(',') : [])

const inputVisible = ref(false)
const InputRef = ref()
// 删除规格
const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  // 4.找到添加或删除修改的方法，将新值给父组件，并通知父组件进行更新
  // 传过去的为字符串,数组->字符串：join方法
  emit('update:modelValue', dynamicTags.value.join(','))
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)//添加了值
    // 4.找到添加或删除修改的方法，将新值给父组件，并通知父组件进行更新
    // 传过去的为字符串,数组->字符串：join方法
    emit('update:modelValue', dynamicTags.value.join(','))

  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>
