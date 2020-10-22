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
  let address = event.address
  if(address){
    address = decodeURI(address);
  }
  let phone = event.phone
  let introduce = event.introduce
  if(introduce){
    introduce = decodeURI(introduce);
  }

  try {
    let res = await db.collection('static').doc(id).update({
      data: {
        address: address,
        phone: phone,
        introduce: introduce,
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
}