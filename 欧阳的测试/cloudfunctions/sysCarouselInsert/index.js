// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let remarks = event.remarks
  if(remarks){
    remarks = decodeURI(remarks);
  }
  let state = event.state
  if(state){
    state = parseInt(state);
  }
  let type = event.type
  let index = event.index
  let imagePath = event.imagePath
  if(imagePath){
    imagePath = decodeURI(imagePath);
  }
  let link = event.imagePath
  if(link){
    link = decodeURI(link);
  }

  try {
    let res = await db.collection('carousel').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        remarks: remarks,
        state: state,
        type: type,
        index: index,
        imagePath: imagePath,
        link: link,
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