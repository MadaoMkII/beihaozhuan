`use strict`;
const baseController = require(`../controller/baseController`);

class userAccount extends baseController {

    async getUserInfo(ctx) {
        let newUser = await ctx.service.userService.initialLoginUser(ctx.user);
        this.success(newUser);
    };

    async getUserBalanceList(ctx) {
        const [condition, option] = await this.cleanupRequestProperty('userAccountController.getUserBalanceListRule', `unit`, `page`, `userUUid`);
        if (condition !== false) {
            let result = await this.ctx.service.userService.getUserBalanceListRule(condition, option);
            this.success(result);
        }
    };

    async updateUserPassword(ctx) {

        if (ctx.helper.isEmpty(ctx.session.fdbsmsVerified) || ctx.session.fdbsmsVerified === false) {
            return this.failure(`need successfully verify first`, 400)
        }
        const tel_number = ctx.session.tel_number;
        const {password} = ctx.request.body;
        const validateResult = await ctx.validate('loginRule', {tel_number, password});
        if (!validateResult) return;
        let encryptedPassword = ctx.helper.passwordEncrypt(password);
        await ctx.service.userService.updateUserPassword(tel_number, encryptedPassword);
        ctx.session.tel_number = null;
        this.success();
    };

    async updateUserInfo(ctx) {

        const {newUser} = this.cleanupRequestProperty('updateUser',
            `nickName`, `avatar`, `gender`, `birthday`, `location`, 'job', 'educationLevel');
        if (!newUser) {
            return;
        }
        const file = ctx.request.files[0];
        let ossUrl;
        if (file) {
            ossUrl = await ctx.service.picService.putImgs(file);
            newUser.avatar = ossUrl;
        }
        const newUser_result = await this.ctx.service.userService.updateUser(ctx.user.uuid, newUser);
        ctx.user = newUser_result;
        this.success(newUser_result);
    };

    async getManyUser() {
        //s

        //let result = await ctx.service.userService.getManyUser(condition, option);
        const [condition, option] = await this.cleanupRequestProperty('findUsersRule',
            `tel_number`, `hasPaid`, `nickName`, `activity`, `hasVerifyWechat`, 'unit', 'page');
        if (condition !== false) {
            this.deepCleanUp(condition, `userStatus`, `activity`, `hasPaid`, `hasVerifyWechat`);
            console.log(condition)
            // let condition = cleanupResult[0];
            // let option = cleanupResult[1];
            let result = await this.ctx.service.userService.getManyUser(condition, option);
            this.success(result);
        }
    };

}

module.exports = userAccount;