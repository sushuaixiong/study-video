// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModalShow: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetuserinfo (event) {
      //如果授权成功则将userInfo传给父组件，跳转到发布页面
      const userinfo = event.detail.userInfo;
      if (userinfo){
        this.setData({
          isModalShow: false,
        })
        this.triggerEvent('loginSuccess', userinfo);
      } else {
        this.triggerEvent('loginFail')
      }
    }
  }
})
