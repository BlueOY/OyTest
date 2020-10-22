// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let selectId = event.selectId;
  //拼接查询条件
  let where = {
    _id: _.in(selectId)
  };
  // 其它参数
  let pageIndex = 0;
  let pageSize = 100;
  try{
    let res = await db.collection('product').where(where)
            .skip(pageIndex*pageSize).limit(pageSize).get();
    return res;
  }catch(e){
    console.error(e);
    return e.message;
  }
}