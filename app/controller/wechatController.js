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
      condition.user_id = ctx.user._id;
      condition.result_code = 'SUCCESS';
      const count = await this.getFindModelCount('Withdrew', condition);
      const result = await ctx.service.wechatService.getWithdrew(condition, option,
        {
          result_code: 0,
          return_msg: 0,
          withdrewResult: 0,
          partner_trade_no: 0,
          OPENID: 0,
          constraint_id: 0,
          user_id: 0,
          guestIP: 0,
          category: 0,
        });
      return this.success([ result, count ]);
    } catch (e) {
      this.failure(e);
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
      const result = await ctx.service.wechatService.realWithdrewConstraint(condition.constraintId, ip);
      if (!result || result.result_code === 'FAIL') {
        this.failure(result);// '微信服务器连接不稳定,请稍后再试'
        // this.app.logger.error(new Error(JSON.stringify(result)), ctx);
      }
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }
  async uniAppLogin() {
    try {
      const [ condition ] = await this.cleanupRequestProperty('wechatRules.uniAppLoginRule',
        'access_token', 'sourceFrom', 'inviteCode', 'redirect', 'unionid');
      if (!condition) {
        return;
      }
      condition.stateMessage = 'CHECK';
      const result = await this.checkUserIDAndLogin_uniApp(condition);
      this.success(result);
    } catch (e) {
      this.failure(e);
    }
  }

  async checkUserIDAndLogin_uniApp(stateObj) {
    if (!stateObj.unionid) {
      this.ctx.throw('登录名为空' + stateObj.unionid);
    }
    const user = await this.ctx.service.userService.getUser({ unionid: stateObj.unionid });
    if (!this.isEmpty(user)) {
      if (user.userStatus.activity.toString() !== 'enable') {
        this.ctx.throw(400, '该账户被封停');
      }
      await this.ctx.login(user);
      return {
        success: true,
        userInfo: user,
        message: 'OK',
      };
    }

    this.ctx.session.status_website = this.ctx.helper.encrypt(stateObj.unionid);
    this.ctx.session.nickName = stateObj.nickName;
    this.ctx.session.head = stateObj.head;
    return {
      success: false,
      message: '找不到这个人',
      userInfo: {},
    };
  }
  async bindWechat_app(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('authRules.bindWechatApp',
        'smsVerifyCode', 'inviteCode', 'source', 'tel_number', 'unionid');
      if (!condition) {
        return;
      }
      const tel_number = condition.tel_number;
      console.log('calling bindWechat_app');

      if (this.isEmpty(ctx.session.tel_number) ||
        String(ctx.session.tel_number).toLowerCase() !==
        String(condition.tel_number).toLowerCase()) {
        return this.failure('注册号码未验证或者不存在', 400);
      }
      if (ctx.helper.isEmpty(ctx.session.fdbsmsVerifyCode) || !(String(ctx.session.fdbsmsVerifyCode).toLowerCase() ===
                String(condition.smsVerifyCode).toLowerCase())) {
        return this.failure('微信短信验证失败', 400);
      }
      const result = await ctx.service.systemSettingService.getSetting();
      const user = await ctx.service.userService.getUser({ tel_number });
      let initialBcoin;
      if (!this.isEmpty(result.registerMission) && !this.isEmpty(result.registerMission.activity) &&
        !this.isEmpty(result.registerMission.reward)) {
        initialBcoin = String(result.registerMission.activity) === 'disable' ? 0 : result.registerMission.reward;
      } else {
        initialBcoin = 0;
      }
      const newUser = {};
      if (this.isEmpty(user)) {
        const unionid = ctx.helper.decrypt(ctx.session.status_website);
        console.log(unionid);
        const randomPassword = ctx.helper.passwordEncrypt(ctx.randomString(16));
        newUser.unionid = unionid;//
        newUser.avatar = ctx.session.head;
        newUser.nickName = ctx.session.nickName;
        newUser.password = randomPassword;
        newUser.uuid = require('cuid')();
        newUser.role = '用户';
        newUser.tel_number = tel_number;
        newUser.userStatus = {};
        newUser.userStatus.hasVerifyWechat = 'enable';
        newUser.userStatus.activity = 'enable';
        newUser.Bcoins = initialBcoin;
        newUser.source = this.isEmpty(condition.source) ? '平台' : condition.source;
        const newUser_login = await ctx.service.userService.addUser(newUser, condition.inviteCode);
        if (initialBcoin !== 0) {
          await this.ctx.service.userService.modifyUserRcoin({
            tel_number,
            amount: Number(initialBcoin),
            content: '注册奖励',
            type: '注册',
          });
        }
        await ctx.login(newUser_login);
        delete newUser.password;
      } else {
        if (!this.isEmpty(user.unionid)) {
          this.ctx.throw(400, '已经设置过了');
        }
        const unionid = ctx.helper.decrypt(ctx.session.status_website);
        console.log(unionid);
        // newUser.unionid = ctx.helper.decrypt(ctx.session.status_website);
        newUser.unionid = unionid;
        newUser.userStatus = {};
        newUser.userStatus.activity = 'enable';
        newUser.userStatus.hasVerifyWechat = 'enable';
        const newUser_login = await ctx.service.userService.updateUser(user.uuid, newUser);
        await ctx.login(newUser_login);
      }
      ctx.session.tel_number = null;
      ctx.session.fdbsmsVerifyCode = null;
      ctx.session.status_website = null;
      ctx.session.head = null;
      ctx.session.nickName = null;
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }

  async checkUserIDAndLogin(ctx, stateObj, access_token) {
    if (!this.isEmpty(stateObj.openid)) { stateObj.OPENID = stateObj.openid; }
    if (!stateObj.OPENID) {
      ctx.throw('登录名为空' + stateObj.openid);
    }
    console.log(stateObj);
    const user = await this.ctx.service.userService.getUser({ OPENID: stateObj.OPENID });
    if (!ctx.helper.isEmpty(user)) {
      if (user.userStatus.activity.toString() !== 'enable') {
        ctx.throw(400, '该账户被封停');
      }
      await ctx.login(user);
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
        ctx.status = 301;
        ctx.redirect(`/${location_jump}`);
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
      const url = `/index#/pages/login/login?type=bindPhone&statusString=${statusString}&head=${head}&nickName=${nickName}&inviteCode=${stateObj.inviteCode}&source=${source}&state=${state}&redirect=${stateObj.redirect}`;
      // const url = `/index/?statusString=${statusString}&jumpTo=loginInfoBindPhone&head=${head}&nickName=${nickName}&inviteCode=${stateObj.inviteCode}&source=${source}&state=${state}&redirect=${stateObj.redirect}`;
      //
      ctx.status = 301;
      ctx.redirect(url);
      // if (stateObj.redirect) {
      //   const url = `/index/?statusString=${statusString}&jumpTo=loginInfoBindPhone&head=${head}&nickName=${nickName}&inviteCode=${stateObj.inviteCode}&source=${source}&state=${state}&redirect=${stateObj.redirect}`;
      //   ctx.status = 301;
      //   ctx.redirect(url);
      // } else {
      //   this.success();
      // }
    }
  }
  async callback(ctx) {
    try {
      const returnUrl = ctx.request.href; // /wechat/callback?code=021fx8wK0ooco92PlqwK0YNiwK0fx8wF&state=STATE
      // returnUrl = `/wechat/callback?code=021fx8wK0ooco92PlqwK0YNiwK0fx8wF&state=STATE`;
      // const urlQuery = url.parse(returnUrl, true).query;
      const urlQuery = new URL(returnUrl).searchParams;
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
