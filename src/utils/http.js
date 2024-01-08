//封装axios
import axios from 'axios'
import { getToken, setToken } from '@/utils/token'
import { history } from '@/utils/historyPlugin'
import JSONbig from 'json-bigint'

//const JSONbig = require('json-bigint')({ 'storeAsString': true });
const http = axios.create({
  baseURL: '/api',
  timeout: 5000,
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }],
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
  if (error.response.status === 401) {

    setToken('')
    //window.alert("Token expired please login")
    window.location = "/login"
    //history.push('/login')
  }
  return Promise.reject(error)
})

export { http }