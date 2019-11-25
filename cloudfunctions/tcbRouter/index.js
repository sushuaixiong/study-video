// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcpRouter = require('tcb-router')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(1001)
 const app = new TcpRouter({event});
//全局中间件
 app.use(async (ctx, next) => {
   ctx.data = {};
   ctx.data.openId = event.userInfo.openId;
   await next();
 });
 app.router("music", async (ctx, next) => {
   console.log("music start")
   ctx.data.musicName = "七里香";
   await next();
 }, async (ctx, next) => {
   ctx.data.type = "流行";
   ctx.body = {
     data: ctx.data,
   }
 });
 app.router("movie", async (ctx, next) => {
   ctx.data.movieName = "千与千寻";
   await next();
 }, async (ctx, next) => {
   ctx.data.type = "动漫";
   ctx.body = {
     data: ctx.data,
   }
 })
 return app.serve();
}