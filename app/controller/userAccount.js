`use strict`;
const baseController = require(`../controller/baseController`);
let {DateTime} = require('luxon');

class userAccount extends baseController {
    async isLogin(ctx) {
        let userObj = ctx.user;
        let absoluteDate = ctx.getAbsoluteDate();
        let promiseArray = [];

        let triggerFlag = false;
        if (!ctx.helper.isEmpty(userObj)) {

            if (ctx.helper.isEmpty(userObj.last_login_time) ||
                (userObj.last_login_time).toString() !== absoluteDate.toString()) {
                triggerFlag = true;
            } else {
                let dailyMission = await this.ctx.model[`DailyMissionProcessingTracker`].findOne({
                    userID: userObj._id,
                    effectDay: absoluteDate
                });
                if (ctx.helper.isEmpty(dailyMission)) {
                    triggerFlag = true;
                }
            }

            if (triggerFlag) {
                let syncingTasksPromise = ctx.service[`userService`].syncingTasks(userObj);
                let updateUser = ctx.service[`userService`].updateUser(userObj.uuid, {last_login_time: absoluteDate});
                promiseArray.push(syncingTasksPromise);
                promiseArray.push(updateUser);
            }
            this.success(`用户已经登录`, 200);
            Promise.all(promiseArray).then();
        } else {
            return this.success(`用户尚未登录`, 200);
        }

    };


    async getUserInfo(ctx) {
        // console.log(ctx.url)
        // console.log(ctx.host)
        // console.log(ctx.path)
        // console.log(ctx.hostname)
        // console.log(ctx.origin)
        // console.log(ctx.is())
        // console.log(ctx.ips)
        // ctx.logger.debug('debug info');
        // ctx.logger.info('some request data: %j', ctx.request.body);
        // ctx.logger.warn('WARNNING!!!!');
        //let promiseArray = [];
        let userObj = ctx.user;
        // let events = ctx.service[`missionEventManager`].getAndInitMissionEvent(ctx.user);
        // promiseArray.push(events);
        this.success(userObj);
        // // ctx.logger.error(new Error('哇', {
        // //     "password": "Abc123",
        // //     "smsVerifyCode": 281105,
        // //     "tel_number": "15620304099"
        // // }),);
        // Promise.all(promiseArray).then(function (values) {
        //     console.log('all promise are resolved', values)
        // }).catch(function (reason) {
        //     console.log('promise reject failed reason')
        // })
    };

    async getUserBalanceList(ctx) {
        const [condition, option] = await this.cleanupRequestProperty('userAccountController.getUserBalanceListRule',
            `unit`, `page`, "period", "userUUid");
        if (condition !== false) {
            let end = DateTime.fromISO(ctx.getAbsoluteDate().toISOString());

            switch (condition.period) {

                case `month`:
                    option.beginDate = end.plus({months: -1}).toJSDate();

                    break;
                case `week`:
                    option.beginDate = end.plus({week: -1}).toJSDate();

                    break;
                case `full`:
                    option.beginDate = new Date(`2019-08-26`);
                    break;
            }
            let userUUid = ctx.helper.isEmpty(condition.userUUid) ? ctx.user.uuid : condition.userUUid;
            let [result, count] = await ctx.service[`userService`].getUserBalanceListRule(userUUid, option);
            this.success([result, count]);
        }
    };

    async updateUserPassword(ctx) {

        const [condition,] = await this.cleanupRequestProperty('authRules.updatePasswordRule',
            `password`);
        if (!condition) {
            return;
        }
        if (ctx.helper.isEmpty(ctx.session.fdbsmsVerified) || ctx.session.fdbsmsVerified !== true) {
            return this.failure(`验证码不匹配`, 400)
        }
        let encryptedPassword = ctx.helper.passwordEncrypt(condition.password);
        await ctx.service[`userService`].updateUserPassword(ctx.session.tel_number, encryptedPassword);
        ctx.session.tel_number = null;
        ctx.session.fdbsmsVerified = true;
        this.success();
    };

    async updateUserInfo(ctx) {

        const [condition] = await this.cleanupRequestProperty('userAccountController.updateInfoRule',
            `nickName`, `gender`, `birthday`, `location`, 'job', 'educationLevel');
        if (!condition) {
            return;
        }

        let ossUrl;
        if (!this.ctx.helper.isEmpty(ctx.request.files)) {
            const file = ctx.request.files[0];
            ossUrl = await ctx.service[`picService`].putImgs(file);
            condition.avatar = ossUrl;
        }
        const newUser_result = await this.ctx.service[`userService`].updateUser(ctx.user.uuid, condition);
        ctx.app.eventEmitter.emit(`normalMissionCount`, ctx.user._id, `完善用户信息`);

        this.success(newUser_result);
    };

