//封装axios
import axios from 'axios'
import { getToken, setToken } from '@/utils/token'
import { history } from './historyPlugin'

const http = axios.create({
  baseURL: '/api',
  timeout: 500000
})
// 添加请求拦截器
http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response
}, (error) => {
  console.log(error)
  if (error.response.status === 401) {
    setToken('')
    history.push('/login')
  }
  return Promise.reject(error)
})

export { http }