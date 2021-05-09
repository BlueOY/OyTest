//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    // avatarUrl: '../../images/user/user-unlogin.png',
    userName: "点击获取头像",
  },

  onLoad: function() {
    //添加分享功能
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
    })
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
  },

})
