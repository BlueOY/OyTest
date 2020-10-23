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

  try {
    //删除意见反馈
    let res = await db.collection('feedback').where({
      _id: id
    }).remove();
    return {
      result: true,
      message: "成功",
    }
  } catch(e) {
    console.error(e);
      return {
        result: false,
        message: "失败",
        error: e.message,
      }
  }
}