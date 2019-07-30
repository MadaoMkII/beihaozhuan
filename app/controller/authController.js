'use strict';

const Controller = require('./baseController');

class authController extends Controller {

    async login(ctx) {
        if (ctx.user) {
            ctx.logout();
        }
        let body = ctx.request.body;
        let encryptedPassword = ctx.helper.passwordEncrypt(body.password);
        let userResult = await ctx.service.userService.getUser({
            tel_number: body.tel_number,
            password: encryptedPassword
        });

        if (userResult) {
            ctx.login(userResult);

            ctx.rotateCsrfSecret();
            this.success();

        } else {

            this.failure(`login failed`, 400);
        }
    };

    async logout(ctx) {

        if (!ctx.user) {
            this.failure(`user have not login yet`);

        } else {
            ctx.logout();
            this.success();
        }

    };

    async register(ctx) {
        try {
            const {smsVerifyCode, password, tel_number} = ctx.request.body;
            const rule = ctx.rules.loginRule;
            const errorsFlag = ctx.checkValidite(rule, ctx);
            if (errorsFlag) return;

            let verifyFlag = String(ctx.session.smsVerifyCode).toLowerCase() ===
                String(smsVerifyCode).toLowerCase();
            if (ctx.helper.isEmpty(ctx.session.smsVerifyCode) || !verifyFlag) {
                this.failure(`CaptchaText verify failed`, 400);
            }
            let mainland_reg = /^1[3|4|5|7|8][0-9]{9}$/;
            if (!mainland_reg.test(tel_number)) {
                this.failure(`tel_number`, 400);
            }

            const enPassword = ctx.helper.passwordEncrypt(password);
            let uuid = require('cuid')();
            const newUser = {
                password: enPassword,
                uuid: uuid,
                role: 'User',
                tel_number: tel_number,
                Bcoins: 1021
            };
            await ctx.service.userService.addUser(newUser);

            this.success(newUser);
        } catch (e) {
            this.failure(e.message, 400);
        }

    }

}

module.exports = authController;