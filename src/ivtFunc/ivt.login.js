// 登录模块
import { makeAutoObservable } from "mobx"
//import axios from "axios"
import { getToken, http, setToken } from '@/utils'

class LoginIvt {
  result = ''
  token = getToken() || ''
  constructor() {
    makeAutoObservable(this)
  }
  // 登录
  login = async ({ username, password }) => {
    // console.log("aaa")
    // console.log({ username, password })
    const res = await http.post('/user/login', {
      username,
      password
    })
    this.token = res.data.data.token
    this.result = res.data.code
    setToken(this.token)
    //console.log(res.data)
    console.log('aaa' + getToken())
  }
}
export default LoginIvt