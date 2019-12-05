'use strict';
const baseController = require('../controller/baseController');
const url = require('url');


class wechatController extends baseController {
  async getSignature(ctx) {
    const jsapi_ticket = await ctx.service.wechatService.setToken();
    // const setting = await ctx.model.Setting.findOne();
    // const randomStr = ctx.randomString(16);
    const url = 'https://www.beihaozhuan.com/admin/system/systemlog';
    const timestamp = Math.round(Date.now() / 1000);

    const randomStr = ctx.randomString(16);

    const signature = await ctx.service.wechatService.signString({ jsapi_ticket, timestamp, url, randomStr });

    console.log(signature[0]);
    console.log(signature[1]);
    // console.log(result);
    this.success({
      jsapi_ticket,
      appID: ctx.app.config.wechatConfig.appid,
      timestamp,
      randomStr,
      signature: signature[1],
      url,
    });
  }
  // async getSignature(ctx) {
  //   const requestObj_1 = {
  //     appid: ctx.app.config.wechatConfig.appid,
  //     secret: ctx.app.config.wechatConfig.secret,
  //     grant_type: 'client_credential',
  //   };
  //
  //   const [ result_1 ] = await this.requestMethod(requestObj_1,
  //     'GET', 'https://api.weixin.qq.com/cgi-bin/token');
  //
  //   if (!ctx.helper.isEmpty(result_1.errcode)) {
  //     ctx.throw(400, result_1.errmsg);
  //   }
  //
  //   // '26_EpDz1uSWyf3ZQPW2ZCmN49rx8RlPXSA6z_e8NKSHGbUFCbiJWJFDWvfSLKKIg8FCkz2_XEuxNoEsRgPhy0SEeQU60H2kuceAXVjOHjgzSGGd7PrW9vh5OqwgPaq7AoiYpOB9Wpsd0og6UdMoFDGdAIAYWZ'
  //   const requestObj_2 = {
  //     access_token: result_1.access_token,
  //     type: 'jsapi',
  //   };
  //   const [ result_2 ] = await this.requestMethod(requestObj_2,
  //     'GET', 'https://api.weixin.qq.com/cgi-bin/ticket/getticket');
  //
  //
  //   console.log(result_2);
  //   const appID = ctx.app.config.wechatConfig.appid;
  //   // let ticket = `kgt8ON7yVITDhtdwci0qeTSKjv5Yawv79kzzTIzVlZ0EosIl7SrkqevFvjlR1ozpwctDbXZQ_sR-PqMXDyS8mA`;
  //   const randomStr = ctx.randomString(16);
  //   const url = 'https://www.beihaozhuan.com/index/ad?source=full&uuid=ADVck15314cx0003laa383n2grq6';
  //   const timeStamp = new Date().getTime();
  //   const signStr = `jsapi_ticket=${result_2.ticket}&noncestr=${randomStr}&timestamp=${timeStamp}&url=${url}`;
  //
  //
  //   console.log(signStr);
  //   const crypto = require('crypto'),
  //     shaSum = crypto.createHash('sha1');
  //   shaSum.update(signStr);
  //   const result = shaSum.digest('hex');
  //   console.log(result);
  //   this.success({
  //     appId: appID,
  //     jsapi_ticket: result_2.ticket,
  //     timeStamp,
  //     nonceStr: randomStr,
  //     signature: result,
  //     url,
  //   });
  // }


  async withdrew(ctx) {
    try {
      let amount = 100,
        desc = '平台提现';

      const [ condition ] = await this.cleanupRequestProperty('goodRules.findGoodRule',
        'type');
      if (!condition) {
        return;
      }

      switch (condition.type) {
        case 'A':
          amount = 31;
          desc = '双十二活动奖励A';
          break;
        case 'B':
          amount = 32;
          desc = '双十二活动奖励B';
          break;
        case 'C':
          amount = 33;
          desc = '双十二活动奖励C';
          break;
        case 'D':
          amount = 34;
          desc = '双十二活动奖励D';
          break;
        default:
          ctx.throw(400, '选项错误');
      }
      if (ctx.helper.isEmpty(ctx.user.OPENID)) {
        return this.failure('该用户没有注册微信');
      }
      const ip = ctx.app.getIP(ctx.request);
      const partner_trade_no = 100 + ctx.helper.randomNumber(10);
      const result = await ctx.service.wechatService.withdrew(amount, desc, ip, partner_trade_no);
      this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }


  async callback(ctx) {
    try {
      const returnUrl = ctx.request.url; // /wechat/callback?code=021fx8wK0ooco92PlqwK0YNiwK0fx8wF&state=STATE
      // returnUrl = `/wechat/callback?code=021fx8wK0ooco92PlqwK0YNiwK0fx8wF&state=STATE`;


      const urlQuery = url.parse(returnUrl, true).query;
      const { code, state } = urlQuery;

      if (ctx.helper.isEmpty(code) || ctx.helper.isEmpty(state)) {
        ctx.throw('空值警告');
      }
      const requestObj_2 = {
        appid: ctx.app.config.wechatConfig.appid,
        secret: ctx.app.config.wechatConfig.secret,
        code,
        grant_type: 'authorization_code',
      };

      const [ result_2 ] = await this.requestMethod(requestObj_2,
        'GET', 'https://api.weixin.qq.com/sns/oauth2/access_token');


      if (!ctx.helper.isEmpty(result_2.errcode)) {
        ctx.throw(405, result_2.errmsg);
      }
      const OPENID = result_2.openid;
      const user = await this.ctx.service.userService.getUser({ OPENID });
      if (!ctx.helper.isEmpty(user)) {
        ctx.login(user);
        ctx.status = 301;
        ctx.redirect('/index');
        await this.ctx.service.userService.updateUser(user.uuid, {
          'userStatus.hasVerifyWechat': 'enable',
        });
      } else {
        const requestObj_3 = {
          access_token: result_2.access_token,
          openid: OPENID,
          lang: 'zh_CN',
        };
        const [ result_3 ] = await this.requestMethod(requestObj_3,
          'GET', 'https://api.weixin.qq.com/sns/userinfo');
        if (result_3.errcode) {
          return;
        }
        // 去注册
        const statusString = ctx.helper.encrypt(OPENID);
        const head = ctx.helper.encrypt(result_3.headimgurl);
        const nickName = ctx.helper.encrypt(result_3.nickname);
        ctx.status = 301;
        ctx.redirect(`/index?statusString=${statusString}&jumpTo=loginInfoBindPhone&head=${head}&nickName=${nickName}`);
      }
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }
}

module.exports = wechatController;
