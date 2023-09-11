import { history } from "@/utils/historyPlugin"
import { useIvt } from '@/store'
import { getToken } from "@/utils"

function LoginJumpComp({ children }) {
  const { ivtUser } = useIvt()
  if (getToken()) {
    console.log(window.location.pathname)
    const checkResult = ivtUser.checkUserToken()
    if (checkResult === 0) {
      history.push('/menu')
    } else if (checkResult === 1) {
      return <>{children}</>
    }
  } else {
    return <>{children}</>
  }

}

export { LoginJumpComp }