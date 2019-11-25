// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
const url = "http://musicapi.xiecheng.live/personalized";

cloud.init()
const db = cloud.database();
const playlistCollection = db.collection("playlist");
const MAX_SIZE = 100;
// 云函数入口函数
exports.main = async (event, context) => {
  // 获取数据库中数据
  let list = {
    data: []
  };
  //获取playlist collection 长度
  const listcount = await playlistCollection.count();
  const total = listcount.total;
  //查询次数
  const queryCount = total / MAX_SIZE;
  const all = [];
  for(let i=0; i < queryCount; i++) {
    let promise =  playlistCollection.skip(i * MAX_SIZE).limit(MAX_SIZE).get();
    all.push(promise);
  }
  if (all.length > 0 ) {
    list = (await Promise.all(all)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
      }
    })
  }
  console.log(list)
  //调用接口获取列表信息
  let playlist = await rp(url).then((res) => {
    return JSON.parse(res).result;
  });
  //将调用的数据与数据库数据去重
  const newData = [];
  for(let i=0, lens = playlist.length; i < lens; i++) {
    let flag = true;
    for (let j=0, listlens = list.data.length; j < listlens; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false;
        break
      }
    }
    if(flag) {
      newData.push(playlist[i]);
    }
  }
  //将获取到的数据保存到云数据库
  for (let i = 0, lens = newData.length; i < lens; i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then((res) => {
      console.log(res);
      console.log("保存成功");
    }).catch((err) => {
      console.error(err);
      console.log("失败");
    })
  }
  return newData.length;
}