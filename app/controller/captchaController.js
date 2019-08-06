'use strict';

const Controller = require('./baseController');

class captchaController extends Controller {

    async verifyCaptchaText(ctx) {

        let flag = String(ctx.session.captchaTxt).toLowerCase() === String(ctx.request.body.captchaTxt).toLowerCase();
        if (flag) {
            ctx.session.smsVerifyCode=
            this.success();
        } else {
            this.failure(`CaptchaText verify failed`, 400);
        }
    };


    // async verifyCaptchaText(ctx) {
    //     console.log(ctx.session.captchaTxt)
    //     return String(ctx.session.captchaTxt).toLowerCase() === String(ctx.request.body.captchaTxt).toLowerCase();
    // };


    async getCaptchaImg(ctx) {

        const captchaObj = await ctx.service.captchaService.getcaptcha();
        ctx.session.captchaTxt = captchaObj.text;
        ctx.set('Content-Type', 'image/svg+xml');
        ctx.status = 200;
        ctx.body = captchaObj.data;
    };

}

module.exports = captchaController;