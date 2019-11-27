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
    let w = {}
    if (event.keyword.trim() != '') {
      w = {
        content: db.RegExp({
          regexp: event.keyword,
          options: 'i'
        })
      }
    }
    let blogList = await blogCollection.where(w).skip(event.start).limit(event.count).orderBy('currentTime', 'desc').get().then((res) => {
      return res.data;
    });
    ctx.body = blogList;
  })

  app.router('detail',async (ctx,next) => {
    
  })

  return app.serve();
}