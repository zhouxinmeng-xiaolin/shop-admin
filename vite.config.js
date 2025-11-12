// 这个文件是 Vite 构建工具的配置文件（通常叫 vite.config.js），作用是给你的 Vue 项目 “定规矩”
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
// 设置src路径别名
import path from "path"
// https://vite.dev/config/
export default defineConfig({
  // 设置src路径别名
  resolve: {
    alias: {
      // 以后~就代表src路径
      "~": path.resolve(__dirname, "src")//__dirname拿到当前目录的路径，载指定src
    }
  },
  server: {
    // 代理---解决跨域问题
    proxy: {
      '/api': {// 匹配前端请求中以 /api 开头的路径
        target: 'http://ceshi13.dishait.cn',// 后端接口的实际地址
        changeOrigin: true,// 允许跨域（告诉后端请求来自同源的代理服务器）
        rewrite: (path) => path.replace(/^\/api/, ''),// 去掉请求路径里的 /api 前缀
      },
    }
  },
  plugins: [vue(), WindiCSS(),],
})
