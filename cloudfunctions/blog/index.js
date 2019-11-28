// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter = require('tcb-router')
cloud.init()
const db = cloud.database();
const blogCollection = db.collection('blog');
const commentCollection = db.collection('blog-comment');
const MAX_LIMIT = 100;

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
    //1.获取博客的基本信息
    const detail = await blogCollection.where({
      _id: event.blogId
    }).get().then((res) => {
      return res.data;
    });
    let commentList = {
      data: []
    }
    let promiseList = [];
    //2.获取评论信息
      //1.获取评论总数
    const commentCount = await commentCollection.count();
    const total = commentCount.total;
      //2.获取查询总数
    const querySize = Math.ceil(total / MAX_LIMIT);
    for (let i = 0; i < querySize; i++) {
      let promiseComment = commentCollection.where({
        blogId: event.blogId,
      }).skip(MAX_LIMIT * i).limit(MAX_LIMIT).orderBy('createTime','desc').get();
      promiseList.push(promiseComment)
    }
    if (promiseList.length > 0) {
      commentList = (await Promise.all(promiseList)).reduce((acc,cur) => {
        return {
          data: acc.data.concat(cur.data)
        }
      })
    }
    //3.返回结果
    ctx.body = {
      detail,
      commentList,
    }
  })

  return app.serve();
}