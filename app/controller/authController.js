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
            return this.failure(`登陆方式失败`, 401);
        }

        if (ctx.helper.isEmpty(userResult) || ctx.helper.isEmpty(userResult.uuid)) {
            return this.failure(`该用户未注册或密码不正确`, 400);
        }

        if (ctx.helper.isEmpty(userResult.userStatus) ||
            (ctx.helper.isEmpty(userResult.userStatus.activity) ||
                userResult.userStatus.activity === `disable`)) {
            return this.failure(`这个用户已经被停权`, 402);
        }
        if (userResult || verifyFlag) {
            await ctx.service.userService.updateUser_login(userResult);

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
            let initialBcoin;
            let result = await ctx.service[`systemSettingService`].getSetting();

            if (!this.ctx.helper.isEmpty(result.registerMission) &&
                !this.ctx.helper.isEmpty(result.registerMission.activity) &&
                !this.ctx.helper.isEmpty(result.registerMission.reward)) {
                initialBcoin = result.registerMission.activity ? result.registerMission.reward : 0;
            } else {
                initialBcoin = 0;
            }

            const enPassword = ctx.helper.passwordEncrypt(requestEntity.password);
            let uuid = require('cuid')();
            let newUser = {
                password: enPassword,
                uuid: uuid,
                role: '用户',
                tel_number: requestEntity.tel_number,
                Bcoins: result.registerMission.reward
            };

            await ctx.service.userService.addUser(newUser, requestEntity.inviteCode);
            let promise_1 = ctx.service[`analyzeService`].dataIncrementRecord(`userRegister`, 1, `user`);
            // let promise_2 = ctx.service.userService.setUserBcionChange(newUser.uuid,
            //     `注册奖励`, `获得`, initialBcoin);
            delete newUser.password;

            Promise.all([promise_1]).catch((error) => {
                console.log(error)
            });
            this.success()
        } catch (e) {
            if (e.message.toString().includes(`E11000`)) {
                return this.failure(`tel_number is duplicated `, 400);
            } else {
                console.log(e)
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
                newUser.role = '用户';
                newUser.tel_number = requestEntity.tel_number;
                newUser.Bcoins = 1100;
                newUser.userStatus = {};
                newUser.userStatus.hasVerifyWechat = true;
                let newUser_login = await ctx.service.userService.addUser(newUser, null);
                ctx.login(newUser_login);
                delete newUser.password;
            } else {
                // return this.failure(`电话号码已经被注册`, 400);
                newUser.OPENID = ctx.helper.decrypt(requestEntity.statusString);
                newUser.avatar = ctx.helper.decrypt(requestEntity.head);
                newUser.nickName = ctx.helper.decrypt(requestEntity.nickName);
                newUser.userStatus = {};
                newUser.userStatus.hasVerifyWechat = true;
                let newUser_login = await ctx.service.userService.updateUser(user.uuid, newUser);
                ctx.login(newUser_login);
            }
            this.success();
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
        try {
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
        } catch (e) {
            console.log(e)
        }
    };

    async lottery(ctx) {
        const {tel_number} = ctx.request.query;
        if (ctx.helper.isEmpty(tel_number)) {
            return this.success(`该手机号没有填写`, 404)
        }
        let newUser = await this.ctx.model.UserAccountFake.findOne({tel_number: tel_number});
        if (ctx.helper.isEmpty(newUser)) {
            return this.success(null, `找不到这个用户，请注册`, 404)
        }
        if (newUser.lottery >= 2) {
            return this.success({count: newUser.lottery}, `您的抽奖机会已经耗尽`, 201)
        } else {
            let user = await this.ctx.model.UserAccountFake.findOneAndUpdate({tel_number: tel_number},
                {$inc: {lottery: 1}}, {new: true});
            return this.success({count: user.lottery}, `抽奖成功`)
        }
    }

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