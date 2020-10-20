// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let name = event.name
  if(name){
    name = decodeURI(name);
  }
  let classify = event.classify
  let describe = event.describe
  if(describe){
    describe = decodeURI(describe);
  }
  let price = event.price
  let state = event.state
  if(state){
    state =   parseInt(state);
  }
  let stock = event.stock
  let hot = event.hot

  try {
    let res = await db.collection('product').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        name: name,
        classifyId: classify,
        describe: describe,
        price: price,
        state: state,
        stock: stock,
        hot: hot,
        createTime: new Date()
      },
    });
    return {
      result: true,
      message: "成功",
    }
  } catch(e) {
    console.error(e)
    return {
      result: false,
      message: "失败",
      error: e.message,
    }
  }
}