// miniprogram/pages/user/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 订单数据
    orderData: {},
    // 订单商品数据
    orderProductData: [],
  },

  // 点击付款
  pay: function (e) {

  },
  // 取消订单
  cancel: function (e) {
    let id = this.data.orderData._id;
    let that = this;
    wx.showModal({
      title: '提示',
      content: "是否确定取消订单？",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          });
          wx.cloud.callFunction({
            name: 'wxOrderUpdate',
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
              that.queryOrder(id);
              // 通知列表页刷新界面
              const eventChannel = that.getOpenerEventChannel()
              eventChannel.emit('refreshData', {data: '取消订单了'});
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '调用失败',
              })
              console.error('[云函数] [wxOrderUpdate] 调用失败：', err)
            }
          });
        }
      }
    });
  },
  // 点击收货
  receipt: function (e) {
    let id = this.data.orderData._id;
    let that = this;
    wx.showModal({
      title: '提示',
      content: "是否确认收货？",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          });
          wx.cloud.callFunction({
            name: 'wxOrderUpdate',
            data: {
              id: id,
              type: "receipt",
            },
            success: res => {
              wx.hideLoading();
              wx.showToast({
                title: '成功',
              });
              // 刷新界面
              that.queryOrder(id);
              // 通知列表页刷新界面
              const eventChannel = that.getOpenerEventChannel()
              eventChannel.emit('refreshData', {data: '确认收货了'});
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '调用失败',
              })
              console.error('[云函数] [wxOrderUpdate] 调用失败：', err)
            }
          });
        }
      }
    });
  },
  // 点击再来一单
  buy: function (e) {
    // wx.navigateTo({
    //   url: '../../product/productList/productList',
    // });
    wx.redirectTo({
      url: '../../product/productList/productList'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面跳转参数
    let id = options.id;
    // 查询订单数据
    this.queryOrder(id);
  },

  // 查询订单数据
  queryOrder: function(id) {
    wx.cloud.callFunction({
      name: 'wxOrderQuery',
      data: {
        id: id
      },
      success: res => {
        let data = res.result.list;
        if(data && data!="" && data.length>0){
          this.setData({
            orderData: data[0],
            orderProductData: data[0].productList,
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
        console.error('[云函数] [wxOrderQuery] 调用失败：', err)
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