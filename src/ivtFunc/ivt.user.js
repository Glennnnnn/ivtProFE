import { http } from "@/utils"
import { makeAutoObservable, runInAction } from "mobx"

class IvtUser {
  userInfo = {}
  constructor() {
    makeAutoObservable(this)
  }

  getUserInfo = async () => {
    const res = await http.get("/checkUser/queryBasicUserInfoByToken")
    runInAction(() => {
      this.userInfo = res.data.data
    })
  }

  checkUserToken = async () => {
    const res = await http.get("/checkUser/checkUserByToken")
    return res.data.msg
  }
}

export default IvtUser