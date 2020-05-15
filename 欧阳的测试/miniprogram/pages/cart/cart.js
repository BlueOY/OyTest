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

    // 总价格
    totalPrice: 0,
    // 全选
    selectAll: false,
  },

  checkboxChange: function (e) {
    let idx = e.currentTarget.dataset.idx;
    let checks = e.detail.value.length > 0 ? true : false;
    let cart = wx.getStorageSync("cart");
    let totalPrice = 0;
    let selectAll = true;
    // 修改购物车选中状态
    if (idx >= 0) {
      cart[idx].checks = checks;
      // 计算总价和是否全选
      let length = cart.length;
      for (let i = 0; i < length; i++) {
        if (cart[i].checks == false) {
          // 是否全选
          selectAll = false;
        } else {
          // 计算总价
          totalPrice += cart[i].price * cart[i].num;
        }
      }
    } else {
      selectAll = checks;
      let length = cart.length;
      for (let i = 0; i < length; i++) {
        cart[i].checks = checks;
        // 计算总价
        totalPrice += cart[i].price * cart[i].num;
      }
    }
    // 存储数据
    wx.setStorageSync("cart", cart);
    // 刷新数据
    this.setData({
      cartData: cart,
      totalPrice: totalPrice,
      selectAll: selectAll,
    });
  },

  toDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

  // 减
  reduce: function (e) {
    let that = this;
    let idx = e.currentTarget.dataset.idx;
    let item = this.data.cartData[idx];
    if (item && Number.isInteger(item.num) && item.num > 1) {
      item.num--;
      // 存储数据
      wx.setStorageSync("cart", this.data.cartData);
      // 计算总价
      let totalPrice = 0;
      let cart = this.data.cartData;
      let length = cart.length;
      for (let i = 0; i < length; i++) {
        if (cart[i].checks == true) {
          // 计算总价
          totalPrice += cart[i].price * cart[i].num;
        }
      }
      // 刷新购物车数据
      // this.loadCartData();
      // 刷新购物车数据
      this.setData({
        cartData: this.data.cartData,
        totalPrice: totalPrice,
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '是否将“' + item.name + '”从购物车移除？',
        success(res) {
          if (res.confirm) {
            // 用户点击确定
            that.data.cartData.remove(idx);
            // 存储数据
            wx.setStorageSync("cart", that.data.cartData);
            // 刷新数据
            that.setData({
              cartData: that.data.cartData
            });
            if (that.data.cartData.length > 0) {
              that.setData({
                noCartData: false
              });
            } else {
              that.setData({
                noCartData: true
              });
            }
          } else if (res.cancel) {
            // 用户点击取消
          }
        }
      });
    }
  },
  // 加
  plus: function (e) {
    let idx = e.currentTarget.dataset.idx;
    let item = this.data.cartData[idx];
    if (Number.isInteger(item.num)) {
      item.num++;
    } else {
      item.num = 1;
    }
    // 存储数据
    wx.setStorageSync("cart", this.data.cartData);

    // 计算总价
    let totalPrice = 0;
    let cart = this.data.cartData;
    let length = cart.length;
    for (let i = 0; i < length; i++) {
      if (cart[i].checks == true) {
        // 计算总价
        totalPrice += cart[i].price * cart[i].num;
      }
    }
    // 刷新购物车数据
    // this.loadCartData();
    // 刷新购物车数据
    this.setData({
      cartData: this.data.cartData,
      totalPrice: totalPrice,
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

    const query = wx.createSelectorQuery() // 创建节点查询器 query
    query.select('#foot').boundingClientRect()
    query.exec((res) => {
      let footHeight = res[0].height // #normalServe节点的高度
      this.setData({
        scroll_height: windowHeight - footHeight
      })
    })
  },

  // 获取购物车数据
  loadCartData: function () {
    let cart = wx.getStorageSync("cart");
    if (cart && cart instanceof Array && cart.length > 0) {
      let selectAll = true;
      // 计算总价和是否全选
      let totalPrice = 0;
      let length = cart.length;
      for (let i = 0; i < length; i++) {
        if (cart[i].checks == false) {
          // 是否全选
          selectAll = false;
        } else {
          // 计算总价
          totalPrice += cart[i].price * cart[i].num;
        }
      }
      //设置购物车数据
      this.setData({
        cartData: cart,
        totalPrice: totalPrice,
        selectAll: selectAll,
      });
      this.setData({
        noCartData: false
      });
    } else {
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