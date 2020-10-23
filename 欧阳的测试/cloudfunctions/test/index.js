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

  //获取访问参数
  let test = event.test

  if(test){
    if(test=="query"){
      // 查询数据
      let res = await db.collection('product').where({
        state: _.gt(0)
      }).limit(4).get();
      return {
        test: test,
        res: res,
        msg: "查询",
      }
    }else if(test=="insert"){
      // 插入很多测试数据
      let res = await insertProduct();
      return {
        // test: test,
        res: res,
        msg: "插入",
      }
    }else if(test=="update"){
      // 更新数据
      let res = await updateProduct();
      return {
        test: test,
        res: res,
        msg: "更新",
      }
    }else if(test=="delete"){
      // 删除数据
      let res = await deleteProduct();
      return {
        test: test,
        res: res,
        msg: "删除",
      }
    }else{
      return {
        test: test,
        msg: "未知参数"
      }
    }
  }else{
    return {
      msg: "没有test参数"
    }
  }
}

// 测试查询
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

// 插入测试数据
async function insertProduct(){
  try {
    for(let i=0;i<1;i++){
      let classifyRes = await db.collection('classify').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          name: "分类"+i,
          state: 1,
          createTime: new Date(),
        }
      });
      for(let j=0;j<30;j++){
        let productRes = await db.collection('product').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            classifyId: classifyRes._id,
            name: "商品"+j,
            describe: "描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述",
            createTime: new Date(),
            imagePath: "cloud://ouyang-s2hbg.6f75-ouyang-s2hbg-1255305994/product/IMG_1876.JPG",
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
    console.error(e);
    return e;
  }
}

// 更新测试数据
async function updateProduct(){
  try {
    let where = {};
    let res = await db.collection('classify').where(where)
    .update({
      data: {
        state: 1
      },
    });
    return res;
  } catch(e) {
    console.error(e);
    return e;
  }
}

// 删除测试数据
async function deleteProduct(){
  try {
    return await db.collection('syslog').where({
      // content: "定时任务"
      _id: _.neq(0)
    }).remove();
  } catch(e) {
    console.error(e);
    return e;
  }
}