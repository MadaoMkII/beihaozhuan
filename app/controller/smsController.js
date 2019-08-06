`use strict`;
const baseController = require(`../controller/baseController`);

class smsController extends baseController {
    async sendVerifySmsMessage(ctx) {
        const {tel_number} = ctx.request.body;
        const text = (Math.random() * Date.now() * 6).toFixed(0).slice(-6);
        await this.sendSmsMessage(tel_number, text);

    };

    async sendSmsMessage(tel_number, text) {

        this.ctx.session.smsVerifyCode = text;
        this.ctx.session.tel_number = tel_number;
        //let result = await this.ctx.service.smsService.sendSmsMessage(text, tel_number);
        if (true) {
            this.success(text);
        } else {
            this.failure();
        }
    };
}

module.exports = smsController;