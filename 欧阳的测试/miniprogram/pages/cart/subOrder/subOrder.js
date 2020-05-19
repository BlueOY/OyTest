// miniprogram/pages/cart/subOrder/subOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 配送方式
    pick: "send",
    // 收货地址
    address: {},

    // 商品列表数据
    orderProductList: [],
    // 总价格
    totalPrice: 0,
  },

  // 店铺配送
  send: function (e) {
    this.setData({
      pick: "send",
    });
  },
  // 到店自取
  take: function (e) {
    this.setData({
      pick: "take",
    });
  },

  // 选择收货地址
  address: function (e) {
    let that = this;
    wx.chooseAddress({
      success(res) {
        console.log("res="+JSON.stringify(res))
        that.setData({
          address: res
        });
      }
    });
  },

  // 提交
  submit: function (e) {
    let test = {};
    if(Object.keys(test).length === 0){
      console.log("true");
    }else{
      console.log("false");
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载商品列表
    this.loadProductList(options);

  },

  // 加载商品列表
  loadProductList: function (options) {
    try{
      let productList = JSON.parse(options.productList);
      let selectNum = JSON.parse(options.selectNum);
      // console.log("productList="+JSON.stringify(productList));
      // console.log("selectNum="+JSON.stringify(selectNum));
      // 计算总价
      let totalPrice = 0;
      // 循环列表
      let orderProductList = [];
      let length = productList.length;
      for(let i=0;i<length;i++){
        let item = productList[i];
        item.num = selectNum[item._id];
        orderProductList.push(item);
        if(item.state>0){
          // 计算总价
          totalPrice += item.price * item.num;
        }
      }
      this.setData({
        orderProductList: orderProductList,
        totalPrice: totalPrice,
      });
    }catch(e){
      console.error("------报错：", e);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})