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
  let searchKey = event.searchKey
  let hot = event.hot
  let classifyId = event.classifyId
  let state = event.state
  let timeFrom = event.timeFrom
  let timeTo = event.timeTo
  let pageIndex = event.pageIndex
  let pageSize = event.pageSize

  //拼接查询条件
  let where = {
  };
  if(id){
    // 查单条
    where._id = id
    try{
      let res = await db.collection('product').where(where).get();
      return res;
    }catch(e){
      console.error(e);
      return e.message;
    }
  }else{
    if(searchKey){
      searchKey = decodeURI(searchKey);
      where.name = db.RegExp({
        regexp: searchKey,  //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',  //大小写不区分
      });
    }
    if(hot && hot!=-1){
      where.hot = true
    }
    if(classifyId && classifyId!=-1){
      where.classifyId = classifyId
    }
    if(state && state!=-1){
      where.state = Number(state)
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
      // let res = await db.collection('product').where(where)
      //         .skip(pageIndex*pageSize).limit(pageSize).get();
  
      let res = await db.collection('product').aggregate()
      .match(where)
      .lookup({
        from: 'classify',
        let: {
          // 取别名
          classify_id: "$classifyId"
        },
        pipeline: $.pipeline()
          // 联表查询的条件
          .match(_.expr($.eq(['$_id', '$$classify_id'])))
          .project({
            // 去掉联表中的_id字段
            _id: 0,
          })
          .done(),
        as: 'classify',
      })
      .addFields({
        // 取联表查询结果的第一项为分类字段
        classify: $.arrayElemAt(['$classify', 0]),
      })
      .skip(pageIndex*pageSize).limit(pageSize)
      .end();
      // 查总条数
      const countResult = await db.collection('product').where(where).count();
      const total = countResult.total;
      res.total = total;
      return res;
    }catch(e){
      console.error(e);
      return e.message;
    }
  }
}