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

  if(type && type=="cancel"){
    // 如果是取消
    try {
      let res = await db.collection('feedback').doc(id).update({
        data: {
          state: -1,
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
    let title = event.title
    if(title){
      title = decodeURI(title);
    }
    let content = event.content
    if(content){
      content = decodeURI(content);
    }
    let state = event.state
    if(state){
      state = parseInt(state);
    }
    
    try {
      let res = await db.collection('feedback').doc(id).update({
        data: {
          name: name,
          content: content,
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