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
  // 订单状态为待付款
  let state = 0;
  // 如果是货到付款
  if(payment==0){
    // 订单状态改为待收货
    state = 1;
  }
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
    let res = await db.collection('product').where(where).skip(pageIndex*pageSize).limit(pageSize).get();
    if(res.data){
      // 计算有效的商品和金额
      let effectiveProduct = [];
      let amount = 0;
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
            item.num = temp.num;
            effectiveProduct.push(item);
            // 计算金额
            amount += item.price * temp.num;
          }
        }
      }
      // 插入数据库
      // 启动事务
      const result = await db.runTransaction(async transaction => {
        try{
          let openid = wxContext.OPENID;
          if(!openid){
            openid = 0;
          }
          // 插入订单
          let orderRes = await transaction.collection('order').add({
            data: {
              // 配送方式
              pick: pick,
              // 联系人
              userName: contacts.userName,
              // 联系电话
              phone: contacts.telNumber,
              // 收货地址
              address: contacts.address,
              // 金额
              amount: amount,
              // 支付方式
              payment: payment,
              // 付款状态
              payState: false,
              // 订单状态
              state: state,
              // 创建时间
              createTime: new Date(),
              // 用户唯一识别号
              openid: wxContext.OPENID
            }
          });
          // 插入订单商品
          let effectiveProductLengt = effectiveProduct.length;
          for(let i=0;i<effectiveProductLengt;i++){
            let item = effectiveProduct[i];
            delete item._id;
            delete item.hot;
            item.orderId = orderRes._id;
            let productRes = await transaction.collection('orderProduct').add({
              data: item
            });
          }

          // 会作为 runTransaction resolve 的结果返回
          return {
            result: true,
            orderId: orderRes._id,
          }
        }catch(e){
          console.error(e);
          // 会作为 runTransaction reject 的结果出去
          await transaction.rollback(e.message);
          // 将异常再往外抛（好像注释掉还会往外抛？）
          // throw new Error(e);
        }
      });

      return result;
    }else{
      return {
        result: false,
        message: res.message,
      };
    }
  }catch(e){
    console.error(e);
    return {
      result: false,
      error: e.message,
    };
  }
}