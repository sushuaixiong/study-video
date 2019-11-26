// pages/blog-edit/blog-edit.js
//输入文字最大个数
const MAX_WORDS_NUM = 140;
//最大图片数量
const MAX_IMAGE_NUM = 9;
//初始化数据库
const db = wx.cloud.database();
//userinfo
let userInfo = {};
//内容
let content = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordNum: 0,
    footerBottom: 0,
    images: [],
    isShowSelect: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    userInfo = options;
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

  onInput (event) {
    let wordLength = event.detail.value.length;
    if (wordLength >= 140) {
      wordLength = `最大字数为${wordLength}`
    }
    this.setData({
      wordNum: wordLength,
    })
    content = event.detail.value;
  },

  onFocus (event) {
    this.setData({
      footerBottom: event.detail.height,
    });
  },

  onBlur (event) {
    this.setData({
      footerBottom: 0,
    })
  },

  onSelectPhoto () {
    let imagesSca = MAX_IMAGE_NUM - this.data.images.length;
    wx.chooseImage({
      count: imagesSca,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        });
        imagesSca = MAX_IMAGE_NUM - this.data.images.length;
          this.setData({
            isShowSelect: imagesSca <= 0 ? false : true,
          });
      },
    })
  },

  onPreview (event) {
    let current = event.target.dataset.imgSrc;
    wx.previewImage({
      current,
      urls: this.data.images,
    });
  },

  onDelete (event) {
    this.data.images.splice(event.target.dataset.index,1);
    this.setData({
      images: this.data.images
    });
    if (this.data.images.length == MAX_IMAGE_NUM -1) {
      this.setData({
        isShowSelect: true,
      });
    }
  },

  onSend () {
    //1.保存图片到云储存
    //2.保存博客到云数据库
    let promiseList = []
    let imgs = []
    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: '',
      });
      return;
    }
    wx.showLoading({
      title: '发布中...',
      mask: true,
    })
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      let promise = new Promise((resolve, reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0];
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + Math.random() * 10000000 + suffix,
          filePath: item,
          success: (res) => {
            console.log(res);
            imgs = imgs.concat(res.fileID)
            resolve();
          },
          fail: (res) => {
            console.log(res);
            reject();
          }
        });
      });
      promiseList.push(promise);
    }
    Promise.all(promiseList).then((res) => {
      db.collection('blog').add({
        data: {
          content,
          imgs, 
          ...userInfo,
          createTime: db.serverDate(),
        }
      }).then((res) => {
        wx.hideLoading();
        wx.showToast({
          title: '发布成功',
        });
        wx.navigateBack();
        //刷新
        const pages = getCurrentPages();
        const prePage = pages[pages.length - 2];
        prePage.onPullDownRefresh();
      }).catch((err) => {
        wx.hideLoading();
        wx.showToast({
          title: '发布失败',
        });
      })
    }).catch((err) => {
      wx.hideLoading();
      wx.showToast({
        title: '发布失败',
      });
    })
  }
})