'use strict';
const Controller = require('./baseController');
const moment = require('moment');
class HomeController extends Controller {
  async testX(ctx) {
    try {

      // const settings = await ctx.model.GameEvent.find({}, { category: 1, expectEarning: 1 });
      //
      // for (const setting of settings) {
      //   await ctx.model.GameProcess.updateMany({ status: '进行中',
      //     category: setting.category }, {
      //     $set: { requiredIncoming: Number(setting.expectEarning) },
      //   });
      //
      // }
      await this.ctx.model.UserAccount.updateMany({}, { $set: { source: '平台', platform: 'H5网页' } });
      // await ctx.model.GameProcess.updateMany({ status: '进行中',
      //   $expr: { $gte: [ '$currentIncoming', '$requiredIncoming' ] } }, {
      //   $set: { status: '已完成' },
      // });
      // const result = await ctx.model.GameProcess.find({ tel_number: '18630920818' }, { status: 1, category: 1, requiredIncoming: 1, tel_number: 1, currentIncoming: 1 });
      // console.log(result);
      // const OPENID = 'odLFQwBPj42OaGWQm43pxRShkbTg';
      // const x = await this.ctx.service.wechatService.sendMessageCard('无敌',
      //   'ckf8l9trp0001t8oxduv595qg', 'STEP1', '第一步试玩游戏', '通过', OPENID);
      // await ctx.service.excelService.exportList_downloadOverview();
      // const user = await this.ctx.model.UserAccount.findOne({ tel_number: '13602012967' });
      // await ctx.service.analyzeLogService.recordPersonalBcoinChange(user, 1090);
      // const setting = await this.ctx.model.SystemSetting.findOne({}, {}, { sort: { created_at: -1 } });
      // if (!this.app.isEmpty(setting.gameEventReward)) {
      //   const settingObj = setting.gameEventReward.find(element => { return String(element.category) === 'STEP2'; });
      //   await this.ctx.service.gameEventService.checkShareReward(user, settingObj);
      // }
      // // ctx.throw(500, '测试日志');
      // // await this.service.autoBackUpService.dbAutoBackUp();
      // const fileName = await ctx.service.excelService.getUserInfoExecl(condition.day);
      // ctx.status = 200;
      // await ctx.downloader(fileName);
      // await fs.unlinkSync(fileName);
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

