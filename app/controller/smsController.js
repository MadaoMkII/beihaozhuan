`use strict`;
const baseController = require(`../controller/baseController`);

class smsController extends baseController {
    async sendVerifySmsMessage(ctx) {
        const {tel_number} = ctx.request.body;
        let resultUser = await this.ctx.service.userService.getUser({tel_number: this.ctx.request.body.tel_number});
        if (!this.ctx.helper.isEmpty(resultUser)) {
            this.failure(`该手机号已注册`, 400);
            return;
        }
        const text = (Math.random() * Date.now() * 6).toFixed(0).slice(-6);
        ctx.session.smsVerifyCode = text;
        let promise = this.sendSmsMessage(tel_number, text);
        this.success();
        await promise;
    };

    async sendVerifySmsMessage_fakes(ctx) {
        const {tel_number} = ctx.request.body;
        let cookieValue = ctx.cookies.get(`baidu-Setting`, {
            encrypt: true,
            signed: true,
        });
        if (ctx.helper.isEmpty(cookieValue)) {
            ctx.cookies.set(`baidu-Setting`, tel_number, {
                encrypt: true,
                signed: true,
                maxAge: 60000
            });
        } else {
            return this.success(`短信CD中`);
        }

        let resultUser = await this.ctx.model.UserAccountFake.findOne({tel_number: this.ctx.request.body.tel_number});
        if (!this.ctx.helper.isEmpty(resultUser)) {
            this.failure(`该手机号已注册`, 400);
            return;
        }
        const text = (Math.random() * Date.now() * 6).toFixed(0).slice(-6);
        ctx.session.smsVerifyCode = text;
        await this.sendSmsMessage(tel_number, text);
    };

    async sendLoginVerifySmsMessage() {
        let resultUser = await this.ctx.service.userService.getUser({tel_number: this.ctx.request.body.tel_number});

        if (this.ctx.helper.isEmpty(resultUser)) {
            this.failure(`该手机号未注册`, 400);
            return;
        }
        const {tel_number} = this.ctx.request.body;
        const text = (Math.random() * Date.now() * 6).toFixed(0).slice(-6);
        this.ctx.session.smsLoginVerifyCode = text;

        let promise = this.sendSmsMessage(tel_number, text);
        this.success();
        await promise;
    };

    async sendfindPasswordBackSmsMessage(ctx) {
        const {tel_number} = ctx.request.body;
        const text = (Math.random() * Date.now() * 6).toFixed(0).slice(-6);
        ctx.session.fdbsmsVerifyCode = text;
        ctx.session.tel_number = tel_number;
        let promise = this.sendSmsMessage(tel_number, text);
        this.success();
        await promise;
    };

    async verifyfpbCode(ctx) {
        const {code} = ctx.request.body;
        if (code !== ctx.session.fdbsmsVerifyCode) {
            this.failure(`VerifyCode doesn't pair`, 401);
        } else {
            ctx.session.fdbsmsVerifyCode = null;
            ctx.session.fdbsmsVerified = true;
            this.success();
        }
    };

    async sendSmsMessage(tel_number, text) {

        this.ctx.session.tel_number = tel_number;
        await this.ctx.service.smsService.sendSmsMessage(text, tel_number);
        this.success();
    };
}

module.exports = smsController;