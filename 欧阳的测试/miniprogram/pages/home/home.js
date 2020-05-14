// miniprogram/pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //图片轮播数据
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],

    //图片轮播参数
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,

    //热门商品数据
    hotProduct: [],
  },

  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: '123',
    })
  },

  productList: function (e) {
    wx.navigateTo({
      url: './productList/productList',
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
    // 查询热门商品
    this.hotProduct();
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
        console.error('[云函数] [test] 调用失败：', err)
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