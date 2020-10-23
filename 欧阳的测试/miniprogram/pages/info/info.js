// miniprogram/pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImg: "../../images/info/user_img.jpg",
    name: "商户名称",

    //动态列表
    dynamicList: [],
  },

  toProduct: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product/product?id='+id,
    })
  },

  toLink: function (e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../static/webView/webView?url='+url,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查询商户信息
    this.getInfo();
    // 查询动态信息
    this.getDynamic();
  },

  // 查询商户信息
  getInfo: function (options) {
    wx.cloud.callFunction({
      name: 'sysBusinessQuery',
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })
        console.log('查询商户信息：', JSON.stringify(res));
        let info = res.result.data[0];
        this.setData({
          headImg: info.headImg,
          name: info.name,
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

  // 查询动态信息
  getDynamic: function (options) {
    wx.cloud.callFunction({
      name: 'wxDynamicQuery',
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })
        // console.log('查询动态信息：', JSON.stringify(res));
        let dynamicList = res.result.list;
        this.setData({
          dynamicList: dynamicList,
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