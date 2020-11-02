'use strict';
const baseController = require('../controller/baseController');

class smsController extends baseController {
  async sendVerifySmsMessage(ctx) {
    try {
      const { tel_number } = ctx.request.body;
      const resultUser = await this.ctx.service.userService.getUser({ tel_number: this.ctx.request.body.tel_number });
      if (!this.ctx.helper.isEmpty(resultUser)) {
        return this.failure('该手机号未注册', 4013, 400);
      }
      const text = (Math.random() * Date.now() * 6).toFixed(0).slice(-6);
      ctx.session.smsVerifyCode = text;
      const promise = this.sendSmsMessage(tel_number, text);
      this.success();
      Promise.all([ promise ]).catch();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async sendVerifySmsMessage_fakes(ctx) {
    try {
      const { tel_number } = ctx.request.body;
      const cookieValue = ctx.cookies.get('baidu-Setting', {
        encrypt: true,
        signed: true,
      });
      if (ctx.helper.isEmpty(cookieValue)) {
        ctx.cookies.set('baidu-Setting', tel_number, {
          encrypt: true,
          signed: true,
          maxAge: 60000,
        });
      } else {
        return this.success('短信CD中');
      }

      const resultUser = await this.ctx.model.UserAccountFake.findOne({ tel_number: this.ctx.request.body.tel_number });
      if (!this.ctx.helper.isEmpty(resultUser)) {
        this.failure('该手机号已注册', 400);
        return;
      }
      const text = (Math.random() * Date.now() * 6).toFixed(0).slice(-6);
      ctx.session.smsVerifyCode = text;
      await this.sendSmsMessage(tel_number, text);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async sendLoginVerifySmsMessage(ctx) {
    try {
      const resultUser = await this.ctx.service.userService.getUser({ tel_number: this.ctx.request.body.tel_number });

      if (this.ctx.helper.isEmpty(resultUser)) {
        return this.failure('该手机号未注册', 4013, 400);
      }
      const { tel_number } = this.ctx.request.body;
      const text = (Math.random() * Date.now() * 6).toFixed(0).slice(-6);
      this.ctx.session.smsLoginVerifyCode = text;
      const promise = this.sendSmsMessage(tel_number, text);
      this.success();
      Promise.all([ promise ]).catch();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async sendFindPasswordBackSmsMessage(ctx) {
    try {
      const { tel_number } = ctx.request.body;
      const text = (Math.random() * Date.now() * 6).toFixed(0).slice(-6);
      ctx.session.fdbsmsVerifyCode = text;
      ctx.session.tel_number = tel_number;
      const promise = this.sendSmsMessage(tel_number, text);
      this.success();
      Promise.all([ promise ]).catch();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async verifyFpbCode(ctx) {
    try {
      const { code } = ctx.request.body;
      if (code !== ctx.session.fdbsmsVerifyCode) {
        this.failure('找回密码验证失败', 4014, 400);
      } else {
        ctx.session.fdbsmsVerifyCode = null;
        ctx.session.fdbsmsVerified = true;
        this.success();
      }
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async sendSmsMessage(tel_number, text) {
    try {
      this.ctx.session.tel_number = tel_number;
      await this.ctx.service.smsService.sendSmsMessage(text, tel_number);
      this.success();
    } catch (e) {
      this.app.logger.error(e, this.ctx);
      this.failure();
    }
  }
}

module.exports = smsController;
