// miniprogram/pages/user/about/feedbackList/feedbackList.js
Page({

  pageIndex: 0,
  pageSize: 5,
  nomore: false,

  /**
   * 页面的初始数据
   */
  data: {
    // 反馈列表数据
    feedbackListData: [],
    // 没有反馈数据
    noFeedbackData: false,
    // 没有更多数据了
    loadingText: "正在加载中……",
  },

  // 获取sroll-view的高度
  scrollViewHeight: function () {
    let windowHeight = wx.getSystemInfoSync().windowHeight // 页面的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 页面的宽度
    this.setData({
      scroll_height: windowHeight
    })
  },

  toDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    let that = this;
    wx.navigateTo({
      url: '../feedbackDetail/feedbackDetail?id='+id,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        refreshFeedbackData: function(data) {
          console.log("收到通知："+data)
          // 刷新界面
          this.pageIndex = 0;
          this.nomore = false;
          that.loadFeedbackList();
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取sroll-view的高度
    this.scrollViewHeight();
    // 获取反馈列表数据
    this.loadFeedbackList();
  },

  // 获取反馈列表数据
  loadFeedbackList: function(callback){
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    wx.cloud.callFunction({
      name: 'wxFeedbackQuery',
      data: {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      },
      success: res => {
        console.log("获取反馈列表数据：res="+JSON.stringify(res));
        wx.hideLoading();
        let data = res.result.data;
        if(!data || data=="" || data.length==0){
          this.nomore = true;
          if(this.pageIndex==0){
            that.setData({
              noFeedbackData: true,
              feedbackListData: [],
            });
          }else{
            // wx.showToast({
            //   title: '没有更多数据了',
            // });
            that.setData({
              loadingText: "没有更多数据了",
            })
          }
        }else{
          let feedbackListData;
          if(this.pageIndex==0){
            feedbackListData = data;
          }else{
            feedbackListData = that.data.feedbackListData.concat(data);
          }
          that.setData({
            feedbackListData: feedbackListData,
            noFeedbackData: false,
          });
          if(data.length<this.pageSize){
            this.nomore = true;
            that.setData({
              loadingText: "没有更多数据了",
            })
          }
        }
        if(callback){
          callback();
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '无法连接服务器',
        })
        console.error('[云函数] [wxOrderQuery] 调用失败：', err)
      }
    });
  },

  // 滑动加载更多
  loadmore: function () {
    if(!this.nomore){
      // 获取订单列表数据
      this.pageIndex++;
      this.loadFeedbackList();
    }
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