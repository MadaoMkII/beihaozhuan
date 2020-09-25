'use strict';
const ms = require('ms');
const Controller = require('./baseController');

class authController extends Controller {

  async login(ctx) {

    try {
      // let server = ctx.protocol + '://' + ctx.host;
      // let url = `${server}/email/valid?act=forget&email=xxx&token=aa`;

      const [ condition ] = await this.cleanupRequestProperty('authRules.loginRule',
        'password', 'tel_number', 'smsLoginVerifyCode', 'rememberMe');
      if (!condition) {
        return;
      }
      let userResult,
        verifyFlag;

      if (ctx.user) {
        ctx.logout();
      }
      if (!this.ctx.helper.isEmpty(condition.smsLoginVerifyCode)) {
        if (ctx.session.smsLoginVerifyCode === condition.smsLoginVerifyCode) {
          verifyFlag = true;
          ctx.session.smsLoginVerifyCode = undefined;
          userResult = await ctx.service.userService.getUser({
            tel_number: condition.tel_number,
          });
        } else {
          this.failure('smsLoginVerifyCode 验证失败', 4010, 400);
          return;
        }
      } else if (!this.ctx.helper.isEmpty(condition.password)) {
        userResult = await ctx.service.userService.getUser({
          tel_number: condition.tel_number,
          password: ctx.helper.passwordEncrypt(condition.password),
        });
      } else {
        return this.failure('登陆方式失败', 4001, 400);
      }

      if (ctx.helper.isEmpty(userResult) || ctx.helper.isEmpty(userResult.uuid)) {
        return this.failure('该用户未注册或密码不正确', 4002, 400);
      }

      if (ctx.helper.isEmpty(userResult.userStatus) ||
                (ctx.helper.isEmpty(userResult.userStatus.activity) ||
                    userResult.userStatus.activity === 'disable')) {
        return this.failure('这个用户已经被停权', 4003, 400);
      }
      if (userResult || verifyFlag) {
        await ctx.service.userService.updateUser_login(userResult);

        if (condition.rememberMe) {
          ctx.session.maxAge = ms('7d');
        } else {
          ctx.session.maxAge = ms('2h');
        }
        ctx.login(userResult);
        // ctx.rotateCsrfSecret();
        this.success(ctx.user.role);
      } else {
        this.failure('登陆失败', 5000, 503);
      }
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async logout(ctx) {
    try {
      if (!ctx.user) {
        return this.failure('用户还没有登录', 4004, 400);
      }
      ctx.logout();
      this.success();


    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }


  async register(ctx) {
    try {
      const [ requestEntity ] = await this.cleanupRequestProperty('authRules.loginRule',
        'smsVerifyCode', 'password', 'tel_number', 'inviteCode', 'statusString', 'head', 'source');
      if (!requestEntity) {
        return;
      }

      if (ctx.helper.isEmpty(ctx.session.smsVerifyCode) || !(String(ctx.session.smsVerifyCode).toLowerCase() ===
                String(requestEntity.smsVerifyCode).toLowerCase())) {
        return this.failure('注册短信验证失败', 4011, 400);
      }
      if (ctx.helper.isEmpty(ctx.session.tel_number) || !(String(ctx.session.tel_number).toLowerCase() ===
                String(requestEntity.tel_number).toLowerCase())) {
        return this.failure('注册号码未验证或者不存在', 4012, 400);
      }

      ctx.session.tel_number = null;
      ctx.session.smsVerifyCode = null;
      const oldUser = await ctx.service.userService.getUser({ tel_number: requestEntity.tel_number });
      if (!ctx.helper.isEmpty(oldUser)) {
        return this.failure('电话号码已经被注册', 4013, 400);
      }
      let initialBcoin;
      const result = await ctx.service.systemSettingService.getSetting();

      if (!this.ctx.helper.isEmpty(result.registerMission) &&
                !this.ctx.helper.isEmpty(result.registerMission.activity) &&
                !this.ctx.helper.isEmpty(result.registerMission.reward)) {
        initialBcoin = result.registerMission.activity !== 'disable' ? result.registerMission.reward : 0;
      } else {
        initialBcoin = 0;
      }

      const enPassword = ctx.helper.passwordEncrypt(requestEntity.password);
      const uuid = require('cuid')();
      const newUser = {
        password: enPassword,
        uuid,
        role: '用户',
        tel_number: requestEntity.tel_number,
        Bcoins: initialBcoin,
        source: this.ctx.helper.isEmpty(requestEntity.source) ? '平台' : requestEntity.source,
      };
      let promise_2 = null;
      await ctx.service.userService.addUser(newUser, requestEntity.inviteCode);
      const promise_1 = ctx.service.analyzeService.dataIncrementRecord('userRegister', 1, 'user', '用户');

      if (initialBcoin !== 0) {
        promise_2 = ctx.service.userService.setUserBcionChange(newUser.uuid,
          '注册奖励', '获得', initialBcoin, initialBcoin);
      }
      delete newUser.password;

      Promise.all([ promise_1, promise_2 ]).catch(error => {
        ctx.throw(503, error);
      });
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async bindWechat(ctx) {
    try {
      const [ requestEntity ] = await this.cleanupRequestProperty('authRules.bindWechat',
        'smsVerifyCode', 'tel_number', 'statusString', 'head', 'nickName', 'inviteCode', 'source', 'state');
      if (!requestEntity) {
        return;
      }
      // if (ctx.helper.isEmpty(ctx.session.fdbsmsVerifyCode) || !(String(ctx.session.fdbsmsVerifyCode).toLowerCase() ===
      //           String(requestEntity.smsVerifyCode).toLowerCase())) {
      //   return this.failure('微信短信验证失败', 4015, 400);
      // }
      if (ctx.helper.isEmpty(ctx.session.tel_number) || !(String(ctx.session.tel_number).toLowerCase() ===
                String(requestEntity.tel_number).toLowerCase())) {
        return this.failure('注册号码未验证或者不存在', 4012, 400);
      }

      let promise = {};
      ctx.session.tel_number = null;
      ctx.session.fdbsmsVerifyCode = null;
      const user = await ctx.service.userService.getUser({ tel_number: requestEntity.tel_number });
      const result = await ctx.service.systemSettingService.getSetting();
      let initialBcoin;
      if (!this.ctx.helper.isEmpty(result.registerMission) &&
          !this.ctx.helper.isEmpty(result.registerMission.activity) &&
          !this.ctx.helper.isEmpty(result.registerMission.reward)) {
        initialBcoin = result.registerMission.activity === 'disable' ? 0 : result.registerMission.reward;
      } else {
        initialBcoin = 0;
      }


      const newUser = {};
      if (ctx.helper.isEmpty(user)) {
        const randomPassword = ctx.helper.passwordEncrypt(ctx.randomString(16));
        newUser.OPENID = ctx.helper.decrypt(requestEntity.statusString);
        newUser.avatar = ctx.helper.decrypt(requestEntity.head);
        newUser.nickName = ctx.helper.decrypt(requestEntity.nickName);
        newUser.password = randomPassword;
        newUser.uuid = require('cuid')();
        newUser.role = '用户';
        newUser.tel_number = requestEntity.tel_number;
        newUser.Bcoins = initialBcoin;
        newUser.userStatus = {};
        newUser.userStatus.hasVerifyWechat = 'enable';
        newUser.source = ctx.helper.isEmpty(requestEntity.source) ? 'origin' : requestEntity.source;
        const newUser_login = await ctx.service.userService.addUser(newUser, requestEntity.inviteCode);

        if (initialBcoin !== 0) {
          promise = ctx.service.userService.setUserBcionChange(newUser.uuid, '注册奖励', '获得', initialBcoin,
            initialBcoin);
        }
        ctx.login(newUser_login);
        delete newUser.password;
      } else {
        // return this.failure(`电话号码已经被注册`, 400);
        newUser.OPENID = ctx.helper.decrypt(requestEntity.statusString);
        newUser.avatar = ctx.helper.decrypt(requestEntity.head);
        newUser.nickName = ctx.helper.decrypt(requestEntity.nickName);
        newUser.userStatus = {};
        newUser.userStatus.hasVerifyWechat = 'enable';
        const newUser_login = await ctx.service.userService.updateUser(user.uuid, newUser);
        ctx.login(newUser_login);
      }
      this.success();
      await promise;
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  // async register_fake(ctx) {
  //     try {
  //         const [requestEntity] = await this.cleanupRequestProperty('authRules.loginRule',
  //             `smsVerifyCode`, `password`, `tel_number`);
  //         if (!requestEntity) {
  //             return;
  //         }
  //         if (ctx.helper.isEmpty(ctx.session.smsVerifyCode) || !(String(ctx.session.smsVerifyCode).toLowerCase() ===
  //             String(requestEntity.smsVerifyCode).toLowerCase())) {
  //             //ctx.throw(403, `VerifyCode verify failed`);
  //             return this.failure(`验证码不正确`, 403);
  //         }
  //         if (ctx.helper.isEmpty(ctx.session.tel_number) || !(String(ctx.session.tel_number).toLowerCase() ===
  //             String(requestEntity.tel_number).toLowerCase())) {
  //             // ctx.throw(402, `tel_number smsVerifyCode doesn't exist`);
  //             return this.failure(`验证码不正确`, 403);
  //         }
  //         ctx.session.tel_number = null;
  //         ctx.session.smsVerifyCode = null;
  //         let oldUser = await ctx.model[`UserAccountFake`].findOne({tel_number: requestEntity.tel_number});
  //
  //         if (!ctx.helper.isEmpty(oldUser)) {
  //             return this.failure(`电话号码已经被注册`, 400);
  //         }
  //         //const enPassword = ctx.helper.passwordEncrypt(requestEntity.password);
  //         let uuid = require('cuid')();
  //         const newUser = {
  //             password: requestEntity.password,
  //             uuid: uuid,
  //             tel_number: requestEntity.tel_number,
  //         };
  //
  //         let userNew = new this.ctx.model.UserAccountFake(newUser);
  //         userNew.save();
  //         this.success();
  //     } catch (e) {
  //         if (e.message.toString().includes(`E11000`)) {
  //             return this.failure(`tel_number is duplicated `, 400);
  //         } else {
  //             this.failure(e.message, 503);
  //         }
  //     }
  //
  // }

  async biefanle(ctx) {
    try {
      const fs = require('fs');
      const fileName = await ctx.service.excelService.getUserInfoExecl();
      // ctx.status = 200;
      // await ctx.downloader(fileName);
      // await fs.unlinkSync(fileName);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async biefanleToday(ctx) {
    try {
      const fs = require('fs');
      const fileName = await ctx.service.excelService.getUserInfoExecl_today();
      ctx.status = 200;
      await ctx.downloader(fileName);
      fs.unlinkSync(fileName);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  // async lottery(ctx) {
  //     const {tel_number} = ctx.request.query;
  //     if (ctx.helper.isEmpty(tel_number)) {
  //         return this.success(`该手机号没有填写`, 404)
  //     }
  //     let newUser = await this.ctx.model.UserAccountFake.findOne({tel_number: tel_number});
  //     if (ctx.helper.isEmpty(newUser)) {
  //         return this.success(null, `找不到这个用户，请注册`, 404)
  //     }
  //     if (newUser.lottery >= 2) {
  //         return this.success({count: newUser.lottery}, `您的抽奖机会已经耗尽`, 201)
  //     } else {
  //         let user = await this.ctx.model.UserAccountFake.findOneAndUpdate({tel_number: tel_number},
  //             {$inc: {lottery: 1}}, {new: true});
  //         return this.success({count: user.lottery}, `抽奖成功`)
  //     }
  // }

  // async signIn_fake(ctx) {
  //     const {tel_number} = ctx.query;
  //     let thisDay = ctx.app.getFormatDate();
  //     let newUser = await this.ctx.model.UserAccountFake.findOne({tel_number: tel_number});
  //     if (ctx.helper.isEmpty(newUser)) {
  //         return this.success(null, `找不到这个用户，请注册`, 404)
  //     }
  //     if (newUser.lastSignInDay === thisDay) {
  //         return this.success({count: newUser.signTimes}, `今天已经签到了`, 201)
  //     } else {
  //         let user = await this.ctx.model.UserAccountFake.findOneAndUpdate({tel_number: tel_number},
  //             {$set: {lastSignInDay: thisDay}, $inc: {signTimes: 1}}, {new: true});
  //         return this.success({count: user.signTimes}, `签到成功`)
  //     }
  // }

  async signIn(ctx) {

    const thisDay = ctx.app.getFormatDate();
    const newUser = await this.ctx.model.UserAccount.findOne({ tel_number: ctx.user.tel_number });
    if (ctx.helper.isEmpty(newUser)) {
      return this.success(null, '找不到这个用户，请注册', 404);
    }
    if (newUser.lastSignInDay === thisDay) {
      return this.success({ count: newUser.signTimes }, '今天已经签到了', 201);
    }
    const user = await this.ctx.model.UserAccount.findOneAndUpdate({ tel_number: ctx.user.tel_number },
      { $set: { lastSignInDay: thisDay }, $inc: { signTimes: 1 } }, { new: true });

    ctx.app.eventEmitter.emit('normalMissionCount', ctx.user._id, '每日签到');
    ctx.app.eventEmitter.emit('normalMissionCount', ctx.user._id, '每周签到');
    return this.success({ count: user.signTimes }, '签到成功');

  }
}

module.exports = authController;
