# Vue 3 + Vite
项目:商城管理系统
1.vite创建项目，执行npm run dev
2.用Vue CLI创建项目，执行npm run serve

一、创建路由，配置路由信息
二、404页面配置，当路径不存在时就会跳转到404页面
1.https://router.vuejs.org/zh/guide/ 网站1中找     
捕获所有路由或 404 Not found 路由
2.404页面美化---element库---Result 结果
三、设置输入框图标
<el-form-item>
        <el-input v-model="form.password" placeholder="请输入密码">
          <!-- 使用插槽版本的图标 -->
           <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
四、抽离项目的class
五、表单验证

