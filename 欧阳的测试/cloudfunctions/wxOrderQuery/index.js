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
  let id = event.id
  let state = event.state
  let pageIndex = event.pageIndex
  let pageSize = event.pageSize

  //拼接查询条件
  let where = {
    openid: wxContext.OPENID,
  };
  if(id){
    where._id = id
    try{
      // let res = await db.collection('order').where(where).get();
      // return res;

      let res = db.collection('order').aggregate()
      .match(where)
      .lookup({
        from: 'orderProduct',
        localField: '_id',
        foreignField: 'orderId',
        as: 'productList',
      })
      // .group({
      //   // 按 category 字段分组
      //   _id: '$category',
      //   // 让输出的每组记录有一个 avgSales 字段，其值是组内所有记录的 sales 字段的平均值
      //   avgSales: $.avg('$sales')
      // })
      .end();
      return res;
    }catch(e){
      console.error(e);
      return e;
    }
  }else{
    if(state!=undefined && state>=0){
      where.state = state
    }
    if(!pageIndex){
      pageIndex = 0
    }
    if(!pageSize){
      pageSize = 10
    }
    try{
      // let res = await db.collection('order').where(where)
      //         .skip(pageIndex*pageSize).limit(pageSize).get();
      
      let res = db.collection('order').aggregate()
      .match(where)
      .lookup({
        from: 'orderProduct',
        localField: '_id',
        foreignField: 'orderId',
        as: 'productList',
      })
      .addFields({
        // title: $.arrayElemAt(['$productList', 0]).name,
        // imagePath: $.arrayElemAt(['$productList', 0]).imagePath,
        firstProduct: $.arrayElemAt(['$productList', 0]),
        productCount: $.size('$productList'),
      })
      .project({
        productList: false,
      })
      .end();
      return res;
    }catch(e){
      console.error(e);
      return e;
    }
  }
}