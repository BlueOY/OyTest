// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let r = event.random
  let random = Math.floor(Math.random()*10);
  //拼接查询条件
  while(r == random){
    random = Math.floor(Math.random()*10);
  }
  let where = {
    // state: _.gt(0)
  };

  try{
    let res = await db.collection('fortune').where(where)
            .skip(random).limit(1).get();
    res.random = random;
    res.r = r;
    return res;
  }catch(e){
    console.log(e);
    return e.message;
  }
}