// components/musiclist/musiclist.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array,
  },

  pageLifetimes: {
    show () {
      this.setData({
        selectId: parseInt(app.getPlayMusicId()),
      });
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectId: -1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect (event) {
      const musicId = event.currentTarget.dataset.musicid;
      const curIndex = event.currentTarget.dataset.curindex;
      this.setData({
        selectId: musicId,
      });
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${musicId}&curIndex=${curIndex}`,
      })
    }
  }
})
