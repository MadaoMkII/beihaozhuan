`use strict`;
const baseController = require(`../controller/baseController`);

class smsController extends baseController {
    async sendVerifySmsMessage(ctx) {
        const {tel_number} = ctx.request.body;
        const text = (Math.random() * Date.now() * 6).toFixed(0).slice(-6);
        ctx.session.smsVerifyCode = text;
        await this.sendSmsMessage(tel_number, text);

    };

    async sendfindPasswordBackSmsMessage(ctx) {
        const {tel_number} = ctx.request.body;
        const text = (Math.random() * Date.now() * 6).toFixed(0).slice(-6);
        ctx.session.fdbsmsVerifyCode = text;
        ctx.session.tel_number = tel_number;
        await this.sendSmsMessage(tel_number, text);
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
        // let result = await this.ctx.service.smsService.sendSmsMessage(text, tel_number);
        if (true) {
            this.success(text);
        } else {
            this.failure();
        }
    };
}

module.exports = smsController;