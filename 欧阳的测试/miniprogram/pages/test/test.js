// miniprogram/pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: '',
    imagePath: '',

    address: {},
    flag: false,
  },

  home: function (options) {
    wx.reLaunch({
      url: '../home/home',
    })
    // wx.switchTab({
    //   url: '/index'
    // })
  },

  test: function (options) {
    wx.cloud.callFunction({
      name: 'test',
      // name: 'wxProductQuery',
      // name: 'wxGetOpenid',
      data: {
        hot: true,
        // classify: "05f2c36f5ebccd1400c8783176aceb50"
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        this.setData({
          result: JSON.stringify(res.result),
          // imagePath: res.result.test.data[0].imagePath,

          address: res.result,
          flag: true,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [test] 调用失败：', err)
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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