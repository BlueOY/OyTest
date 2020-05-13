// miniprogram/pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll_height: 0,
  },

  submit: function (e) {
    wx.navigateTo({
      url: './subOrder/subOrder',
    })
  },

  // 获取sroll-view的高度
  scrollViewHeight: function (e) {
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取sroll-view的高度
    this.scrollViewHeight();
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