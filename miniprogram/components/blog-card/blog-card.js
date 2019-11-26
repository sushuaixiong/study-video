// components/blog-card/blog-card.js
import fomartDate from '../../utils/fomartDate'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },

  observers:{
    ['blog.createTime'] (val) {
      this.setData({
        _createTime: fomartDate(new Date(val)),
      });
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreview (event) {
      wx.previewImage({
        urls: this.properties.blog.imgs,
        current: event.target.dataset.imgSrc,
      })
    }
  }
})
