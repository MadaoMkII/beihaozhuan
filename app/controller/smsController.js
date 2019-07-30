`use strict`;
const baseController = require(`../controller/baseController`);

class smsController extends baseController {


    async sendSmsMessage(ctx) {
        const {tel_number} = ctx.query;
        const captchaObj = await ctx.service.captchaService.getcaptcha();
        ctx.session.verifyCode = captchaObj.text;
        console.log(captchaObj.text)
        let result = await  ctx.service.smsService.sendSmsMessage(captchaObj.text, tel_number);
        if (result) {
            this.success();
        } else {
            this.failure();
        }
    };
}

module.exports = smsController;