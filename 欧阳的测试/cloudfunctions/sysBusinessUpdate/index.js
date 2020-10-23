// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let data = {
    updateTime: new Date(),
  };
  //获取访问参数
  let id = event._id
  let name = event.name
  if(name){
    name = decodeURI(name);
    data.name = name;
  }
  let address = event.address
  if(address){
    address = decodeURI(address);
    data.address = address;
  }
  let phone = event.phone
  if(phone){
    data.phone = phone;
  }
  let introduce = event.introduce
  if(introduce){
    introduce = decodeURI(introduce);
    data.introduce = introduce;
  }
  let headImg = event.headImg
  if(headImg){
    headImg = decodeURI(headImg);
    data.headImg = headImg;
  }

  try {
    let res = await db.collection('business').doc(id).update({
      data: data,
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