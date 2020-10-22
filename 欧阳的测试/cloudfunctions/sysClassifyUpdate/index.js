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

  if(type && type=="shelf"){
    // 如果是启用禁用
    let state = event.state
    try {
      let res = await db.collection('classify').doc(id).update({
        data: {
          state: state,
        },
      })
      return {
        result: true,
        message: "更新成功",
      }
    } catch(e) {
      console.error(e)
      return {
        result: false,
        message: "更新失败",
        error: e.message,
      }
    }
  }else if(type && type=="update"){
    //如果是更新
    let name = event.name
    if(name){
      name = decodeURI(name);
    }
    let state = event.state
    if(state){
      state = parseInt(state);
    }
    
    try {
      let res = await db.collection('classify').doc(id).update({
        data: {
          name: name,
          state: state,
          updateTime: new Date(),
        },
      })
      return {
        result: true,
        message: "更新成功",
      }
    } catch(e) {
      console.error(e)
      return {
        result: false,
        message: "更新失败",
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