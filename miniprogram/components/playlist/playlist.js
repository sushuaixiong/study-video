// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    }
  },

  observers: {
    ['playlist.playCount'](count) {
      // console.log(count);
      let obCount = this._transerNum(count, 3);
      // console.log(obCount);
      this.setData({
        _count: obCount,
      });
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _transerNum(num, point) {
      let numStr = num.toString().split(".")[0];
      let numStrLength = numStr.length;
      if (numStrLength < 6) {
        return num;
      } else if (numStrLength >= 6 && numStrLength <= 8) {
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point);
        return parseFloat(parseInt(numStr / 10000) + "." + decimal) + "万";
      } else if (numStrLength > 8) {
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
        return parseFloat(parseInt(numStr / 10000000) + "." + decimal) + "亿";
      }
    },
    toMusiclist() {
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
      })
    },
  }
})
