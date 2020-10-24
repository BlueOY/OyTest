// miniprogram/pages/product/product.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // content的高度
    contentHeight: 0,
    // 商品数据
    productData: {},
    // 是否已收藏
    favoritesFlag: false,
  },

  // 获取content的高度
  contentHeight: function () {
    let windowHeight = wx.getSystemInfoSync().windowHeight; // 页面的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth; // 页面的宽度

    const query = wx.createSelectorQuery(); // 创建节点查询器 query
    query.select('#foot').boundingClientRect();
    query.exec((res) => {
      let footHeight = res[0].height // #normalServe节点的高度
      this.setData({
        contentHeight: windowHeight - footHeight
      });

      console.log("windowHeight="+windowHeight)
      console.log("footHeight="+footHeight)
    })
  },

  addFavorites: function (e) {
    let product = this.data.productData;
    let favorites = wx.getStorageSync("favorites");
    if(!this.data.favoritesFlag){
      try{
        if(favorites && favorites instanceof Array){
          favorites.push(product._id);
        }else{
          favorites = [product._id];
        }
        wx.setStorageSync("favorites", favorites);
        wx.showToast({
          title: '收藏成功',
        });
        this.setData({
          favoritesFlag: true,
        });
      }catch(e){
        console.error(e);
        wx.showToast({
          icon: 'none',
          title: e.message,
        });
      }
    }else{
      try{
        if(favorites && favorites instanceof Array){
          let idx = favorites.indexOf(product._id);
          favorites.remove(idx);
        }
        wx.setStorageSync("favorites", favorites);
        wx.showToast({
          title: '取消收藏',
        });
        this.setData({
          favoritesFlag: false,
        });
      }catch(e){
        console.error(e);
        wx.showToast({
          icon: 'none',
          title: e.message,
        })
      }
    }
    
  },

  addCart: function (e) {
    let product = this.data.productData;
    let cart = wx.getStorageSync("cart");
    try{
      if(cart && cart instanceof Array){
        let temp = cart.find(item => {
          return item._id == product._id;
        });
        if(!temp){
          product.num = 1;
          product.checks = true;
          cart.push(product);
        }else{
          if(temp.num){
            temp.num++
          }else{
            temp.num = 1;
          }
        }
      }else{
        product.num = 1;
        product.checks = true;
        cart = [product];
      }
      wx.setStorageSync("cart", cart);
      wx.showToast({
        title: '添加成功',
      })
    }catch(e){
      console.error(e);
      wx.showToast({
        icon: 'none',
        title: '添加失败',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取content的高度
    this.contentHeight();
    // 获取页面跳转参数
    let id = options.id;
    if(!id){
      id = "e373396c5f92eaf301dddadc5008dcb9";
    }
    // 查询商品数据
    this.queryProduct(id);
  },

  // 查询商品数据
  queryProduct: function(id) {
    wx.showLoading({
      title: '加载中',
    });
    wx.cloud.callFunction({
      name: 'wxProductQuery',
      data: {
        id: id
      },
      success: res => {
        wx.hideLoading();
        // wx.showToast({
        //   title: '调用成功',
        // })

        if(res.result.data!="" && res.result.data.length>0){
          let productData = res.result.data[0];
          this.setData({
            productData: productData,
          });
          // 判断是否已收藏
          let favorites = wx.getStorageSync("favorites");
          try{
            if(favorites && favorites instanceof Array){
              if(favorites.includes(productData._id)){
                this.setData({
                  favoritesFlag: true,
                });
              }
            }
          }catch(e){
            console.error(e);
            wx.showToast({
              icon: 'none',
              title: e.message,
            })
          }
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