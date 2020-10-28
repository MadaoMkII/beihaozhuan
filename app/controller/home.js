'use strict';
const Controller = require('./baseController');
const moment = require('moment');
class HomeController extends Controller {
  async testX(ctx) {
    try {
      // const momentDate = moment('2020-09-25 00:00:00');
      // console.log(momentDate.toDate());
      // const result = await ctx.model.UserAccount.find({ created_at: { $gte: momentDate.toDate() } }, { tel_number: 1, nickName: 1 });
      // console.log(result);
      // const gameProcessResult = await ctx.model.GameProcess.find({ status: '进行中' });
      // const finalResult = [];
      // for (const element of result) {
      //   if (!gameProcessResult.find(e => e.tel_number === element.tel_number)) {
      //     finalResult.push({ tel_number: element.tel_number, nickName: element.nickName });
      //   }
      // }
      // const result = await ctx.model.GameProcess.find({ currentIncoming: { $gte: 0 } });
      // console.log(result);
      // let totalAmount = 0;
      // for (const element of result) {
      //   totalAmount += element.currentIncoming;
      // }
      // const wo = await this.ctx.model.UserAccount.findOne({ tel_number: '15620304097' });
      // const ding = await this.ctx.model.UserAccount.findOneAndUpdate({ nickName: '着哩' }, { $set: { referrer: wo._id } });
      // await this.ctx.model.UserAccount.updateOne({ nickName: '刘炜' }, { $set: { referrer: ding._id } });

      const refUserID = this.ctx.user.referrer;
      if (refUserID) {
        const user_B = await this.ctx.model.UserAccount.findOne({ _id: refUserID }, { tel_number: 1, referrer: 1 });
        if (user_B && user_B.referrer) {
          const user_C = await this.ctx.model.UserAccount.findOne({ _id: user_B.referrer }, { tel_number: 1, uuid: 1 });
          console.log(user_C);
          const hide1Process = await this.ctx.model.GameProcess.findOne({
            tel_number: user_C.tel_number,
            category: 'HIDE1',
          });
          const limitNumber = 5;
          const reward = 1151;
          console.log(hide1Process);
          if (hide1Process && hide1Process.currentIncoming >= limitNumber - 1) {
            await this.ctx.service.userService.modifyUserRcoin({
              tel_number: user_C.tel_number,
              amount: Number(reward),
              content: '活动奖励-邀请用户完成活动2',
              type: '活动',
            });
            await this.ctx.model.GameProcess.deleteOne({
              tel_number: user_C.tel_number,
              category: 'HIDE1' });
          } else {
            await this.ctx.model.GameProcess.updateOne({
              tel_number: user_C.tel_number,
              category: 'HIDE1',
            }, {
              $set: {
                status: '其他',
                content: [],
                requiredIncoming: 5,
              },
              $inc: { currentIncoming: 1 } }, { upsert: true });
          }
        }

      }
      // ctx.throw(500, '测试日志');
      // await this.service.autoBackUpService.dbAutoBackUp();
      this.success();
    } catch (e) {
      console.log(e);
      this.failure(e);
    }

  }
  async test(ctx) {
    const x = this.app.decrypt('a69ded101126994c7eab1e20d7883159');
    const y = this.app.encrypt(900000);
    console.log(y);
    this.success(x);
  }
  // let requestObj_1 = {
  //     appid: ctx.app.config.wechatConfig.appid,
  //     secret: ctx.app.config.wechatConfig.secret,
  //     grant_type: `client_credential`
  // };
  //
  // let [result_1,] = await this.requestMethod(requestObj_1,
  //     `GET`, `https://api.weixin.qq.com/cgi-bin/token`);
  //
  // if (!ctx.helper.isEmpty(result_1[`errcode`])) {
  //     ctx.throw(400, result_1.errmsg)
  // }

  // '26_EpDz1uSWyf3ZQPW2ZCmN49rx8RlPXSA6z_e8NKSHGbUFCbiJWJFDWvfSLKKIg8FCkz2_XEuxNoEsRgPhy0SEeQU60H2kuceAXVjOHjgzSGGd7PrW9vh5OqwgPaq7AoiYpOB9Wpsd0og6UdMoFDGdAIAYWZ'
  // let requestObj_2 = {
  //     access_token: result_1.access_token,
  //     type: "jsapi"
  // };
  // let [result_2,] = await this.requestMethod(requestObj_2,
  //     `GET`, `https://api.weixin.qq.com/cgi-bin/ticket/getticket`);

  //
  // const ticket = 'kgt8ON7yVITDhtdwci0qeTSKjv5Yawv79kzzTIzVlZ0EosIl7SrkqevFvjlR1ozpwctDbXZQ_sR-PqMXDyS8mA';
  // const randomStr = ctx.randomString(16);
  // const url = 'https://www.beihaozhuan.com/index/ad?source=full&uuid=ADVck15314cx0003laa383n2grq6';
  // const timeStamp = new Date().getTime();
  // const signStr = `jsapi_ticket=${ticket}&noncestr=${randomStr}&timestamp=${timeStamp}&url=${url}`;
  // console.log(signStr);
  // const crypto = require('crypto'),
  //   shaSum = crypto.createHash('sha1');
  // shaSum.update(signStr);
  // const result = shaSum.digest('hex');
  // console.log(result);
  // this.success({
  //   appId: ctx.app.config.wechatConfig.appid,
  //   timeStamp,
  //   nonceStr: randomStr,
  //   signature: result,
  // });
  // ctx.logger.debug('debug info');
  // ctx.logger.info('some request data: %j', ctx.request.body);
  // ctx.logger.warn('WARNNING!!!!');


  // let x = ctx.sleep(3000);
  // await this.success()
  // await x;
  // Promise.all([x]).catch();
  // console.log(123123131312313)
  // throw new Error(`不要`);
  // ctx.throw(401,`不要嗑瓜子!@`)
  // this.app.logger.warn(`我感觉很难受`, ctx);
  // let app = ctx.app
  // this.ctx.app.getLogger('errorLogger').set('remote', new RemoteErrorTransport({level: 'info', app}));
  // console.log(this.ctx.app.getLogger('errorLogger'))


  //
  // async main() {
  //     this.ctx.redirect('back', '/index.html');
  // };
  //
  //
  //


  // async getUserInfo() {
  //     console.log(this.ctx.isAuthenticated())
  //     return this.ctx.body = this.ctx.session.abcv;
  //
  // };

  async getImg(ctx) {

    const svgCaptcha = require('svg-captcha');
    const captcha = svgCaptcha.create();
    ctx.session.captcha = captcha.text;
    ctx.set('Content-Type', 'image/svg+xml');
    ctx.status = 200;
    ctx.body = captcha.data;
  }


}

module.exports = HomeController;

