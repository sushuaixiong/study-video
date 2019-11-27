// components/blog-ctrl/blog-ctrl.js
let userInfo = {};
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
  },
  externalClasses: ['iconfont', 'icon-fenxiang', 'icon-pinglun_huabanfuben'],

  /**
   * 组件的初始数据
   */
  data: {
    isModalShow: false,
    isCommondModalShow: false,
    content: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment () {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                //如果有授权，则获取用户信息，并且打开底部弹出框
                userInfo = res.userInfo;
                this.setData({
                  isCommondModalShow: true
                })
              }
            })
          } else {
            //如果没有授权，则打开login组件
            this.setData({
              isModalShow: true,
            })
          }
        }
      })
    },

    onLoginSuccess (event) {
      userInfo = event.detail;
      this.setData({
        isModalShow: false,
      },() => {
        this.setData({
          isCommondModalShow: true
        })
      })
    },

    onLoginFail (event) {
      wx.showModal({
        title: '评论需要用户授权',
        content: '',
      })
    },

    onInput (event) {
      this.setData({
        content: event.detail.value,
      })
    },

    toComment (event) {
      //保持评论到数据库
      const formId = event.detail.formId;
      const content = event.detail.value.content;
      if (content.trim() == '') {
        wx.showModal({
          title: '请输入评论内容',
          content: '',
        });
        return;
      }
      wx.showLoading({
        title: '评论中...',
        mask: true,
      })
    db.collection('blog-comment').add({
      data: {
        content,
        createTime: db.serverDate(),
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        blogId: this.properties.blogId,
      }
    }).then((res) => {
      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
      })
      this.setData({
        isCommondModalShow: false,
        content: '',
      })
      //发送推送模板消息
      wx.cloud.callFunction({
        name: 'sendMsg',
        data: {
          content,
          formId,
          blogId: this.properties.blogId,
          createTime: db.serverDate()
        }
      })
    }).catch((err) => {
      console.log(err)
      wx.showToast({
        title: '发布失败',
        icon: 'none',
      })
    })
    },
  }
})
