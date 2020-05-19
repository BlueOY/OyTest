// miniprogram/pages/user/user.js
var base64 = require("../../images/user/base64");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user/user-unlogin.png',
    userName: "点击登录",
    userInfo: {},
    logged: false,
  },

  bindGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userName: e.detail.userInfo.nickName,
        userInfo: e.detail.userInfo
      })
    }
    // wx.showToast({
    //   title: '请求成功',
    // })
  },

  // 订单列表
  orderList: function (e) {
    wx.navigateTo({
      url: './orderList/orderList',
    })
  },

  // 选择收货地址
  address: function (e) {
    let that = this;
    wx.chooseAddress({
      success(res) {
        console.log("res="+JSON.stringify(res))
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      icon: base64.icon20
    });

    // 查看是否授权
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userName: e.detail.userInfo.nickName,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
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