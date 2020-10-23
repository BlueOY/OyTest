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
  let hot = event.hot
  let classify = event.classify
  let searchKey = event.searchKey
  let pageIndex = event.pageIndex
  let pageSize = event.pageSize
  let ids = event.ids

  //拼接查询条件
  let where = {
    state: _.gt(0)
  };
  if(id){
    where._id = id
  }
  if(hot){
    where.hot = true
  }
  if(classify){
    where.classifyId = classify
    // where.classifyId = classify
  }
  if(searchKey){
    where.name = db.RegExp({
      regexp: searchKey,  //从搜索栏中获取的value作为规则进行匹配。
      options: 'i',  //大小写不区分
    });
  }
  if(!pageIndex){
    pageIndex = 0
  }
  if(!pageSize){
    pageSize = 10
  }
  if(ids){
    where._id = _.in(ids)
  }

  try{
    let res = await db.collection('product').where(where)
            .skip(pageIndex*pageSize).limit(pageSize).get();
    return res;
  }catch(e){
    console.error(e);
    return e.message;
  }
}