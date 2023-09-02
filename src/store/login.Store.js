// 登录模块
import { makeAutoObservable } from "mobx"
//import axios from "axios"
import { http } from '@/utils'

class LoginStore {
  result = ''
  token = ''
  constructor() {
    makeAutoObservable(this)
  }
  // 登录
  login = async ({ username, password }) => {
    console.log("aaa")
    console.log({ username, password })
    const res = await http.post('/user/login', {
      username,
      password
    })
    //this.token = res.data.token
    this.result = res.data.result
    console.log(res)
  }
}
export default LoginStore