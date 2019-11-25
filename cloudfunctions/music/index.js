// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcpRouter = require('tcb-router');
const RequestPromise = require('request-promise');
const BASE_URL = "http://musicapi.xiecheng.live";

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcpRouter({event});
  const db = cloud.database();
  app.router("playlist", async (ctx, next) => {
    ctx.data = {};
    const musicList = await db.collection("playlist")
    .skip(event.start).limit(event.size)
      .orderBy("createTime", "desc").get();
      ctx.body = musicList;
  });

  //获取歌单音乐列表信息
  app.router("musiclist", async (ctx, next) => {
    const musiclist = await RequestPromise(BASE_URL +`/playlist/detail?id=${event.playlistId}`).then((res) => {
      return res;
    });
    ctx.body = JSON.parse(musiclist);
  })

  //获取音乐播放
  app.router("musicUrl", async (ctx, next) => {
    console.log(event.musicId)
    const music = await RequestPromise(BASE_URL + `/song/url?id=${event.musicId}`);
    ctx.body = JSON.parse(music);
  })

  //获取音乐歌词
  app.router("lyric", async (ctx, next) => {
    const music = await RequestPromise(BASE_URL + `/lyric?id=${event.musicId}`);
    ctx.body = JSON.parse(music);
  })
  
  return app.serve();
}