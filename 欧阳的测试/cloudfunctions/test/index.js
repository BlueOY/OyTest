// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // return {
  //   test: "测试"
  // }

  
  // let res = await db.collection('product').where({
  //   state: _.gt(0)
  // }).limit(4).get();
  let res = await insertProduct();
  return {
    test: res
  }
}

async function query(){
  try{
    let res = await db.collection('product').where({
      state: _.gt(0)
    }).limit(4).get();
    return res;
  }catch(e){
    console.log(e);
    return e;
  }
  return "fail";
}

async function insertProduct(){
  try {
    for(let i=9;i<20;i++){
      let classifyRes = await db.collection('classify').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          name: "分类"+i,
        }
      });
      for(let j=0;j<20;j++){
        let productRes = await db.collection('product').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            classify: classifyRes._id,
            name: "商品"+i,
            createTime: new Date(),
            imagePath: "cloud://ouyang-s2hbg.6f75-ouyang-s2hbg-1255305994/product/test.jpg",
            price: 0.01,
            state: 1,
            stock: 20,
            hot: false
          }
        });
      }
    }
    return "true";
  } catch(e) {
    console.error(e)
    return "true";
  }
}