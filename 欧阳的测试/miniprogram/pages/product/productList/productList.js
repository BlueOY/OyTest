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
    scrollViewHeight: 0,

    // 分类数据
    classifyData: [],
    // 当前选中的分类
    currentClassify: 0,
    // 商品数据
    productData: [],
    // 没有商品数据
    noProductData: false,
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

    wx.navigateTo({
      url: '../productSearch/productSearch?searchKey=' + e.detail.value,
    })
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
    let that = this;
    // 获取sroll-view的高度
    this.scrollViewHeight();
    // 获取分类数据
    this.queryClassify(function(){
      // 获取商品数据
      that.queryProduct(that.data.classifyData[0]._id);
    });
  },

  // 点击分类事件
  clickClassify: function (e) {
    let classifyId = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    this.queryProduct(classifyId, function(){
      wx.hideLoading();
      let classifyIndex = e.currentTarget.dataset.idx;
      that.setData({
        currentClassify: classifyIndex
      });
    });
  },

  // 查询分类数据
  queryClassify: function(callback) {
    wx.cloud.callFunction({
      name: 'wxClassifyQuery',
      data: {
      },
      success: res => {
        // wx.showToast({
        //   title: '调用成功',
        // })
        this.setData({
          classifyData: res.result.data,
        })
        if(callback){
          callback();
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '无法连接服务器',
        })
        console.error('[云函数] [wxClassifyQuery] 调用失败：', err)
      }
    });
  },

  // 查询商品数据
  queryProduct: function(classifyId, callback) {
    wx.cloud.callFunction({
      name: 'wxProductQuery',
      data: {
        classify: classifyId
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