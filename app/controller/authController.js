'use strict';
let ms = require('ms');
let moment = require('moment');
const Controller = require('./baseController');

class authController extends Controller {

    async login(ctx) {
        let server = ctx.protocol + '://' + ctx.host;
        let url = `${server}/email/valid?act=forget&email=xxx&token=aa`;
        let {password, tel_number, smsVerifyCode, rememberMe} = ctx.request.body;
        let userResult, verifyFlag;
        // if (ctx.helper.isEmpty(ctx.session.smsVerifyCode) || !(String(ctx.session.smsVerifyCode).toLowerCase() ===
        //     String(smsVerifyCode).toLowerCase())) {
        //     ctx.throw(400, `smsVerifyCode verify failed`);
        // }
        if (ctx.user) {
            ctx.logout();
        }
        if (!this.ctx.helper.isEmpty(smsVerifyCode)) {
            if (ctx.session.smsVerifyCode === smsVerifyCode) {
                verifyFlag = true;
                ctx.session.smsVerifyCode = undefined;
                userResult = await ctx.service.userService.getUser({
                    tel_number: tel_number
                });
            } else {
                this.failure(`smsVerifyCode 验证失败`, 400);
                return;
            }
        } else if (!this.ctx.helper.isEmpty(password)) {
            userResult = await ctx.service.userService.getUser({
                tel_number: tel_number,
                password: ctx.helper.passwordEncrypt(password)
            });
        }


        if (userResult || verifyFlag) {
            await ctx.service.userService.updateUser_login(userResult.uuid);

            if (rememberMe) {
                ctx.session.maxAge = ms('7d');
            } else {
                ctx.session.maxAge = ms('2h');
            }
            ctx.login(userResult);
            //ctx.rotateCsrfSecret();

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
            const [requestEntity] = await this.cleanupRequestProperty('loginRule',
                `smsVerifyCode`, `password`, `tel_number`);
            if (!requestEntity) {
                return;
            }
            if (ctx.helper.isEmpty(ctx.session.smsVerifyCode) || !(String(ctx.session.smsVerifyCode).toLowerCase() ===
                String(requestEntity.smsVerifyCode).toLowerCase())) {
                ctx.throw(400, `VerifyCode verify failed`);
            }
            if (ctx.helper.isEmpty(ctx.session.tel_number) || !(String(ctx.session.tel_number).toLowerCase() ===
                String(requestEntity.tel_number).toLowerCase())) {
                ctx.throw(400, `tel_number doesn't exist`);
            }
            ctx.session.tel_number = null;
            ctx.session.smsVerifyCode = null;

            const enPassword = ctx.helper.passwordEncrypt(requestEntity.password);
            let uuid = require('cuid')();
            const newUser = {
                password: enPassword,
                uuid: uuid,
                role: 'User',
                tel_number: requestEntity.tel_number,
                Bcoins: 1000
            };
            await ctx.service.userService.addUser(newUser);

            this.success(newUser);
        } catch (e) {
            if (e.message.toString().includes(`E11000`)) {
                return this.failure(`tel_number is duplicated `, 400);
            } else {
                this.failure(e.message, 400);
            }

        }

    }

}

module.exports = authController;