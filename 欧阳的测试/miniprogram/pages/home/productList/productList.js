// miniprogram/pages/home/productList/productList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索框的参数
    inputShowed: false,
    inputVal: "",

    // scroll-view的高度
    scrollViewHeight: 0
  },

  // 搜索框的函数
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  // 获取sroll-view的高度
  scrollViewHeight: function (e) {
    // 获取页面的高度
    let windowHeight = wx.getSystemInfoSync().windowHeight

    // 然后取出搜索框的高度
    let query = wx.createSelectorQuery().in(this);
    query.select('#searchbar-box').boundingClientRect();
    // 执行上面所指定的请求，结果会按照顺序存放于一个数组中，在callback的第一个参数中返回
    query.exec((res) => {
      // 搜索框的高度
      let searchbarHeight = res[0].height;

      // 然后就是做个减法
      let scrollViewHeight = windowHeight - searchbarHeight;

      // 算出来之后存到data对象里面
      this.setData({
        scrollViewHeight: scrollViewHeight
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取sroll-view的高度
    this.scrollViewHeight();
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