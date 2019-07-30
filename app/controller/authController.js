'use strict';

const Controller = require('./baseController');

class authController extends Controller {

    async login(ctx) {

        let body = ctx.request.body;
        let encryptedPassword = ctx.helper.passwordEncrypt(body.password);
        let userResult = await ctx.service.user.findOneUser({username: body.username, password: encryptedPassword});

        if (userResult) {
            ctx.login({
                username: body.username,
                password: encryptedPassword, //  password: ctx.helper.passwordEncrypt,
            });

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
            const {captchaTxt, password, tel_number, username} = ctx.request.body;
            const rule = ctx.rules.loginRule;
            const errors = ctx.checkValidite(rule, ctx);

            let verifyFlag = String(ctx.session.captchaTxt).toLowerCase() ===
                String(captchaTxt).toLowerCase();
            if (ctx.helper.isEmpty(ctx.session.captchaTxt) || !verifyFlag) {
                this.failure(`CaptchaText verify failed`, 400);
            }
            let mainland_reg = /^1[3|4|5|7|8][0-9]{9}$/;
            if (!mainland_reg.test(tel_number)) {
                this.failure(`tel_number`, 400);
            }

            const enPassword = ctx.helper.passwordEncrypt(password);
            let uuid = require('cuid')();
            const newUser = {username: username, password: enPassword, uuid: uuid, role: 'User', tel_number: tel_number};
            //await ctx.service.user.addUser(newUser);

            this.success(newUser);
        }catch (e) {
            this.failure(e.message, 400);
        }

    }

}

module.exports = authController;