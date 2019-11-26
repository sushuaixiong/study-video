// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter = require('tcb-router')
cloud.init()
const db = cloud.database();
const blogCollection = db.collection('blog');

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new tcbRouter({event});

  app.router('list', async (ctx, next) => {
    let blogList = await blogCollection.skip(event.start).limit(event.count).orderBy('currentTime', 'desc').get().then((res) => {
      return res.data;
    });
    ctx.body = blogList;
  })

  return app.serve();
}