// miniprogram/pages/user/orderList/orderList.js
Page({

  pageIndex: 0,
  pageSize: 5,
  nomore: false,

  /**
   * 页面的初始数据
   */
  data: {
    // 要查询的状态
    state: -1,
    // 订单列表数据
    orderListData: [],
    // 没有订单数据
    noOrderData: true,
    // 没有更多数据了
    loadingText: "正在加载中……",
    // sroll-view的高度
    scroll_height: 0,
  },

  // 获取sroll-view的高度
  scrollViewHeight: function () {
    let windowHeight = wx.getSystemInfoSync().windowHeight // 页面的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 页面的宽度

    const query = wx.createSelectorQuery() // 创建节点查询器 query
    query.select('#top').boundingClientRect()
    query.exec((res) => {
      let topHeight = res[0].height // #normalServe节点的高度
      this.setData({
        scroll_height: windowHeight - topHeight - 10
      })
    })
  },

  // 点击分类事件
  changeState: function (e) {
    let state = e.currentTarget.dataset.state;
    state = Number(state);
    this.pageIndex = 0;
    this.nomore = false;
    this.setData({
      state: state,
      loadingText: "正在加载中……",
    });
    this.loadOrderList(state);
  },

  toDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    let that = this;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id='+id,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        refreshData: function(data) {
          console.log("收到通知："+data)
          // 刷新界面
          this.pageIndex = 0;
          this.nomore = false;
          that.loadOrderList(that.data.state);
        }
      },
    })
  },

  // 点击付款
  pay: function (e) {

  },
  // 点击收货
  receipt: function (e) {
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    let that = this;
    wx.showModal({
      title: '提示',
      content: "是否确认收货“"+title+"”？",
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
              })
              // 刷新界面
              this.pageIndex = 0;
              this.nomore = false;
              that.loadOrderList(that.data.state);
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
    wx.redirectTo({
      url: '../../product/productList/productList'
    });
  },

  // 获取订单列表数据
  loadOrderList: function(state, callback){
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    wx.cloud.callFunction({
      name: 'wxOrderQuery',
      data: {
        state: state,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      },
      success: res => {
        console.log("获取订单列表：res="+JSON.stringify(res));
        console.log("pageIndex="+this.pageIndex);
        wx.hideLoading();
        let data = res.result.list;
        if(!data || data=="" || data.length==0){
          this.nomore = true;
          if(this.pageIndex==0){
            that.setData({
              noOrderData: true,
              orderListData: [],
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
          let orderListData;
          if(this.pageIndex==0){
            orderListData = data;
          }else{
            orderListData = that.data.orderListData.concat(data);
          }
          that.setData({
            orderListData: orderListData,
            noOrderData: false,
          })
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
      this.loadOrderList(this.data.state);
    }
  },

  // 下拉刷新
  // onPullDownRefresh: function(){
  //   // wx.showNavigationBarLoading() //在标题栏中显示加载
  //   console.log("下拉刷新")

  //   // 获取订单列表数据
  //   this.pageIndex = 0;
  //   this.nomore = false;
  //   this.loadOrderList(this.data.state, function(){
  //     // wx.hideNavigationBarLoading() //完成停止加载
  //     wx.stopPullDownRefresh() //停止下拉刷新
  //   });
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取sroll-view的高度
    this.scrollViewHeight();
    // 获取上一页面传来的参数
    let state = options.state;
    if(state){
      this.setData({
        state: state,
      });
    }
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
  // onPullDownRefresh: function () {

  // },

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