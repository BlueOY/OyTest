// miniprogram/pages/user/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 要查询的状态
    state: -1,
    // 订单列表数据
    orderListData: [],
    // 没有订单数据
    noOrderData: false,
  },

  // 点击分类事件
  changeState: function (e) {
    let state = e.currentTarget.dataset.state;
    state = Number(state);
    this.loadOrderList(state);
    this.setData({
      state: state
    });
  },

  toDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id='+id,
    })
  },

  // 获取订单列表数据
  loadOrderList: function(state){
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    wx.cloud.callFunction({
      name: 'wxOrderQuery',
      data: {
        state: state
      },
      success: res => {
        wx.hideLoading();
        console.log("res.result="+JSON.stringify(res.result));
        let data = res.result.list;
        if(!data || data=="" || data.length==0){
          that.setData({
            noOrderData: true,
            orderListData: [],
          })
        }else{
          that.setData({
            orderListData: data,
            noOrderData: false,
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '无法连接服务器',
        })
        console.error('[云函数] [wxOrderQuery] 调用失败：', err)
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取订单列表数据
    this.loadOrderList(this.data.state);
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