// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let id = event.id
  let type = event.type

  if(type && type=="receipt"){
    // 如果是确认收货
    try {
      let res = await db.collection('order').doc(id).update({
        data: {
          state: 2
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
  }else if(type && type=="cancel"){
    // 如果是取消订单
    try {
      let res = await db.collection('order').doc(id).update({
        data: {
          state: -1
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
  }else{
    return {
      result: false,
      message: "什么也没做",
    }
  }
}