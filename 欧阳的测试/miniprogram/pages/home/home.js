// miniprogram/pages/info/info.js
let phoneNumber = "0000";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //图片轮播参数
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,

    //商户信息
    address: "商户地址",
    introduce: "商户介绍",
    //轮播图列表
    carouselList: [],
    //热门商品数据
    hotProduct: [],
  },

  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
    })
  },

  productList: function (e) {
    wx.navigateTo({
      url: '../product/productList/productList',
    })
  },

  toDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product/product?id='+id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查询商户信息
    this.getInfo();
    // 查询轮播图
    this.getCarousel();
    // 查询热门商品
    this.hotProduct();
  },

  // 查询商户信息
  getInfo: function (options) {
    wx.cloud.callFunction({
      name: 'sysStaticQuery',
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })
        console.log('查询商户信息：', JSON.stringify(res));
        let info = res.result.data[0];
        phoneNumber = info.phone;
        this.setData({
          address: info.address,
          introduce: info.introduce,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '无法连接服务器',
        })
        console.error('[云函数] [wxProductQuery] 调用失败：', err)
      }
    });
  },

  // 查询轮播图
  getCarousel: function (options) {
    wx.cloud.callFunction({
      name: 'wxCarouselQuery',
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })
        console.log('查询轮播图：', JSON.stringify(res));
        this.setData({
          carouselList: res.result.data,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '无法连接服务器',
        })
        console.error('[云函数] [wxProductQuery] 调用失败：', err)
      }
    });
  },

  // 查询热门商品
  hotProduct: function (options) {
    wx.cloud.callFunction({
      name: 'wxProductQuery',
      data: {
        hot: true
      },
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })
        this.setData({
          hotProduct: res.result.data,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '无法连接服务器',
        })
        console.error('[云函数] [wxProductQuery] 调用失败：', err)
      }
    });
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
    // 查询商户信息
    this.getInfo();
    // 查询轮播图
    this.getCarousel();
    // 查询热门商品
    this.hotProduct();
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