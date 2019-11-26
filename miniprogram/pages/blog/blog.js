// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModalShow: false,
    blogList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取博客列表
    this._getBlogList();
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
    this.setData({
      blogList: [],
    });
    this._getBlogList(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getBlogList(this.data.blogList.length);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 发布
   */
  onPublish () {
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          //如果已经授权则查询用户信息
          wx.getUserInfo({
            success: (res) => {
              console.log(res);
              this.onGetuserinfo(res.userInfo);
            }
          })
        } else {
          //如果没有授权过，则打开登陆模态框
          this.setData({
            isModalShow: true,
          })
        }
      }
    });
    
  },

  onGetuserinfo (userInfo) {
    //跳转到发布页面
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${userInfo.nickName}&avatarUrl=${userInfo.avatarUrl}`,
    })
  },

  loginFail () {
    wx.showToast({
      title: '只有授权才可以发表评论'
    });
  },

  onGetComment (event) {
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogId=${event.target.dataset.blogId}`,
    })
  },

  _getBlogList (start = 0 ) {
    wx.showLoading({
      title: '加载中...',
    });
    wx.cloud.callFunction({
      name: 'blog',
      data:{
        start,
        count: 10,
        $url: 'list',
      }
    }).then((res) => {
      this.setData({
        blogList: this.data.blogList.concat(res.result),
      })
      wx.hideLoading();
      wx.stopPullDownRefresh();
    })
  }
})