// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //拼接查询条件
  let random = Math.floor(Math.random()*10);
  let where = {
    // state: _.gt(0)
  };

  try{
    let res = await db.collection('love').where(where)
            .skip(random).limit(1).get();
    return res;
  }catch(e){
    console.log(e);
    return e.message;
  }
}