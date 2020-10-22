// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let _id = event._id
  
  //拼接查询条件
  let where = {
  };
  if(_id){
    // 查单个
    where._id = _id
    try{
      let res = db.collection('order').aggregate()
      .match(where)
      .lookup({
        from: 'orderProduct',
        localField: '_id',
        foreignField: 'orderId',
        as: 'productList',
      })
      .end();
      return res;
    }catch(e){
      console.error(e);
      return e.message;
    }
  }else{
    // 查列表
    let searchKey = event.searchKey
    let state = event.state
    let payState = event.payState
    let timeFrom = event.timeFrom
    let timeTo = event.timeTo
    let pageIndex = event.pageIndex
    let pageSize = event.pageSize
    if(searchKey){
      searchKey = decodeURI(searchKey);
      where._id = db.RegExp({
        regexp: searchKey,  //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',  //大小写不区分
      });
    }
    if(state!=undefined && state!=-2){
      where.state = Number(state)
    }
    if(payState!=undefined && payState!=-1){
      where.payState = (payState==="true" ? true : false);
    }
    if(timeFrom){
      where.createTime = _.gte(new Date(timeFrom+" 00:00:00"))
    }
    if(timeTo){
      where.createTime = _.lte(new Date(timeTo+" 23:59:59"))
    }
    if(!pageIndex){
      pageIndex = 0
    }
    if(!pageSize){
      pageSize = 10
    }
    try{
      let res = await db.collection('order').aggregate()
      .match(where)
      .lookup({
        from: 'orderProduct',
        localField: '_id',
        foreignField: 'orderId',
        as: 'productList',
      })
      .addFields({
        firstProduct: $.arrayElemAt(['$productList', 0]),
        productCount: $.size('$productList'),
      })
      .project({
        productList: false,
      })
      .skip(pageIndex*pageSize).limit(pageSize)
      .end();
      // 查总条数
      const countResult = await db.collection('order').where(where).count();
      const total = countResult.total;
      res.total = total;
      return res;
    }catch(e){
      console.error(e);
      return e.message;
    }
  }
}