// 用于封装一些重复的方法
// 1.封装cookie方法---用于存储token
// 引入
import { useCookies } from '@vueuse/integrations/useCookies'
const cookie = useCookies()
// 给token取固定名字
const TokenKey = 'admin-token'
// 获取token
export function getToken() {
  // cookies.get('键')
  return cookie.get(TokenKey)
}

// 存储token
export function setToken(token) {
  return cookie.set(TokenKey, token)
}

// 删除token
export function removeToken() {
  return cookie.remove(TokenKey)
}