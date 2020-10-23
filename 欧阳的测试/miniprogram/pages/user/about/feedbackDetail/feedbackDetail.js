// miniprogram/pages/user/about/feedbackDetail/feedbackDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedbackData: {}
  },

  // 取消
  cancel: function (e) {
    let id = this.data.feedbackData._id;
    let that = this;
    wx.showModal({
      title: '提示',
      content: "是否确定取消该反馈？",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          });
          wx.cloud.callFunction({
            name: 'wxFeedbackUpdate',
            data: {
              id: id,
              type: "cancel",
            },
            success: res => {
              wx.hideLoading();
              wx.showToast({
                title: '成功',
              });
              // 刷新界面
              that.queryFeedback(id);
              // 通知列表页刷新界面
              const eventChannel = that.getOpenerEventChannel()
              eventChannel.emit('refreshFeedbackData', {data: '取消了反馈'});
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '调用失败',
              })
              console.error('[云函数] [wxFeedbackUpdate] 调用失败：', err)
            }
          });
        }
      }
    });
  },

  // 删除
  delete: function (e) {
    let id = this.data.feedbackData._id;
    let that = this;
    wx.showModal({
      title: '提示',
      content: "是否确定删除该反馈？",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          });
          wx.cloud.callFunction({
            name: 'wxFeedbackDelete',
            data: {
              id: id,
            },
            success: res => {
              wx.hideLoading();
              wx.showToast({
                title: '成功',
              });
              // 通知列表页刷新界面
              const eventChannel = that.getOpenerEventChannel()
              eventChannel.emit('refreshFeedbackData', {data: '取消了反馈'});
              // 返回上一页
              wx.navigateBack();
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '调用失败',
              })
              console.error('[云函数] [wxFeedbackUpdate] 调用失败：', err)
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
    // 获取页面跳转参数
    let id = options.id;
    id = "8e5be7055f928eb20232e6782f23881d";
    // 查询反馈数据
    this.queryFeedback();
  },

  // 查询反馈数据
  queryFeedback: function(id){
    wx.cloud.callFunction({
      name: 'wxFeedbackQuery',
      data: {
        id: id
      },
      success: res => {
        console.log("查询反馈数据：res="+JSON.stringify(res));
        let data = res.result.data;
        if(data && data!="" && data.length>0){
          this.setData({
            feedbackData: data[0],
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: '数据格式错误',
          })
          console.error('数据格式错误：', JSON.stringify(res.result));
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '无法连接服务器',
        })
        console.error('[云函数] [wxFeedbackQuery] 调用失败：', err)
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