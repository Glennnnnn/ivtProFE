import { http } from "@/utils"
import React from "react"

function ComSon1(props) {
  //console.log(props.msg)
  return (
    <div>
      son componment 1
      {props.msg}
    </div>
  )
}

function ComSon2(props) {
  const sonMsg = "changed"

  function callFather(msg) {
    console.log('exe')
    props.changFun(msg)
  }
  //console.log(props)
  return (
    <div>
      <button onClick={() => callFather(sonMsg)}>clickTest</button>
    </div>
  )
}




class Test01 extends React.Component {
  state = {
    message: 'aaa'
  }
  // printEvent = (e) => {
  //   console.log(e.ComSon1)
  // }

  printMsg = (e) => {
    return (
      <div>
        show msg
      </div>
    )
  }

  changeState = (msg) => {
    this.setState({
      message: msg
    })
  }

  render() {
    return (
      <div>
        <ComSon1 msg={this.state.message} />
        <ComSon2 changFun={this.changeState} />
        <button onClick={() => {
          http.get("/print")
        }}>this is a href button</button>
      </div >

    )
  }
}

export default Test01