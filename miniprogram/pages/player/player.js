// pages/player/player.js
let musiclist = [];
let currentIndex = 0;
//获得音频对象
const backgroundAudioManager = wx.getBackgroundAudioManager(); 
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    isLyricShowing: false,
    lyric: '',
    isSame: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    currentIndex =  options.curIndex;
    const musicId = options.musicId;
    musiclist = wx.getStorageSync("musiclist");
    this._getMusicUrl(musicId);
  },

  //获取音乐播放url
  _getMusicUrl (musicId) {
    if (musicId == app.getPlayMusicId()){
      this.setData({
        isSame: true,
      });
    } else {
      this.setData({
        isSame: false,
      });
    }
    if (!this.data.isSame) {
      backgroundAudioManager.stop();
    }
    wx.showLoading({
      title: '加载中...',
    })
    //获取音乐信息
    const music = musiclist[currentIndex];
    //将title改变
    wx.setNavigationBarTitle({
      title: music.name,
    });
    console.log(music);
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false,
    });
    wx.cloud.callFunction({
      "name": "music",
      "data": {
        musicId,
        $url: "musicUrl",
      }
    }).then((res) => {
      const resdata = res.result.data[0];
      if (resdata.url == null) {
        wx.showToast({
          title: '无播放权限'
        });
        return;
      }
      if (!this.data.isSame) {
        backgroundAudioManager.src = resdata.url;
        backgroundAudioManager.title = music.name;
        backgroundAudioManager.epname = music.al.name;
        backgroundAudioManager.singer = music.ar[0].name;
        backgroundAudioManager.coverImgUrl = music.al.picUrl;
      }
      this.setData({
        isPlaying: true
      });
      wx.hideLoading();
      app.setPlayMusicId(musicId);
      //获取歌词
      wx.cloud.callFunction({
        "name": "music",
        "data": {
          musicId,
          $url: "lyric",
        }
      }).then((res) => {
        let lyric = "暂无歌词";
        console.log(res)
        let lrc = res.result.lrc;
        if (lrc) {
          lyric = lrc.lyric;
        }
        this.setData({
          lyric,
        })
      })
    });
  },

  togglePlaying () {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause();
    }else {
      backgroundAudioManager.play();
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  onPrev () {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = musiclist.length - 1;
    }
    const music = musiclist[currentIndex]
    this._getMusicUrl(music.id);
  },

  onNext() {
    currentIndex++;
    if (currentIndex === musiclist.length) {
      currentIndex = 0;
    }
    const music = musiclist[currentIndex]
    this._getMusicUrl(music.id);
  },

  update (event) {
    this.selectComponent('.lyric').update(event.detail.currentDuration);
  },

  musicPlay () {
    this.setData({
      isPlaying: true,
    });
  },

  musicPause () {
    this.setData({
      isPlaying: false,
    });
  },

  doIsLyricShowing () {
    this.setData({
      isLyricShowing: !this.data.isLyricShowing,
    })
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

  }
})