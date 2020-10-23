// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let title = event.title
  if(title){
    title = decodeURI(title);
  }
  let content = event.content
  if(content){
    content = decodeURI(content);
  }

  try {
    let res = await db.collection('feedback').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: title,
        content: content,
        state: 0, // 处理状态
        createTime: new Date(),
        // 用户唯一识别号
        openid: wxContext.OPENID
      },
    });
    return {
      result: true,
      message: "新增成功",
    }
  } catch(e) {
    console.error(e)
    return {
      result: false,
      message: "新增失败",
      error: e.message,
    }
  }
}