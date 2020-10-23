// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let content = event.content
  if(content){
    content = decodeURI(content);
  }
  let state = event.state
  if(state){
    state = parseInt(state);
  }
  let type = event.type
  let imagePath = event.imagePath
  if(imagePath){
    imagePath = decodeURI(imagePath);
  }
  let link = event.link
  if(link){
    link = decodeURI(link);
  }
  let productId = event.productId

  try {
    let res = await db.collection('dynamic').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        content: content,
        state: state,
        type: type,
        imagePath: imagePath,
        link: link,
        productId: productId,
        createTime: new Date()
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