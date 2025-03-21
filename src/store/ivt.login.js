// 登录模块
import { makeAutoObservable } from "mobx"
//import axios from "axios"
import { getToken, setToken, removeToken } from '@/utils'
import { history } from "@/utils/historyPlugin"
import { http } from "@/utils"

class LoginIvt {
  result = ''
  token = getToken() || ''
  constructor() {
    makeAutoObservable(this)
  }
  // 登录
  login = async ({ username, password }) => {

    const res = await http.post('/user/login', {
      username,
      password
    })
    if (res.data.code === 200) {
      this.token = res.data.data.token
      this.result = res.data.code
      setToken(this.token)
      history.push('/')
    }

    // this.token = "a"
    // this.result = 200
    // setToken(this.token)
    // history.push('/')

    //console.log(res.data)
    console.log('aaa' + getToken())
  }

  logout = async () => {
    const res = await http.get('/user/logout')
    if (res.data.code === 200) {
      this.result = res.data.code
      console.log(getToken())
      removeToken()
    }

  }
}
export default LoginIvt