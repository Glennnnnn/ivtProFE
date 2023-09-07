import { http } from "@/utils"
import { makeAutoObservable } from "mobx"

class IvtUser {
  userInfo = {}
  constructor() {
    makeAutoObservable(this)
  }

  getUserInfo = async () => {
    const res = await http.get("/checkUser/queryBasicUserInfoByToken")
    this.userInfo = res.data.data
  }
}

export default IvtUser