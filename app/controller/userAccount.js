`use strict`;
const baseController = require(`../controller/baseController`);

class userAccount extends baseController {

    async getUserInfo(ctx) {
        //const user = await this.ctx.service.userService.tryUser();
        this.success(ctx.user);
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
            ossUrl =await ctx.service.picService.putImgs(file);
            newUser.avatar = ossUrl;
        }
        const newUser_result = await this.ctx.service.userService.updateUser(ctx.user.uuid, newUser);
        //ctx.user = user;
        this.success(newUser_result);
    };

    async getAll(ctx) {
        const user = await ctx.service.userService.getAllUser();
        this.success(user);
    };

}

module.exports = userAccount;