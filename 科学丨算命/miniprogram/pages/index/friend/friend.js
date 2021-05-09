// miniprogram/pages/index/friend/friend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noData: true,
    text: ""
  },
  random: -1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
  },

  loadData: function () {
    wx.showLoading({
      title: '加载中',
    });
    wx.cloud.callFunction({
      name: 'queryFriend',
      data: {
        random: this.random
      },
      success: res => {
        wx.hideLoading();
        // wx.showToast({
        //   title: '调用成功',
        // })
        console.log('测友情：', JSON.stringify(res));
        let info = res.result.data[0];
        let text = info.text;
        this.random = res.result.random;
        this.setData({
          text: text,
          noData: false,
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

  refresh: function (e) {
    this.loadData();
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
    wx.onAccelerometerChange(function (e) {
      console.log(e.x)
      console.log(e.y)
      console.log(e.z)
      if (e.x > 1 && e.y > 1) {
          wx.showToast({
              title: '摇一摇成功',
              icon: 'success',
              duration: 2000
          })
      }
    })
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