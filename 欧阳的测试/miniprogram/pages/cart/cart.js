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
    // 已选的商品
    selectId: [],
    selectNum: {},
  },

  checkboxChange: function (e) {
    let idx = e.currentTarget.dataset.idx;
    let checks = e.detail.value.length > 0 ? true : false;
    let cart = wx.getStorageSync("cart");
    let totalPrice = 0;
    let selectAll = true;
    // 已选商品
    let selectId = [];
    let selectNum = {};
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
          // 已选商品
          selectId.push(cart[i]._id);
          selectNum[cart[i]._id] = cart[i].num;
        }
      }
    } else {
      selectAll = checks;
      let length = cart.length;
      for (let i = 0; i < length; i++) {
        cart[i].checks = checks;
        if (cart[i].checks == true) {
          // 计算总价
          totalPrice += cart[i].price * cart[i].num;
          // 已选商品
          selectId.push(cart[i]._id);
          selectNum[cart[i]._id] = cart[i].num;
        }
      }
    }
    // 存储数据
    wx.setStorageSync("cart", cart);
    // 刷新数据
    this.setData({
      cartData: cart,
      totalPrice: totalPrice,
      selectAll: selectAll,
      selectId: selectId,
      selectNum: selectNum,
    });
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
      // 已选商品
      let selectId = [];
      let selectNum = {};
      // 循环计算数据
      let cart = this.data.cartData;
      let length = cart.length;
      for (let i = 0; i < length; i++) {
        if (cart[i].checks == true) {
          // 计算总价
          totalPrice += cart[i].price * cart[i].num;
          // 已选商品
          selectId.push(cart[i]._id);
          selectNum[cart[i]._id] = cart[i].num;
        }
      }
      // 刷新购物车数据
      // this.loadCartData();
      // 刷新购物车数据
      this.setData({
        cartData: this.data.cartData,
        totalPrice: totalPrice,
        selectId: selectId,
        selectNum: selectNum,
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
            // 计算总价和是否全选
            let totalPrice = 0;
            // 已选商品
            let selectId = [];
            let selectNum = {};
            // 循环计算数据
            let cart = that.data.cartData;
            let length = cart.length;
            for (let i = 0; i < length; i++) {
              if (cart[i].checks == true) {
                // 计算总价
                totalPrice += cart[i].price * cart[i].num;
                // 已选商品
                selectId.push(cart[i]._id);
                selectNum[cart[i]._id] = cart[i].num;
              }
            }
            // 刷新数据
            let noCartData;
            if (that.data.cartData.length > 0) {
              noCartData = false;
            } else {
              noCartData = true;
            }
            that.setData({
              cartData: that.data.cartData,
              noCartData: noCartData,
              totalPrice: totalPrice,
              selectId: selectId,
              selectNum: selectNum,
            });
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
    // 已选商品
    let selectId = [];
    let selectNum = {};
    // 循环计算数据
    let cart = this.data.cartData;
    let length = cart.length;
    for (let i = 0; i < length; i++) {
      if (cart[i].checks == true) {
        // 计算总价
        totalPrice += cart[i].price * cart[i].num;
        // 已选商品
        selectId.push(cart[i]._id);
        selectNum[cart[i]._id] = cart[i].num;
      }
    }
    // 刷新购物车数据
    // this.loadCartData();
    // 刷新购物车数据
    this.setData({
      cartData: this.data.cartData,
      totalPrice: totalPrice,
      selectId: selectId,
      selectNum: selectNum,
    });
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
      // 已选商品
      let selectId = [];
      let selectNum = {};
      // 循环计算数据
      let length = cart.length;
      for (let i = 0; i < length; i++) {
        if (cart[i].checks == false) {
          // 是否全选
          selectAll = false;
        } else {
          // 计算总价
          totalPrice += cart[i].price * cart[i].num;
          // 已选商品
          selectId.push(cart[i]._id);
          selectNum[cart[i]._id] = cart[i].num;
        }
      }
      //设置购物车数据
      this.setData({
        cartData: cart,
        noCartData: false,
        totalPrice: totalPrice,
        selectAll: selectAll,
        selectId: selectId,
        selectNum: selectNum,
      });
    } else {
      this.setData({
        cartData: [],
        noCartData: true,
      });
    }
  },

  toDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

  // 提交购物车
  submit: function (e) {
    let selectId = this.data.selectId;
    let that = this;
    if(selectId.length == 0){
      wx.showToast({
        icon: 'none',
        title: '请先选择要提交的商品',
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
    });
    wx.cloud.callFunction({
      name: 'wxSubmitCart',
      data: {
        selectId: selectId,
      },
      success: res => {
        wx.hideLoading();
        // wx.showToast({
        //   title: '提交成功',
        // })
        let result = res.result.data;
        let productList = JSON.stringify(result);
        let selectNum = JSON.stringify(that.data.selectNum);
        wx.navigateTo({
          url: './subOrder/subOrder?productList='+productList+"&selectNum="+selectNum,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [wxSubmitCart] 调用失败：', err)
      }
    });
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