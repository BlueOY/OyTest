// miniprogram/pages/user/feedback/feedback.js
let title="", content="";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  //获取用户输入的姓名
  titleInput:function(e){
    title = e.detail.value;
  },
  //获取用户输入的电话
  contentInput:function(e){
    content = e.detail.value;
  },

  // 提交
  submit: function (e) {
    if(title==""){
      wx.showToast({
        icon: 'none',
        title: '请输入标题',
      })
      return;
    }else if(content==""){
      wx.showToast({
        icon: 'none',
        title: '请输入内容',
      })
      return;
    }
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认提交？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          });
          wx.cloud.callFunction({
            name: 'wxFeedbackInsert',
            data: {
              title: title,
              content: content,
            },
            success: res => {
              wx.hideLoading();
              let result = res.result;
              if(result.result){
                wx.showToast({
                  title: '提交成功',
                });
                // 返回上一页
                wx.navigateBack();
              }else{
                wx.showToast({
                  title: '提交失败',
                });
              }
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '调用失败',
              })
              console.error('[云函数] [wxSubmitOrder] 调用失败：', err)
            }
          });
        }
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