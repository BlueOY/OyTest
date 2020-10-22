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
    //查询商品图片的file id
    let where = {
      _id: id
    };
    let queryRes = await db.collection('product').where(where).get();
    let fileid = queryRes.data[0].imagePath;
    //删除商品
    let res = await db.collection('product').where({
      _id: id
    }).remove();
    //如果删除了商品，删除图片
    let deleteFileRes = "";
    if(res.stats.removed>0){
      const result = await cloud.deleteFile({
        fileList: [fileid],
      })
      deleteFileRes = result.fileList;
    }
    return {
      result: true,
      message: "删除成功",
      deleteFileRes: deleteFileRes,
    }
  } catch(e) {
    console.error(e);
      return {
        result: false,
        message: "删除失败",
        error: e.message,
      }
  }
}