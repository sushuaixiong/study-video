// pages/demo/demo.js
import regeneratorRuntime from '../../utils/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    arr: ['js', 'json', 'wxml', 'wxss'],
    arrObj: [{
      id: '1',
      name: 'js'
    },
      {
        id: '2',
        name: 'json'
      },
      {
        id: '3',
        name: 'wxml'
      },
      {
        id: '4',
        name: 'wxss'
      }],
  },

  sortArr() {
    let arrLength = this.data.arr.length;
    for (let i = 0; i <arrLength; i++) {
      let x = Math.floor(Math.random() * arrLength);
      let y = Math.floor(Math.random() * arrLength);
      let tmp = this.data.arr[x];
      this.data.arr[x] = this.data.arr[y];
      this.data.arr[y] = tmp;
    }
    this.setData({
      arr: this.data.arr
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var a = 5;
    for(let i=0; i<5; i++){
      // console.log(i)
    }
    const object = {}
    let b = 1;
    const username = "seth";
    const user = {
      username,
      age: 33,
    };
    // wx.cloud.callFunction({
    //   "name": "login"
    // }).then((res) => {
    //   console.log(res)
    //   this.setData({
    //     openid: res.result.openid
    //   })
    // });
    // setTimeout(() => {
    //   console.log(1);
    // },1000)
    // new Promise ((resolve,reject) => {
    //   setTimeout (() => {
    //     console.log(1);
    //     resolve();
    //   },1000)
    // }).then ((res) => {
    //   setTimeout(() => {
    //     console.log(2);
    //   }, 2000);
    // });
    // let p1 = new Promise((resolve,reject) => {
    //   setTimeout(() => {
    //     console.log(1);
    //     resolve(1);
    //   },1000);
    // });
    // let p2 = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     console.log(2);
    //     resolve(2);
    //   }, 2000);
    // });
    // let p3 = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     console.log(3);
    //     resolve(3);
    //   }, 3000);
    // });
    // Promise.all([p1,p2,p3]).then((res) => {
    //   console.log("完成")
    //   console.log(res)
    // }).catch((err) => {
    //   console.log("失败")
    //   console.log(err)
    // });
    // Promise.race([p1,p2,p3]).then((res) => {
    //   console.log("完成");
    //   console.log(res);
    // }).catch((res) => {
    //   console.log("失败");
    //   console.log(res);
    // });
  this.foo ();
  },

 async foo () {
    console.log(1);
   let a = await this.setTime();
    console.log(a);
  },

setTime () {
    return new Promise ((resolve,reject) => {
      setTimeout(() => {
        console.log(2);
        resolve("2");
      },1000)
    })  
  },

  getMusic () {
    wx.cloud.callFunction({
      "name": "tcbRouter",
      "data": {
        $url: "music"
      }
    }).then((res) => {
      console.log(res);
    })
  },

  getMovie () {
    wx.cloud.callFunction({
      "name": "tcbRouter",
      "data": {
        $url: "movie",
      }
    }).then((res) => {
      console.log(res);
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

  },
  onGetUserInfo (event) {
    console.log(event)
  }
})