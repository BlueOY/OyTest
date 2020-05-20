// miniprogram/pages/product/productSearch/productSearch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品数据
    productData: [],
    // 没有商品数据
    noProductData: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let searchKey = options.searchKey;;
    this.queryProduct(searchKey);
  },

  // 查询商品数据
  queryProduct: function(searchKey) {
    wx.cloud.callFunction({
      name: 'wxProductQuery',
      data: {
        searchKey: searchKey
      },
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })

        let noProductData;
        if(res.result.data==""){
          noProductData = true;
        }else{
          noProductData = false;
        }
        this.setData({
          productData: res.result.data,
          noProductData: noProductData,
        })
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