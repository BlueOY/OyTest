// miniprogram/pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // sroll-view的高度
    scroll_height: 0,
    // 购物车数据
    cartData: [],
    // 没有购物车数据
    noCartData: false,
  },

  // 减
  reduce: function (e) {
    let that = this;
    let idx = e.currentTarget.dataset.idx;
    let item = this.data.cartData[idx];
    if(item && Number.isInteger(item.num) && item.num>1){
      item.num--;
    }else{
      wx.showModal({
        title: '提示',
        content: '是否将“'+item.name+'”从购物车移除？',
        success (res) {
          if (res.confirm) {
            // 用户点击确定
            that.data.cartData.remove(idx);
            // 刷新数据
            that.setData({
              cartData: that.data.cartData
            });
            if(that.data.cartData.length>0){
              that.setData({
                noCartData: false
              });
            }else{
              that.setData({
                noCartData: true
              });
            }
            // 存储数据
            wx.setStorage({
              key: "cart",
              data: that.data.cartData
            });
          } else if (res.cancel) {
            // 用户点击取消
          }
        }
      });
    }
    // 刷新购物车数据
    // this.loadCartData();
    // 刷新购物车数据
    this.setData({
      cartData: this.data.cartData
    });
    // 存储数据
    wx.setStorage({
      key: "cart",
      data: this.data.cartData
    });
    
  },
  // 加
  plus: function (e) {
    let idx = e.currentTarget.dataset.idx;
    let item = this.data.cartData[idx];
    if(Number.isInteger(item.num)){
      item.num++;
    }else{
      item.num=1;
    }
    wx.setStorage({
      key: "cart",
      data: this.data.cartData
    });
    // 刷新购物车数据
    // this.loadCartData();
    // 刷新购物车数据
    this.setData({
      cartData: this.data.cartData
    });
  },

  // 提交购物车
  submit: function (e) {
    wx.navigateTo({
      url: './subOrder/subOrder',
    })
  },

  // 获取sroll-view的高度
  scrollViewHeight: function () {
    let windowHeight = wx.getSystemInfoSync().windowHeight // 页面的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 页面的宽度

    const query = wx.createSelectorQuery()                // 创建节点查询器 query
    query.select('#foot').boundingClientRect()
    query.exec((res) => {
      let footHeight = res[0].height             // #normalServe节点的高度
      this.setData({
        scroll_height: windowHeight - footHeight
      })
    })
  },

  // 获取购物车数据
  loadCartData: function () {
    let cart = wx.getStorageSync("cart");
    if(cart && cart instanceof Array && cart.length>0){
      this.setData({
        cartData: cart
      });
      this.setData({
        noCartData: false
      });
    }else{
      this.setData({
        noCartData: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取sroll-view的高度
    this.scrollViewHeight();
    // 获取购物车数据
    this.loadCartData();
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
    // 刷新购物车数据
    this.loadCartData();
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