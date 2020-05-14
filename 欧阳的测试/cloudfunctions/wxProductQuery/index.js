// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let hot = event.hot
  let classify = event.classify
  let pageIndex = event.pageIndex
  let pageSize = event.pageSize

  //拼接查询条件
  let where = {
    state: _.gt(0)
  };
  if(hot){
    where.hot = true
  }
  if(classify){
    where.classify = classify
  }
  if(!pageIndex){
    pageIndex = 0
  }
  if(!pageSize){
    pageSize = 10
  }

  try{
    let res = await db.collection('product').where(where)
            .skip(pageIndex*pageSize).limit(pageSize).get();
    return res;
  }catch(e){
    console.log(e);
    return e;
  }
}