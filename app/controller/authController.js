'use strict';
let ms = require('ms');
const Controller = require('./baseController');

class authController extends Controller {

    async login(ctx) {
        // let server = ctx.protocol + '://' + ctx.host;
        // let url = `${server}/email/valid?act=forget&email=xxx&token=aa`;

        const [condition] = await this.cleanupRequestProperty('authRules.loginRule',
            `password`, `tel_number`, `smsLoginVerifyCode`, `rememberMe`);
        if (!condition) {
            return;
        }
        let userResult, verifyFlag;

        if (ctx.user) {
            ctx.logout();
        }
        if (!this.ctx.helper.isEmpty(condition.smsLoginVerifyCode)) {
            if (ctx.session.smsLoginVerifyCode === condition.smsLoginVerifyCode) {
                verifyFlag = true;
                ctx.session.smsLoginVerifyCode = undefined;
                userResult = await ctx.service.userService.getUser({
                    tel_number: condition.tel_number
                });
            } else {
                this.failure(`smsLoginVerifyCode 验证失败`, 400);
                return;
            }
        } else if (!this.ctx.helper.isEmpty(condition.password)) {
            userResult = await ctx.service.userService.getUser({
                tel_number: condition.tel_number,
                password: ctx.helper.passwordEncrypt(condition.password)
            });
        } else {
            return this.failure(`denglushibai`, 400);
        }

        if (ctx.helper.isEmpty(userResult) || ctx.helper.isEmpty(userResult.uuid)) {
            return this.failure(`该用户未注册`, 400);
        }
        if (userResult || verifyFlag) {
            await ctx.service.userService.updateUser_login(userResult.uuid);

            if (condition[`rememberMe`]) {
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
            const [requestEntity] = await this.cleanupRequestProperty('authRules.loginRule',
                `smsVerifyCode`, `password`, `tel_number`, `inviteCode`, `statusString`, `head`);
            if (!requestEntity) {
                return;
            }
            // if (ctx.helper.isEmpty(ctx.session.smsVerifyCode) || !(String(ctx.session.smsVerifyCode).toLowerCase() ===
            //     String(requestEntity.smsVerifyCode).toLowerCase())) {
            //     ctx.throw(400, `VerifyCode verify failed`);
            // }
            // if (ctx.helper.isEmpty(ctx.session.tel_number) || !(String(ctx.session.tel_number).toLowerCase() ===
            //     String(requestEntity.tel_number).toLowerCase())) {
            //     ctx.throw(400, `tel_number doesn't exist`);
            // }

            ctx.session.tel_number = null;
            ctx.session.smsVerifyCode = null;
            let oldUser = await ctx.service.userService.getUser({tel_number: requestEntity.tel_number});
            if (!ctx.helper.isEmpty(oldUser)) {
                return this.failure(`电话号码已经被注册`, 400);
            }
            const enPassword = ctx.helper.passwordEncrypt(requestEntity.password);
            let uuid = require('cuid')();
            let newUser = {
                password: enPassword,
                uuid: uuid,
                role: 'User',
                tel_number: requestEntity.tel_number,
                Bcoins: 1000
            };

            await ctx.service.userService.addUser(newUser, requestEntity.inviteCode);
            delete newUser.password;
            this.success(newUser);
        } catch (e) {
            if (e.message.toString().includes(`E11000`)) {
                return this.failure(`tel_number is duplicated `, 400);
            } else {
                this.failure(e.message, 400);
            }
        }
    };

    async bindWechat(ctx) {
        try {
            const [requestEntity] = await this.cleanupRequestProperty('authRules.bindWechat',
                `smsVerifyCode`, `tel_number`, `statusString`, `head`, `nickName`);
            if (!requestEntity) {
                return;
            }
            // if (ctx.helper.isEmpty(ctx.session.smsVerifyCode) || !(String(ctx.session.smsVerifyCode).toLowerCase() ===
            //     String(requestEntity.smsVerifyCode).toLowerCase())) {
            //     ctx.throw(401, `VerifyCode verify failed`);
            // }
            // if (ctx.helper.isEmpty(ctx.session.tel_number) || !(String(ctx.session.tel_number).toLowerCase() ===
            //     String(requestEntity.tel_number).toLowerCase())) {
            //     ctx.throw(402, `tel_number doesn't exist`);
            // }


            // ctx.session.tel_number = `null`;
            //  ctx.session.smsVerifyCode = `null`;
            let user = await ctx.service.userService.getUser({tel_number: requestEntity.tel_number});

            let newUser = {};
            if (ctx.helper.isEmpty(user)) {
                let randomPassword = ctx.helper.passwordEncrypt(ctx.randomString(16));
                newUser.OPENID = ctx.helper.decrypt(requestEntity.statusString);
                newUser.avatar = ctx.helper.decrypt(requestEntity.head);
                newUser.nickName = ctx.helper.decrypt(requestEntity.nickName);
                newUser.password = randomPassword;
                newUser.uuid = require('cuid')();
                newUser.role = 'User';
                newUser.tel_number = requestEntity.tel_number;
                newUser.Bcoins = 1100;
                let newUser_login = await ctx.service.userService.addUser(newUser, null);
                ctx.login(newUser_login);
                console.log(`shangmian`)
                delete newUser.password;
            } else {
                // return this.failure(`电话号码已经被注册`, 400);
                newUser.OPENID = ctx.helper.decrypt(requestEntity.statusString);
                newUser.avatar = ctx.helper.decrypt(requestEntity.head);
                newUser.nickName = ctx.helper.decrypt(requestEntity.nickName);

                let newUser_login = await ctx.service.userService.updateUser(user.uuid, newUser);
                ctx.login(newUser_login);
                console.log(`xiamian`)
            }
            ctx.status = 301;
            console.log(`fanhui`)
            return ctx.redirect(`/index`);
        } catch (e) {

            if (e.message.toString().includes(`E11000`)) {
                return this.failure(`tel_number is duplicated `, 400);
            } else {
                this.failure(e.message, 503);
            }
        }
    };

    async register_fake(ctx) {
        try {
            const [requestEntity] = await this.cleanupRequestProperty('authRules.loginRule',
                `smsVerifyCode`, `password`, `tel_number`);
            if (!requestEntity) {
                return;
            }
            if (ctx.helper.isEmpty(ctx.session.smsVerifyCode) || !(String(ctx.session.smsVerifyCode).toLowerCase() ===
                String(requestEntity.smsVerifyCode).toLowerCase())) {
                //ctx.throw(403, `VerifyCode verify failed`);
                return this.failure(`验证码不正确`, 403);
            }
            if (ctx.helper.isEmpty(ctx.session.tel_number) || !(String(ctx.session.tel_number).toLowerCase() ===
                String(requestEntity.tel_number).toLowerCase())) {
                // ctx.throw(402, `tel_number smsVerifyCode doesn't exist`);
                return this.failure(`验证码不正确`, 403);
            }
            ctx.session.tel_number = null;
            ctx.session.smsVerifyCode = null;
            let oldUser = await ctx.model[`UserAccountFake`].findOne({tel_number: requestEntity.tel_number});

            if (!ctx.helper.isEmpty(oldUser)) {
                return this.failure(`电话号码已经被注册`, 400);
            }
            //const enPassword = ctx.helper.passwordEncrypt(requestEntity.password);
            let uuid = require('cuid')();
            const newUser = {
                password: requestEntity.password,
                uuid: uuid,
                tel_number: requestEntity.tel_number,
            };

            let userNew = new this.ctx.model.UserAccountFake(newUser);
            userNew.save();
            this.success();
        } catch (e) {
            if (e.message.toString().includes(`E11000`)) {
                return this.failure(`tel_number is duplicated `, 400);
            } else {
                this.failure(e.message, 503);
            }
        }

    }

    async biefanle(ctx) {

        let app = ctx.app;
        let nodeExcel = require('excel-export');
        let users = await ctx.model[`UserAccountFake`].find();
        let resultData = [];
        users.forEach((user) => {

            let tempArray = [];
            tempArray.push(user.tel_number);
            tempArray.push(app.getLocalTime(user.created_at));
            tempArray.push(ctx.helper.isEmpty(user.signTimes) ? 0 : Number(user.signTimes));
            resultData.push(tempArray);
        });
        let conf = {};
        conf.stylesXmlFile = "styles.xml";
        // uncomment it for style example
        // conf.stylesXmlFile = "styles.xml";
        conf.cols = [{
            caption: '手机号',
            captionStyleIndex: 1,
            type: 'string',
            width: 160
        }, {
            caption: '注册时间',
            type: 'string',
            width: 250
        }, {
            caption: '签到次数',
            type: 'number',
            width: 360
        }];
        conf.rows = resultData;
        conf.name = `${app.getFormatDate()}`;
        let result = nodeExcel.execute(conf);
        let data = new Buffer(result, 'binary');
        ctx.set('Content-Type', 'application/vnd.openxmlformats');
        ctx.set("Content-Disposition", "attachment; filename=" + `UserRegister-${app.getLocalTime(new Date())}.xlsx`);
        ctx.body = data;
    };

    async signIn_fake(ctx) {
        const {tel_number} = ctx.query;

        let thisDay = ctx.app.getFormatDate();
        let newUser = await this.ctx.model.UserAccountFake.findOne({tel_number: tel_number});
        if (ctx.helper.isEmpty(newUser)) {
            return this.success(null, `找不到这个用户，请注册`, 404)
        }
        if (newUser.lastSignInDay === thisDay) {
            return this.success({count: newUser.signTimes}, `今天已经签到了`, 201)
        } else {
            let user = await this.ctx.model.UserAccountFake.findOneAndUpdate({tel_number: tel_number},
                {$set: {lastSignInDay: thisDay}, $inc: {signTimes: 1}}, {new: true});
            return this.success({count: user.signTimes}, `签到成功`)
        }
    }
}

module.exports = authController;