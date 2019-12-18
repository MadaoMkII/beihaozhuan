'use strict';
const baseController = require('../controller/baseController');
const url = require('url');


class wechatController extends baseController {

  async getWechatNickName(ctx) {
    const name = await ctx.service.wechatService.getRealNickName();
    this.success(name.nickname);
  }


  async getWithDrewByAdmin(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('wechatRules.findWithdrewRule',
        'unit', 'page', 'return_msg', 'nickName', 'userUUid');
      if (!condition) {
        return;
      }
      if (!ctx.helper.isEmpty(condition.nickName)) {
        condition.nickName = { $regex: `.*${condition.nickName}.*` };
      }
      const count = await this.getFindModelCount('Withdrew', condition);
      const result = await ctx.service.wechatService.getWithdrew(condition, option,
        {
          desc: 1,
          amount: 1,
          partner_trade_no: 1,
          nickName: 1,
          return_msg: 1,
          created_at: 1,
        });
      return this.success([ result, count ]);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }
  async getWithDrewByUser(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('wechatRules.findWithdrewRule',
        'unit', 'page', 'return_msg');
      if (!condition) {
        return;
      }
      condition.userUUid = ctx.user.uuid;
      const count = await this.getFindModelCount('Withdrew', condition);
      const result = await ctx.service.wechatService.getWithdrew(condition, option,
        { desc: 1, amount: 1, return_msg: 1 });
      return this.success([ result, count ]);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async getSignature(ctx) {
    const jsapi_ticket = await ctx.service.wechatService.setToken();
    // const setting = await ctx.model.Setting.findOne();
    // const randomStr = ctx.randomString(16);
    const url = 'https://www.beihaozhuan.com/admin/system/systemlog';
    const timestamp = Math.round(Date.now() / 1000);

    const randomStr = ctx.randomString(16);

    const signature = await ctx.service.wechatService.signString({ jsapi_ticket, timestamp, url, randomStr });
    this.success({
      jsapi_ticket,
      appID: ctx.app.config.wechatConfig.appid,
      timestamp,
      randomStr,
      signature: signature[1],
      url,
    });
  }

  async withdrew(ctx) {
    try {
      const user = ctx.user;
      const [ condition ] = await this.cleanupRequestProperty('wechatRules.withdrewRule',
        'type');
      if (!condition) {
        return;
      }
      const promise_0 = {};
      const settingArray = await ctx.service.systemSettingService.getWithDrewSetting();
      const option = settingArray.withDrewSetting.find(entity => entity.optionType === condition.type);

      const [ pass, msg ] = await ctx.service.wechatService.withdrewConstraint(ctx.user, option.category);

      if (!pass) {
        return this.success(msg, 'OK', 400);
      }

      const newBcoin = Number(ctx.user.Bcoins) - Number(option.amount * 100);
      if (newBcoin < 0) {
        return this.success('你的钱不够', 'OK', 400);
      }

      if (ctx.helper.isEmpty(option)) {
        return this.failure('输入type错误');
      }
      if (ctx.helper.isEmpty(user.OPENID)) {
        return this.success('该用户没有注册微信', 'OK', 400);
      }

      const ip = ctx.app.getIP(ctx.request);
      const partner_trade_no = 100 + ctx.helper.randomNumber(10);
      const result = await ctx.service.wechatService.withdrew(option.amount, option.category, ip, partner_trade_no, newBcoin);
      //
      // {
      //     "return_code": "SUCCESS",
      //     "return_msg": "",
      //     "mch_appid": "wx87462aaa978561bf",
      //     "mchid": "1546748521",
      //     "nonce_str": "V3IvzY8zKFwn5NX6iLUwp3Q1xLHcwJmi",
      //     "result_code": "SUCCESS",
      //     "partner_trade_no": "1009934862824",
      //     "payment_no": "10101080611701912050043521019656",
      //     "payment_time": "2019-12-05 15:13:12"
      // }
      //
      if (!result || result.result_code === 'FAIL') {
        this.failure('微信服务器连接不稳定,请稍后再试');
        this.app.logger.error(new Error(JSON.stringify(result)), ctx);
      }
      this.success();
      Promise.all([ promise_0 ]).then();

    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
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
      const OPENID = result_2.openid;// 微信登陆验证，如果有用户就登录
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
        let jumpTo = 'loginInfoBindPhone';
        if (state === 'doubleDec') {
          jumpTo = 'doubleDec';
        }
        ctx.status = 301;
        ctx.redirect(`/index?statusString=${statusString}&jumpTo=${jumpTo}=&head=${head}&nickName=${nickName}`);
      }
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }
}

module.exports = wechatController;
