<!-- 支付设置 -->
<!-- 配置模块 -->
<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="160px" :inline="false">
      <el-tabs v-model="activeName">
        <el-tab-pane label="支付设置" name="first">
          <el-table :data="tableData" border stripe>
            <!-- 第1列 -->
            <el-table-column label="支付方式" align="left">
              <template #default="{ row }">
                <div class="flex items-center">
                  <el-image class="rounded mr-2" :src="row.src" fit="fill" :lazy="true"
                    style="width: 40px;height: 40px;"></el-image>
                  <div>
                    <h6>{{ row.name }}</h6>
                    <small class="flex text-light-500 mt-1">{{ row.desc }}</small>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- 第2列 -->
            <el-table-column label="操作" align="center" width="150">
              <template #default="{ row }">
                <div class="flex items-center">
                  <el-button type="primary" size="small" text @click="open(row.key)">配置</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <!-- 购物设置板块 -->
        <el-tab-pane label="购物设置" name="second">
          <el-form-item label="未支付订单">
            <div>
              <el-input v-model="form.close_order_minute" type="number">
                <template #append>
                  分钟后自动关闭
                </template>
              </el-input>
              <small class="flex text-gray-400">订单下单未付款，n分钟后自动关闭，设置0不自动关闭</small>
            </div>
          </el-form-item>
          <el-form-item label="已发货订单">
            <div>
              <el-input v-model="form.auto_received_day" type="number">
                <template #append>
                  天后自动确认收获
                </template>
              </el-input>
              <small class="flex text-gray-400">如果在期间为确认收货，系统自动完成收货，设置0不自动收货</small>
            </div>
          </el-form-item>
          <el-form-item label="已完成订单">
            <div>
              <el-input v-model="form.after_sale_day" type="number">
                <template #append>
                  天内允许申请售后
                </template>
              </el-input>
              <small class="flex text-gray-400">订单完成后，用户在n天内可以发起售后申请，设置0允许申请售后</small>
            </div>
          </el-form-item>
          <!-- 保存按钮 -->
          <el-form-item>
            <el-button type="primary" size="default" @click="submit">保存</el-button>
          </el-form-item>
        </el-tab-pane>

      </el-tabs>

    </el-form>
    <FormDrawer ref="formDrawerRef" title="配置" @submit="submit">
      <el-form v-if="drawerType == 'alipay'" :model="form" label-width="80px">
        <el-form-item label="app_id">
          <el-input v-model="form.alipay.app_id" placeholder="app_id" style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item label="ali_public_key">
          <el-input v-model="form.alipay.ali_public_key" placeholder="ali_public_key" style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item label="private_key">
          <el-input v-model="form.alipay.private_key" placeholder="private_key" style="width: 90%;"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-else :model="form" label-width="80px">
        <el-form-item label="公众号APPID">
          <el-input v-model="form.wxpay.app_id" placeholder="app_id" style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item label="小程序 APPID">
          <el-input v-model="form.wxpay.miniapp_id" placeholder="miniapp_id" style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item label="小程序secret">
          <el-input v-model="form.wxpay.secret" placeholder="secret" style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item label="appid">
          <el-input v-model="form.wxpay.appid" placeholder="appid" style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item label="商户号">
          <el-input v-model="form.wxpay.mch_id" placeholder="mch_id" style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item label="API 密钥">
          <el-input v-model="form.wxpay.key" placeholder="key" style="width: 90%;"></el-input>
        </el-form-item>
        <el-form-item label="cert_client">
          <el-upload :action="uploadAction" :limit="1" :headers="{ token }" accept=".pem"
            :on-success="uploadClientSuccess">
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <p class="text-rose-500">
                {{ form.wxpay.cert_client ? form.wxpay.cert_client : '还未配置' }}
              </p>
              <div class="el-upload__tip">
                例如：apiclient_cert.pem
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="cert_client">
          <el-upload :action="uploadAction" :limit="1" :headers="{ token }" accept=".pem"
            :on-success="uploadKeySuccess">
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <p class="text-rose-500">
                {{ form.wxpay.cert_key ? form.wxpay.cert_key : '还未配置' }}
              </p>
              <div class="el-upload__tip">
                例如：apiclient_key.pem
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>


    </FormDrawer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  getSysconfig,
  setSysconfig,
  uploadAction
} from '~/api/sysconfig.js'
import { toast } from '../../composables/util'
import FormDrawer from '~/components/FormDrawer.vue'
// 上传文件方法
// 1.引入getToken
import { getToken } from '~/composables/auth'

const token = getToken()
const loading = ref(false)
// 默认选中第一个
const activeName = ref("first")
// 表格数据
const tableData = [{
  name: '支付宝支付',
  desc: '该系统支持即时到账接口',
  src: '/alipay.png',
  key: 'alipay'
},
{
  name: '微信支付',
  desc: '该系统支持微信网页支付和扫码支付',
  src: '/wxpay.png',
  key: 'wxpay'
}]
// 表单数据
const form = reactive({
  "close_order_minute": 0,
  "auto_received_day": 0,
  "after_sale_day": 0,
  "alipay": {
    "app_id": "",
    "ali_public_key": "",
    "private_key": ""
  },
  "wxpay": {
    "app_id": "",       // 公众号 APPID
    "miniapp_id": "",   // 小程序 APPID
    "secret": "",       // 小程序secret
    "appid": "",        // appid
    "mch_id": "",       // 商户号
    "key": "",          // API 密钥
    "cert_client": "",
    "cert_key": ""
  }
})
// 获取数据方法
const getData = () => {
  loading.value = true
  getSysconfig()
    .then(res => {//获取数据成功
      console.log(res)
      // 因为res有很多数据是不传的
      for (const key in form) {
        form[key] = res[key]//将后端数据传给form
      }
    })
    .finally(() => {
      loading.value = false

    })
}
getData()

// 保存提交方法
const submit = () => {
  loading.value = true
  setSysconfig({
    ...form,
  })
    .then(res => {
      toast('修改成功')
      getData()

    })
    .finally(() => {
      loading.value = false

    })
}

// 打开弹框
// 辨别打开的是支付宝支付还是微信支付
const drawerType = ref('alipay')
const formDrawerRef = ref(null)
const open = (key) => {
  drawerType.value = key
  formDrawerRef.value.open()
}

//上传文件
function uploadClientSuccess(response, uploadFile, uploadFiles) {
  form.wxpay.cert_client = response.data
}
function uploadKeySuccess(response, uploadFile, uploadFiles) {
  form.wxpay.cert_key = response.data
}
</script>

<style></style>