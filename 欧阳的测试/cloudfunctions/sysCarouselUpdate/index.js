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
      //如果要更新图片，查询旧图片
      let fileid;
      if(imagePath){
        let where = {
          _id: id
        };
        let queryRes = await db.collection('carousel').where(where).get();
        fileid = queryRes.data[0].imagePath;
      }
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
      let deleteFileRes = "";
      if(fileid){
        const result = await cloud.deleteFile({
          fileList: [fileid],
        })
        deleteFileRes = result.fileList;
      }
      return {
        result: true,
        message: "更新成功",
        deleteFileRes: deleteFileRes,
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