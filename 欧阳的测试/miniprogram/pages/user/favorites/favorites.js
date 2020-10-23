// miniprogram/pages/user/favorites/favorites.js
Page({

  pageIndex: 0,
  pageSize: 20,
  nomore: false,

  favorites: [],

  /**
   * 页面的初始数据
   */
  data: {
    // 收藏数据
    favoritesData: [],
    // 没有收藏数据
    noFavoritesData: false,
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
      url: '../../product/product?id='+id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取sroll-view的高度
    this.scrollViewHeight();
    //获取收藏商品数据
    this.initFavoritesData();
  },

  // 对数组分页
  pagination: function(pageIndex, pageSize, array) {
    var offset = pageIndex * pageSize;
    return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
  },

  //获取收藏商品数据
  initFavoritesData: function(){
    this.favorites = wx.getStorageSync("favorites");
    if(this.favorites && this.favorites instanceof Array && this.favorites.length>0){
      this.loadFavoritesData();
    }else{
      this.setData({
        noFavoritesData: true,
      });
    }
  },
  loadFavoritesData: function(){
    let idsArr = this.pagination(this.pageIndex, this.pageSize, this.favorites);
    console.log("idsArr="+JSON.stringify(idsArr));
    if(idsArr.length>0){
      wx.cloud.callFunction({
        name: 'wxProductQuery',
        data: {
          ids: idsArr
        },
        success: res => {
          // wx.showToast({
          //   title: '调用成功',
          // })
          if(res.result.data!="" && res.result.data.length>0){
            let productData = res.result.data;
            this.setData({
              favoritesData: productData,
            });
          }else{
            wx.showToast({
              icon: 'none',
              title: '数据格式错误',
            })
            console.error('数据格式错误：', res.result.data)
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
    }else{
      this.nomore = true;
      this.setData({
        loadingText: "没有更多数据了",
      });
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