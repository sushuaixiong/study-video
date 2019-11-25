// components/process-bar/process-bar.js
let movableAreaWidth = 0;
let movableViewWidth = 0;
const backgroundAudioManager = wx.getBackgroundAudioManager();
let currentTimePre = '';
let isMoving = false;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      curTime: '00:00',
      totalTime: '00:00',
    },
    movableDis: 0,
    percent: 0,
  },

  lifetimes: {
    ready () {
      if (this.properties.isSame == true && this.data.showTime.totalTime == '00:00') {
        this._setTime();
      }
      this._getMovableNum();
      this._bindBackgroundEvent();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange (event) {
      if (event.detail.source === 'touch'){
        this.data.percent = event.detail.x / movableAreaWidth * 100;
        this.data.movableDis = event.detail.x;
        isMoving = true;
      }
    },
    onTouchend () {
      const currentTimeFmt = this._formatTime(backgroundAudioManager.currentTime);
      const duration = backgroundAudioManager.duration;
      this.setData ({
        percent: this.data.percent,
        movableDis: this.data.movableDis,
        ['showTime.curTime']: `${currentTimeFmt.min}:${currentTimeFmt.src}`
      });
      backgroundAudioManager.seek(duration * this.data.percent / 100);
      isMoving = false;
    },
    _getMovableNum() {
      const query = this.createSelectorQuery();
      query.select(".movable-area").boundingClientRect();
      query.select(".movable-view").boundingClientRect();
      query.exec((res) => {
        movableAreaWidth = res[0].width;
        movableViewWidth = res[1].width;
      } )
    },
    _bindBackgroundEvent () {
      backgroundAudioManager.onCanplay(() => {
        
        if (!typeof backgroundAudioManager.duration == undefined) {
          this._setTime();
        } else {
          setTimeout((res) => {
            this._setTime();
          }, 1000)
        }
      }),
        backgroundAudioManager.onWaiting (() => {
          console.log('onWaiting...')
        }),
        backgroundAudioManager.onPlay(() => {
          isMoving = false;
          this.triggerEvent('musicPlay');
        }),
        backgroundAudioManager.onPause(() => {
          this.triggerEvent('musicPause');
        }),
        backgroundAudioManager.onTimeUpdate(() => {
          const currentDuration = backgroundAudioManager.currentTime;
        if (!isMoving) {
        console.log('onTimeUpdate...');
          //获取当前播放时间
          const preDuration = currentDuration.toString().split('.')[0];
          if (preDuration != currentTimePre) {
            const duration = backgroundAudioManager.duration;
            const currentDurationFmt = this._formatTime(currentDuration);
            const movableDis = (movableAreaWidth - movableViewWidth) * currentDuration / duration;
            const percent = currentDuration / duration * 100;
            this.setData({
              movableDis,
              percent,
              ['showTime.curTime']: `${currentDurationFmt.min}:${currentDurationFmt.src}`,
            });
            currentTimePre = preDuration;
          }
        }
        this.triggerEvent('currentTime',{
          currentDuration
        })
        }),
        backgroundAudioManager.onStop(() => {
        console.log('onStop...')
        }),
        backgroundAudioManager.onEnded(() => {
        this.triggerEvent('musicEnd');
        }),
        backgroundAudioManager.onError(() => {
        console.log('onError...')
        })
    },
    _setTime() {
      const duration = backgroundAudioManager.duration;
      const formatTime = this._formatTime(duration);
      this.setData({
        ['showTime.totalTime']: `${formatTime.min}:${formatTime.src}`
      })
    },
    _formatTime(duration) {
      const min = Math.floor(duration / 60);
      const src = Math.floor(duration % 60);
      return {
        'min': this._parse0(min),
        'src': this._parse0(src),
      }
    },

    _parse0 (num) {
      return num < 10 ? "0"+num : num;
    }
  }
})