    async getManyUser() {
        //let result = await ctx.service[`userService`].getManyUser(condition, option);
        const [condition, option] = await this.cleanupRequestProperty('userAccountController.findUsersRule',
            `tel_number`, `hasPaid`, `nickName`, `activity`, `hasVerifyWechat`, 'unit', 'page');
        if (condition !== false) {
            this.deepCleanUp(condition, `userStatus`, `activity`, `hasPaid`, `hasVerifyWechat`);
            let [result, count] = await this.ctx.service[`userService`].getManyUser(condition,
                option, {
                    created_at: 1,
                    Bcoins: 1,
                    tel_number: 1,
                    loginTimes: 1,
                    nickName: 1,
                    avatar: 1,
                    userStatus: 1,
                    uuid: 1
                });
            this.success([result, count]);
        }
    };

    async getManagementUserInfo(ctx) {
        const {role} = ctx.request.body;
        let [condition, option] = await this.cleanupRequestProperty('userAccountController.getManagementUserInfo',
            `role`, 'unit', 'page');
        if (!condition) {
            return;
        }
        if (ctx.helper.isEmpty(role)) {
            condition = {role: {$in: [`客服`, `超管`, `运营`]}};
        }
        let newUser = await ctx.service[`userService`].getManyUser(condition, option, {
            role: 1,
            tel_number: 1,
            nickName: 1,
            updated_at: 1,
            userStatus: 1,
            Bcoins: 1, uuid: 1, realName: 1
        });

        this.success(newUser);
    };

    async setUserStatus(ctx) {
        let [condition,] = await this.cleanupRequestProperty('userAccountController.setUserStatusRule',
            'uuid');
        if (!condition) {
            return;
        }
        await ctx.service[`userService`].updateUser(condition.uuid, {role: `用户`});
        this.success();
    };

    async setUserRole(ctx) {
        let [condition,] = await this.cleanupRequestProperty('userAccountController.getManagementUserInfo',
            'role', 'uuid');

        await ctx.service[`userService`].updateUser(condition.uuid, condition.role);
        this.success();
    };

    async setUserAdmin(ctx) {
        let [condition,] = await this.cleanupRequestProperty('userAccountController.setUserAdminRule',
            'role', 'tel_number', 'realName');
        if (!condition) {
            return;
        }
        let user = await ctx.service[`userService`].getUser({tel_number: condition.tel_number});
        delete condition.tel_number;
        await ctx.service[`userService`].updateUser(user.uuid, condition, {new: true});
        this.success(user);
    };

    async generatorInviteLink(ctx) {
        this.success(`https://www.beihaozhuan.com/index?inviteCode=${ctx.user.inviteCode}`);
        ctx.app.eventEmitter.emit(`normalMissionCount`, ctx.user._id, `每日邀新人`);
        ctx.app.eventEmitter.emit(`normalMissionCount`, ctx.user._id, `每周邀新人`);
    };

    async getMyTeam(ctx) {
        let [condition, option] = await this.cleanupRequestProperty('userAccountController.myTeamRule',
            'unit', 'page', `uuid`);
        if (!condition) {
            return;
        }
        if (ctx.helper.isEmpty(condition.uuid) || ctx.user.role === `用户`) {
            condition.uuid = ctx.user.uuid;
        }
        let result = await ctx.service[`userService`].getMyTeam(condition.uuid, option);
        this.success(result);
    };

    async getUser(ctx) {
        const {uuid} = ctx.request.body;
        // let [condition,] = await this.cleanupRequestProperty('userAccountController.getManagementUserInfo',
        //     'uuid');
        // if (!condition) {
        //     return;
        // }
        let result = await ctx.service[`userService`].getUser({uuid: uuid}, {uuid: 0, password: 0});
        this.success(result);
    };

    async updateAdmin(ctx) {
        try {
            let [condition,] = await this.cleanupRequestProperty('userAccountController.setAdminRule',
                'uuid', 'tel_number', 'realName', 'role');
            if (!condition) {
                return;
            }
            let user = await ctx.service[`userService`].updateUser(condition.uuid, condition);
            if (ctx.helper.isEmpty(user)) {
                return this.failure(`找不到这个用户`, 404);
            }
            this.success();
        } catch (e) {
            if (e.message.includes(`duplicate`)) {
                return this.failure(`电话号码已经被使用`, 400);
            }
            return this.failure(`服务器忙，请稍后再试`, 500);
        }

    };

    async showMyMoney(ctx) {
        try {
            ctx.app.eventEmitter.emit(`normalMissionCount`, ctx.user._id, `每日晒收入`);
            this.success();
        } catch (e) {
            return this.failure(`服务器忙，请稍后再试`, 500);
        }

    };
}

module.exports = userAccount;