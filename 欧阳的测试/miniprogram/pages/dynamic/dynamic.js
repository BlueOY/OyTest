// miniprogram/pages/dynamic/dynamic.js
Page({

  pageIndex: 0,
  pageSize: 5,
  nomore: false,

  /**
   * 页面的初始数据
   */
  data: {
    headImg: "../../images/info/user_img.jpg",
    name: "商户名称",

    // 动态列表数据
    dynamicList: [],
    // 没有动态数据
    noData: true,
    // 没有更多数据了
    loadingText: "正在加载中……",
    // sroll-view的高度
    scroll_height: 0,
  },

  // 获取sroll-view的高度
  scrollViewHeight: function () {
    let windowHeight = wx.getSystemInfoSync().windowHeight // 页面的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 页面的宽度

    this.setData({
      scroll_height: windowHeight
    })
  },

  toProduct: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product/product?id='+id,
    })
  },

  toLink: function (e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../static/webView/webView?url='+url,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    // 获取sroll-view的高度
    this.scrollViewHeight();
    // 查询商户信息
    this.getInfo(function(){
      // 获取订单列表数据
      that.loadDynamicList(function(){
        wx.hideLoading();
      });
    });
  },

  // 查询商户信息
  getInfo: function (callback) {
    wx.cloud.callFunction({
      name: 'sysBusinessQuery',
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })
        console.log('查询商户信息：', JSON.stringify(res));
        let info = res.result.data[0];
        this.setData({
          headImg: info.headImg,
          name: info.name,
        });
        if(callback){
          callback();
        }
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

  // 获取动态列表数据
  loadDynamicList: function(callback){
    let that = this;
    wx.cloud.callFunction({
      name: 'wxDynamicQuery',
      data: {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      },
      success: res => {
        console.log('查询动态信息：', JSON.stringify(res));
        let data = res.result.list;
        if(!data || data=="" || data.length==0){
          this.nomore = true;
          if(this.pageIndex==0){
            that.setData({
              noData: true,
              dynamicList: [],
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
          let dynamicList;
          if(this.pageIndex==0){
            dynamicList = data;
          }else{
            dynamicList = that.data.dynamicList.concat(data);
          }
          that.setData({
            dynamicList: dynamicList,
            noData: false,
          })
        }
        if(callback){
          callback();
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

  // 滑动加载更多
  loadmore: function () {
    if(!this.nomore){
      // 获取订单列表数据
      this.pageIndex++;
      this.loadDynamicList();
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