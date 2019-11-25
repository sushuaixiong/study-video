// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModalShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  }
})