'use strict';
const baseController = require('../controller/baseController');
const { URL } = require('url');


class wechatController extends baseController {


  //---------------------------------------
  async getWechatNickName(ctx) {
    try {
      const name = await ctx.service.wechatService.getRealNickName();
      if (!ctx.app.isEmpty(name)) {
        return this.success(name.nickname);
      }
      this.success();
    } catch (e) {
      this.failure(e);
    }
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
      this.failure(e);
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
    try {
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
    } catch (e) {
      this.failure(e);
    }
  }
  async getWithdrewStatus(ctx) {
    try {
      // await this.checkTimeInterval(0.5);
      const settingArray = await ctx.service.wechatService.getWithdrewStatus();
      this.success(settingArray);
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }
  async withdrew(ctx) {
    try {
      // await this.checkTimeInterval(0.5);
      const [ condition ] = await this.cleanupRequestProperty('wechatRules.withdrewRule',
        'constraintId');
      if (!condition) {
        return;
      }
      const ip = ctx.app.getIP(ctx.request);
      console.log(condition);
      const result = await ctx.service.wechatService.realWithdrewConstraint(condition.constraintId, ip);
      if (!result || result.result_code === 'FAIL') {
        this.failure('微信服务器连接不稳定,请稍后再试');
        // this.app.logger.error(new Error(JSON.stringify(result)), ctx);
      }
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }
  async uniAppLogin(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('wechatRules.uniAppLoginRule',
        'access_token', 'openid', 'sourceFrom', 'inviteCode', 'redirect');
      if (!condition) {
        return;
      }
      condition.stateMessage = 'CHECK';
      await this.checkUserIDAndLogin(ctx, condition, condition.access_token);
    } catch (e) {
      this.failure(e);
    }
  }
  async checkUserIDAndLogin(ctx, stateObj, access_token) {
    stateObj.OPENID = stateObj.openid;
    console.log(stateObj);
    if (!stateObj.OPENID) {
      ctx.throw('登录名为空' + stateObj.openid);
    }
    const user = await this.ctx.service.userService.getUser({ OPENID: stateObj.OPENID });
    if (!ctx.helper.isEmpty(user)) {
      if (user.userStatus.activity.toString() !== 'enable') {
        ctx.throw(400, '该账户被封停');
      }
      ctx.login(user);
      let location_jump;
      if (stateObj.stateMessage !== 'CHECK') {
        location_jump = stateObj.stateMessage;
      } else {
        location_jump = 'index';
      }
      if (stateObj.redirect) {
        ctx.status = 301;
        ctx.redirect(`/${location_jump}?redirect=${stateObj.redirect}`);
      } else {
        this.success();
      }
      await this.ctx.service.userService.updateUser(user.uuid, {
        'userStatus.hasVerifyWechat': 'enable',
      });
    } else {
      const requestObj_3 = {
        access_token,
        openid: stateObj.OPENID,
        lang: 'zh_CN',
      };
      const [ result_3 ] = await this.requestMethod(requestObj_3,
        'GET', 'https://api.weixin.qq.com/sns/userinfo');
      console.log(result_3);
      if (result_3.errcode) {
        return;
      }
      // 去注册
      const statusString = ctx.helper.encrypt(stateObj.OPENID);
      const head = ctx.helper.encrypt(result_3.headimgurl);
      const nickName = ctx.helper.encrypt(result_3.nickname);

      let state,
        source;
      if (stateObj.stateMessage !== 'CHECK') {
        state = stateObj.stateMessage;
        source = stateObj.sourceFrom;
      } else {
        source = 'origin';
        state = '';
      }
      if (stateObj.redirect) {
        const url = `/index/?statusString=${statusString}&jumpTo=loginInfoBindPhone&head=${head}&nickName=${nickName}&inviteCode=${stateObj.inviteCode}&source=${source}&state=${state}&redirect=${stateObj.redirect}`;
        ctx.status = 301;
        ctx.redirect(url);
      } else {
        this.success();
      }
    }
  }
  async callback(ctx) {
    try {
      const returnUrl = ctx.request.href; // /wechat/callback?code=021fx8wK0ooco92PlqwK0YNiwK0fx8wF&state=STATE
      // returnUrl = `/wechat/callback?code=021fx8wK0ooco92PlqwK0YNiwK0fx8wF&state=STATE`;
      // const urlQuery = url.parse(returnUrl, true).query;
      const urlQuery = new URL(returnUrl).searchParams;
      console.log(urlQuery);
      const code = urlQuery.get('code');
      const redirect = urlQuery.get('redirect');
      const state = urlQuery.get('state');


      console.log('callback');
      let stateObj = {};
      stateObj.redirect = redirect;
      try {
        stateObj = JSON.parse(state.toString());
        // stateMessage = stateObj.stateMessage;
        // inviteCode = stateObj.inviteCode;
        // sourceFrom = stateObj.source;
      } catch (e) {
        stateObj.stateMessage = state;
      }
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
      stateObj.OPENID = result_2.openid;
      await this.checkUserIDAndLogin(ctx, stateObj, result_2.access_token);
    } catch (e) {
      this.failure(e);
    }
  }
}

module.exports = wechatController;
