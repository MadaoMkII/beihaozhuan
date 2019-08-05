'use strict';

const Controller = require('./baseController');

class authController extends Controller {

    async login(ctx) {
        let server=ctx.protocol+'://'+ctx.host;
        let url=`${server}/email/valid?act=forget&email=xxx&token=aa`;
        console.log(url)
        let {password, tel_number, smsVerifyCode} = ctx.request.body;
        const validateResult = await ctx.validate('loginRule', { tel_number, password });
        if(!validateResult) return;
        if (ctx.helper.isEmpty(ctx.session.smsVerifyCode) || !(String(ctx.session.smsVerifyCode).toLowerCase() ===
            String(smsVerifyCode).toLowerCase())) {
            ctx.throw(400, `smsVerifyCode verify failed`);
        }
        if (ctx.user) {
            ctx.logout();
        }

        let encryptedPassword = ctx.helper.passwordEncrypt(password);
        let userResult = await ctx.service.userService.getUser({
            tel_number: tel_number,
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
            ctx.checkValidite(rule, ctx);


            if (ctx.helper.isEmpty(ctx.session.smsVerifyCode) || !(String(ctx.session.smsVerifyCode).toLowerCase() ===
                String(smsVerifyCode).toLowerCase())) {
                ctx.throw(400, `VerifyCode verify failed`);
            }
            if (ctx.helper.isEmpty(ctx.session.tel_number) || !(String(ctx.session.tel_number).toLowerCase() ===
                String(tel_number).toLowerCase())) {
                ctx.throw(400, `tel_number doesn't exist`);
            }
            let mainland_reg = /^1[3|4|5|7|8][0-9]{9}$/;
            if (!mainland_reg.test(tel_number)) {

                ctx.throw(400, `tel_number verify failed`);
            }
            ctx.session.tel_number = null;
            ctx.session.smsVerifyCode = null;

            const enPassword = ctx.helper.passwordEncrypt(password);
            let uuid = require('cuid')();
            const newUser = {
                password: enPassword,
                uuid: uuid,
                role: 'User',
                tel_number: tel_number,
                Bcoins: 1000
            };
            await ctx.service.userService.addUser(newUser);

            this.success(newUser);
        } catch (e) {
            this.failure(e.message, 400);
        }

    }

}

module.exports = authController;