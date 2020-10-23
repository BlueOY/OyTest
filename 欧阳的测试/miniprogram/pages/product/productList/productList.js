// miniprogram/pages/home/productList/productList.js
Page({

  pageIndexProduct: 0,
  pageSizeProduct: 10,
  nomoreProduct: false,

  currentClassifyId: "",

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
    currentClassifyIndex: 0,
    // 商品数据
    productData: [],
    // 没有商品数据
    noProductData: true,
    loadingProductText: "正在加载中……",
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

  toDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product?id='+id,
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
      let classifyId = that.data.classifyData[0]._id;
      // 获取商品数据
      that.queryProduct(classifyId, function(){
        that.currentClassifyId = classifyId;
      });
    });
  },

  // 点击分类事件
  clickClassify: function (e) {
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    let classifyId = e.currentTarget.dataset.id;
    this.pageIndexProduct = 0;
    this.nomoreProduct = false;
    this.setData({
      loadingProductText: "正在加载中……",
    });
    this.queryProduct(classifyId, function(){
      wx.hideLoading();
      let classifyIndex = e.currentTarget.dataset.idx;
      that.setData({
        currentClassifyIndex: classifyIndex
      });
      that.currentClassifyId = classifyId;
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
    console.log("classifyId="+classifyId);
    console.log("this.pageIndexProduct="+this.pageIndexProduct);
    console.log("this.pageSizeProduct="+this.pageSizeProduct);
    wx.cloud.callFunction({
      name: 'wxProductQuery',
      data: {
        classify: classifyId,
        pageIndex: this.pageIndexProduct,
        pageSize: this.pageSizeProduct,
      },
      success: res => {
        console.log("查询商品数据：res="+JSON.stringify(res));
        // wx.showToast({
        //   title: '调用成功',
        // })
        let data = res.result.data;
        if(!data || data=="" || data.length==0){
          this.nomoreProduct = true;
          if(this.pageIndexProduct==0){
            this.setData({
              noProductData: true,
              productData: [],
            });
          }else{
            this.setData({
              loadingProductText: "没有更多数据了",
            });
          }
        }else{
          let productData;
          if(this.pageIndexProduct==0){
            productData = data;
          }else{
            productData = this.data.productData.concat(data);
          }
          this.setData({
            productData: productData,
            noProductData: false,
          })
          if(data.length<this.pageSizeProduct){
            this.nomoreProduct = true;
            this.setData({
              loadingProductText: "没有更多数据了",
            })
          }
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
        console.error('[云函数] [wxProductQuery] 调用失败：', err)
      }
    });
  },

  // 滑动加载更多
  loadmoreProduct: function () {
    console.log("loadmoreProduct：this.nomoreProduct="+this.nomoreProduct)
    if(!this.nomoreProduct){
      // 获取订单列表数据
      this.pageIndexProduct++;
      this.queryProduct(this.currentClassifyId);
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