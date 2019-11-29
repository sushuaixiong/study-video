// pages/blog-comment/blog-comment.js
import fomartDate from '../../utils/fomartDate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentList: [],
    blogId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      blogId: options.blogId,
    })
   this._getLoadingDetail();
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
  onShareAppMessage: function (event) {
    return {
      title: this.data.blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${this.data.blog._id}`
    }
  },

  _getLoadingDetail () {
    wx.showToast({
      title: '加载中...',
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'detail',
        blogId: this.data.blogId,
      }
    }).then((res) => {
      wx.hideLoading();
      let commentList =  res.result.commentList.data;
      for (let i = 0, len = commentList.length; i < len; i++) {
        commentList[i].createTime = fomartDate(new Date(commentList[i].createTime));
      }
      this.setData({
        commentList,
        blog: res.result.detail[0],
      })
    })
  }
})