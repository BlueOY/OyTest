// miniprogram/pages/user/favorites/favorites.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 收藏数据
    favoritesData: [],
    // 没有收藏数据
    noFavoritesData: false,
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
    //获取收藏商品数据
    this.loadFavoritesData();
  },

  //获取收藏商品数据
  loadFavoritesData: function(){
    let favorites = wx.getStorageSync("favorites");
    if(favorites && favorites instanceof Array && favorites.length>0){
      wx.cloud.callFunction({
        name: 'wxProductQuery',
        data: {
          ids: favorites
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
      this.setData({
        noFavoritesData: true,
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