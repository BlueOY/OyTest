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
  let operation = event.operation

  if(operation && operation=="show"){
    // 如果是启用禁用
    let state = event.state
    try {
      let res = await db.collection('carousel').doc(id).update({
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
  }else if(operation && operation=="update"){
    //如果是更新
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
    
    try {
      let res = await db.collection('carousel').doc(id).update({
        data: {
          remarks: remarks,
          state: state,
          type: type,
          index: index,
          imagePath: imagePath,
          updateTime: new Date(),
        },
      })
      //如果更新了图片，删除旧图片
      if(imagePath){
        cloud.deleteFile({
          fileList: [imagePath]
        }).then(res => {
          // handle success
          console.log(res.fileList)
        }).catch(error => {
          // handle error
        })
      }
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