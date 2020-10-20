// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let id = event._id
  let type = event.type

  if(type && type=="sendOut"){
    // 如果是发货
    try {
      let res = await db.collection('order').doc(id).update({
        data: {
          state: 2,
        },
      })
      return {
        result: true,
        message: "成功",
      }
    } catch(e) {
      console.error(e)
      return {
        result: false,
        message: "失败",
        error: e.message,
      }
    }
  }else if(type && type=="update"){
    //如果是更新
    let amount = event.amount
    let payState = event.payState
    if(payState == "false"){
      payState = false;
    }
    let state = event.state
    if(state){
      state = parseInt(state);
    }
    let address = event.address
    if(address){
      address = decodeURI(address);
    }
    let userName = event.userName
    if(userName){
      userName = decodeURI(userName);
    }
    let phone = event.phone
    
    try {
      let res = await db.collection('order').doc(id).update({
        data: {
          amount: amount,
          payState: payState,
          state: state,
          address: address,
          userName: userName,
          phone: phone,
          updateTime: new Date(),
        },
      })
      return {
        result: true,
        message: "成功",
      }
    } catch(e) {
      console.error(e)
      return {
        result: false,
        message: "失败",
        error: e,
      }
    }
  }else{
    return {
      result: false,
      message: "什么也没做",
    }
  }
}