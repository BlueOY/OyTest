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

  if(type && type=="shelf"){
    // 如果是上架下架
    let state = event.state
    try {
      let res = await db.collection('product').doc(id).update({
        data: {
          state: state
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
        error: e,
      }
    }
  }else if(type && type=="update"){
    //如果是更新
    let name = event.name
    if(name){
      name = decodeURI(name);
    }
    let classifyId = event.classifyId
    let describe = event.describe
    if(describe){
      describe = decodeURI(describe);
    }
    let price = event.price
    if(price){
      price =   parseFloat(price);
    }
    let state = event.state
    if(state){
      state = parseInt(state);
    }
    let stock = event.stock
    if(stock){
      stock = parseInt(stock);
    }
    let hot = event.hot
    let imagePath = event.imagePath
    if(imagePath){
      imagePath = decodeURI(imagePath);
    }
    
    try {
      // 更新商品数据
      let res = await db.collection('product').doc(id).update({
        data: {
          name: name,
          classifyId: classifyId,
          describe: describe,
          price: price,
          state: state,
          stock: stock,
          hot: hot,
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