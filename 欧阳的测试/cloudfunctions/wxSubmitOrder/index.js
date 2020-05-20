// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  // 订单商品列表
  let orderProductList = event.orderProductList;
  // 配送方式
  let pick = event.pick;
  // 取货/收货信息
  let contacts = event.contacts;
  if(pick=="send"){
    contacts.address = contacts.provinceName+contacts.cityName+contacts.countyName+contacts.detailInfo;
  }
  // 支付方式
  let payment = event.payment;
  // 这里补充优惠券的逻辑

  //拼接商品id
  let productIds = [];
  let length = orderProductList.length;
  for(let i=0;i<length;i++){
    let item = orderProductList[i];
    productIds.push(item._id);
  }
  let where = {
    _id: _.in(productIds)
  };
  // 其它参数
  let pageIndex = 0;
  let pageSize = 100;
  try{
    let res = await db.collection('product').where(where)
            .skip(pageIndex*pageSize).limit(pageSize).get();
    // 计算有效的商品
    let effectiveProduct = [];
    let length = res.data.length;
    for(let i=0;i<length;i++){
      let item = res.data[i];
      // 如果商品没失效
      if(item.state>0){
        // 判断库存是否足够
        let temp = orderProductList.find(temp => {
          return temp._id == item._id;
        });
        if(temp && temp.num <= item.stock){
          // 如果库存足够，则添加到有效的商品列表
          effectiveProduct.push(item);
        }
      }
    }
    // 插入数据库
    // 启动事务
    const result = await db.runTransaction(async transaction => {
      try{
        // 插入订单
        let orderRes = await db.collection('order').add({
          data: {
            // 配送方式
            pick: pick,
            // 联系人
            userName: contacts.userName,
            // 联系电话
            phone: contacts.telNumber,
            // 收货地址
            address: contacts.address,
            // 支付方式
            payment: payment,
            // 用户唯一识别号
            openid: wxContext.OPENID
          }
        });
        // 插入订单商品
        let effectiveProductLengt = effectiveProduct.length;
        for(let i=0;i<effectiveProductLengt;i++){
          let item = effectiveProduct[i];
          item.orderId = orderRes._id;
          let productRes = await db.collection('orderProduct').add({
            data: item
          });
        }

        // 会作为 runTransaction resolve 的结果返回
        return {
          res: true,
        }
      }catch(e){
        console.error(e);
        // 会作为 runTransaction reject 的结果出去
        await transaction.rollback(-100);
        // 将异常再往外抛
        throw new Error(e);
      }
    });

    return result;
  }catch(e){
    console.error(e);
    return e;
  }
}