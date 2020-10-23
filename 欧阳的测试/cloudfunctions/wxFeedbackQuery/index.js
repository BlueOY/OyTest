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
  let title = event.title
  let content = event.content
  let pageIndex = event.pageIndex
  let pageSize = event.pageSize

  //拼接查询条件
  let where = {
    // state: _.gt(0)
  };
  if(id){
    where._id = id
  }
  if(title){
    title = decodeURI(title);
    where.title = db.RegExp({
      regexp: title,  //从搜索栏中获取的value作为规则进行匹配。
      options: 'i',  //大小写不区分
    });
  }
  if(content){
    content = decodeURI(content);
    where.content = db.RegExp({
      regexp: content,  //从搜索栏中获取的value作为规则进行匹配。
      options: 'i',  //大小写不区分
    });
  }
  if(!pageIndex){
    pageIndex = 0
  }
  if(!pageSize){
    pageSize = 100
  }

  try{
    let res = await db.collection('feedback').where(where)
            .skip(pageIndex*pageSize).limit(pageSize).get();
    // 查总条数
    const countResult = await db.collection('feedback').where(where).count();
    const total = countResult.total;
    res.total = total;
    return res;
  }catch(e){
    console.log(e);
    return e.message;
  }
}