// components/lyric/lyric.js
let lyricHeight = 0 ;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShowing: {
      type: Boolean,
      value: false,
    },
    lyric: String
  },

  observers: {
    lyric (lyric) {
      if (lyric == '暂无歌词') {
        this.setData({
          lyricList: [{
            time: 0,
            lrc: lyric,
          }],
          nowListIndex: -1,
        });
      }else {
        this._lyricList(lyric);
      }
    }
  },

  lifetimes: {
    ready () {
      wx.getSystemInfo({
        success(res){
          console.log(res)
          lyricHeight = res.screenWidth / 750 * 64;
        }
      });
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lyricList: [],
    nowListIndex: 0,
    scrollTop: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    update(currentDuration) {
      let lyricLists = this.data.lyricList;
      if (lyricLists.length == 0) {
        return;
      }
      //如果歌词最后的时间
      if (currentDuration > lyricLists[lyricLists.length - 1].time) {
        if (this.data.nowListIndex != -1) {
          this.setData({
            nowListIndex: -1,
            scrollTop: lyricLists.length * lyricHeight,
          });
        }
        return;
      }
      for (let i = 0, lens = lyricLists.length; i < lens; i++) {
        if (currentDuration <= lyricLists[i].time) {
          this.setData({
            nowListIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight,
          });
          break;
        }
      }
    },
    _lyricList(lyric) {
      let lyricList = [];
      let lrcs = lyric.split('\n');
      lrcs.forEach((item) => {
        let itemTime = item.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g);
        if (itemTime != null) {
          let time = itemTime[0].match(/(\d{2,3}):(\d{2})(?:\.(\d{2,3}))?/);
          const items = item.split(itemTime[0]);
          let time2Sec = parseInt(time[1]) * 60 + parseInt(time[2]) + parseInt(time[3]) / 1000;
          lyricList.push({
            time: time2Sec,
            lrc: items[1],
          });
        }
      });
      this.setData({
        lyricList,
      })
    }
  }
})
