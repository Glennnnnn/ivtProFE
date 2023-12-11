// 登录模块
import { makeAutoObservable } from "mobx"
//import axios from "axios"
import { getToken, setToken } from '@/utils'
import { history } from "@/utils/historyPlugin"

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
    // const res = await http.post('/user/login', {
    //   username,
    //   password
    // })
    // if (res.data.code === 200) {
    //   this.token = res.data.data.token
    //   this.result = res.data.code
    //   setToken(this.token)
    //   history.push('/')
    // }

    this.token = "abcd"
    this.result = 200
    setToken(this.token)
    history.push('/')

    //console.log(res.data)
    console.log('aaa' + getToken())
  }

  logout = async () => {
    // const res = await http.post('/user/logout', {
    //   token: this.token
    // })
    // this.result = res.data.code
    this.result = 200
    this.token = ''
    //removeToken()？
    setToken(this.token)
  }
}
export default LoginIvt