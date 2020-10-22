// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let where = {
    state: _.gt(0)
  };

  try{
    let res = await db.collection('carousel').where(where).orderBy('index', 'asc').get();
    return res;
  }catch(e){
    console.log(e);
    return e.message;
  }
}