// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try{
    let res = await db.collection('syslog').add({
      data: {
        title: "定时任务",
        content: "定时任务",
        createTime: new Date(),
      }
    });
    return {
      result: true,
      res: res,
      message: "定时任务成功",
    }
  }catch(e){
    return {
      result: false,
      error: e,
      message: "定时任务失败",
    }
  }
}