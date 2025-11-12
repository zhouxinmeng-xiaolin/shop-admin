// 用于共享数据
import { createStore } from 'vuex'
// 引入getInfo
import { getInfo, login, logout } from '../api/manager'
// 引入封装cookie
import { setToken } from '~/composables/auth'
// 引入清除token
import { removeToken } from '~/composables/auth'
import { ElAside } from 'element-plus'
// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      // 用户信息
      user: {},
      // 侧边宽度
      asideWidth: '250px',
      menus: [],
      ruleNames: []
    }
  },
  mutations: {
    // 存用户信息
    SHARE_USERINFO(state, user) {
      state.user = user//共享
    },
    // 控制侧边宽度变化
    handleAsideWidth(state) {
      state.asideWidth = state.asideWidth == '250px' ? '64px' : '250px'
    },
    SET_MENUS(state, menus) {
      state.menus = menus
    },
    SET_RULENAMES(state, ruleNames) {
      state.ruleNames = ruleNames
    }

  },
  // 记录用户信息
  actions: {
    // 登录--保存token操作--异步操作
    // login 动作的核心是：接收账号密码 → 调用登录接口 → 成功后存 token → 告诉组件 “登录成功 / 失败”
    login({ commit }, { username, password }) {
      // 因为登录是 “异步操作”（发请求给后端需要时间），返回 Promise 后，
      // 组件里可以用 async/await 或 .then() 等待登录结果。
      return new Promise((resolve, reject) => {
        // 给后端发送账号密码，成功的话后端会返回token
        login(username, password).then((res) => {
          // 存储token，将后端token存起来 
          setToken(res.token)
          // 告诉组件 “登录成功”，并把后端返回的数据传给组件（组件里就能知道登录成功了）
          resolve(res)
        }).catch((err) => {
          // 告诉组件 “登录失败”，并把错误信息传给组件（组件里可以提示用户 “账号或密码错误”）。
          reject(err)
        })
      })
    },
    // {commit}解构commit,相当于store.commit，解构就不用使用useuseStore
    // 获取用户信息操作
    getInfo({ commit }) {
      return new Promise((resolve, reject) => {
        // 调用后端接口方法
        getInfo().then((res) => {
          commit('SHARE_USERINFO', res)
          commit('SET_MENUS', res.menus)
          commit('SET_RULENAMES', res.ruleNames)
          // console.log(res2);  
          // 成功执行，就把用户相关信息传过去
          resolve(res)
        })  
          .catch((err) => {
            // 失败就把失败相关信息传过去
            reject(err)
          })
      })
    },
    // 退出登录--清除token、用户信息要在vuex里实现，这样刷新页面就不会变
    logout({ commit }) {// 从 Vuex 里“拿”commit 这个工具
      // 2.退出登录--清除token
      removeToken()
      // 3.清理用户信息---使用commit向mutations返回空值
      commit('SHARE_USERINFO', {})
    }
  }
})
// 暴露
export default store