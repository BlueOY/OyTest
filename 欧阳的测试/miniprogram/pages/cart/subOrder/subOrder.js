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
    // 姓名
    userName: "",
    // 电话
    telNumber: "",

    // 支付方式列表
    paymentList: ["货到付款"],
    paymentIndex: 0,

    // 商品列表数据
    orderProductList: [],
    // 总价格
    totalPrice: 0,
    // 订单是否有效
    valid: false,
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

  //获取用户输入的姓名
  userNameInput:function(e){
    this.setData({
      userName: e.detail.value
    })
  },
  //获取用户输入的电话
  telNumberInput:function(e){
    this.setData({
      telNumber: e.detail.value
    })
  },

  paymentChange: function(e) {
    console.log('picker payment 发生选择改变，携带值为', e.detail.value);

    this.setData({
      paymentIndex: e.detail.value
    })
},

  // 提交
  submit: function (e) {
    if(this.data.pick=="send" && Object.keys(this.data.address).length === 0){
      wx.showToast({
        icon: 'none',
        title: '请选择收货地址',
      })
      return;
    }else if(this.data.pick=="take" && (this.data.userName=="" || this.data.telNumber=="")){
      wx.showToast({
        icon: 'none',
        title: '请输入取货信息',
      })
      return;
    }
    if(!this.data.valid){
      wx.showToast({
        icon: 'none',
        title: '无效的订单',
      })
      return;
    }
    let orderProductList = this.data.orderProductList;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '提交订单？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          });
          let pick = that.data.pick;
          let contacts;
          if(pick==""){
            contacts = that.data.address;
          }else{
            contacts.userName = that.data.userName;
            contacts.telNumber = that.data.telNumber;
          }
          wx.cloud.callFunction({
            name: 'wxSubmitOrder',
            data: {
              // 订单商品列表
              orderProductList: orderProductList,
              // 配送方式
              pick: that.data.pick,
              // 取货/收货信息
              contacts: contacts,
              // 支付方式
              payment: paymentIndex,
              // 这里补充优惠券的逻辑
            },
            success: res => {
              wx.hideLoading();
              wx.showToast({
                title: '提交成功',
              })
              let result = res.result.data;
              console.log("提交订单返回数据：result="+JSON.stringify(result));
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '调用失败',
              })
              console.error('[云函数] [wxSubmitOrder] 调用失败：', err)
            }
          });
        }
      }
    });
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
      // 订单是否有效
      let valid = false;
      // 循环列表
      let orderProductList = [];
      let length = productList.length;
      for(let i=0;i<length;i++){
        let item = productList[i];
        item.num = selectNum[item._id];
        orderProductList.push(item);
        if(item.state>0 && item.stock>=item.num){
          // 计算总价
          totalPrice += item.price * item.num;
          // 订单有效
          valid = true;
        }
      }
      this.setData({
        orderProductList: orderProductList,
        totalPrice: totalPrice,
        valid: valid,
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