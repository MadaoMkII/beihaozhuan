`use strict`;
const baseController = require(`../controller/baseController`);

class userAccount extends baseController {

    async getUserInfo(ctx) {
        const eventEmitter = await this.ctx.service.missionEventManager.getEventEmitter();
        let newUser = await ctx.service.userService.initialLoginUser(ctx.user);
        this.success(newUser);
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
        const {nickName, avatar, gender, birthday, location, job, educationLevel} = ctx.request.body;
        const newUser = {nickName, avatar, gender, birthday, location, job, educationLevel};
        const validateResult = await ctx.validate('updateUser', {gender});
        if (!validateResult) {
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

    // async getAll(ctx) {
    //     const user = await ctx.service.userService.getAllUser();
    //     this.success(user);
    // };

}

module.exports = userAccount;