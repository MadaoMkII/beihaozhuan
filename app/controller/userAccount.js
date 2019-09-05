`use strict`;
const baseController = require(`../controller/baseController`);
class userAccount extends baseController {

    async getUserInfo(ctx) {
        let userObj = ctx.user;
        let newUser = await ctx.service.userService.initialLoginUser(userObj);
        await ctx.service.missionEventManager.initMissionEventManager(ctx.user);

       let event =  await ctx.service.missionEventManager.getEventEmitter();





        this.success(userObj);
    };

    async getUserBalanceList(ctx) {
        const [condition, option] = await this.cleanupRequestProperty('userAccountController.getUserBalanceListRule',
            `unit`, `page`, `userUUid`);
        if (condition !== false) {
            let result = await ctx.service.userService.getUserBalanceListRule(condition, option);
            this.success(result);
        }
    };

    async updateUserPassword(ctx) {

        if (ctx.helper.isEmpty(ctx.session.fdbsmsVerified) || ctx.session.fdbsmsVerified === false) {
            return this.failure(`need successfully verify first`, 400)
        }
        const tel_number = ctx.session.tel_number;
        const {password} = ctx.request.body;
        const validateResult = await ctx.validate('authRules.loginRule', {tel_number, password});
        if (!validateResult) return;
        let encryptedPassword = ctx.helper.passwordEncrypt(password);
        await ctx.service.userService.updateUserPassword(tel_number, encryptedPassword);
        ctx.session.tel_number = null;
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
            ossUrl = await ctx.service.picService.putImgs(file);
            condition.avatar = ossUrl;
        }
        const newUser_result = await this.ctx.service.userService.updateUser(ctx.user.uuid, condition);
        this.success(newUser_result);
    };

    async getManyUser(ctx) {
        //let result = await ctx.service.userService.getManyUser(condition, option);
        const [condition, option] = await this.cleanupRequestProperty('userAccountController.findUsersRule',
            `tel_number`, `hasPaid`, `nickName`, `activity`, `hasVerifyWechat`, 'unit', 'page');
        if (condition !== false) {
            this.deepCleanUp(condition, `userStatus`, `activity`, `hasPaid`, `hasVerifyWechat`);
            // let condition = cleanupResult[0];
            // let option = cleanupResult[1];
            let [result, count] = await this.ctx.service.userService.getManyUser(condition,
                option, {Bcoins: 1, tel_number: 1, loginTimes: 1, nickName: 1, avatar: 1, userStatus: 1});
            this.success(result);
            ctx.body = Object.assign(ctx.body, {count: count});
        }
    };

    async getManagementUserInfo(ctx) {
        const {role} = ctx.request.body;
        let [condition, option] = await this.cleanupRequestProperty('userAccountController.getManagementUserInfo', `role`, 'unit', 'page');
        if (ctx.helper.isEmpty(role)) {
            condition = {role: {$in: [`Super_Admin`, `Admin`]}};
        }
        let newUser = await ctx.service.userService.getManyUser(condition, option, {
            role: 1,
            tel_number: 1,
            nickName: 1,
            updated_at: 1,
            userStatus: 1,
            Bcoins: 1
        });
        this.success(newUser);
    };

    async setUserStatus(ctx) {
        let [condition,] = await this.cleanupRequestProperty('userAccountController.getManagementUserInfo',
            'activity', 'uuid');
        await ctx.service.userService.updateUser(condition.uuid, {"userStatus.activity": condition.activity});
        this.success();
    };

    async setUserRole(ctx) {
        let [condition,] = await this.cleanupRequestProperty('userAccountController.getManagementUserInfo',
            'role', 'uuid');

        await ctx.service.userService.updateUser(condition.role, condition.uuid);
        this.success();
    };

    async getUser(ctx) {
        let [condition,] = await this.cleanupRequestProperty('userAccountController.getManagementUserInfo',
            'uuid');
        let result = await ctx.service.userService.getUser({uuid: condition.uuid}, {uuid: 0, password: 0});
        this.success(result);
    };
}

module.exports = userAccount;