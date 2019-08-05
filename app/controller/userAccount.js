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
        //const user = await this.ctx.service.userService.updateUser(newUser);
        //ctx.user = user;
        this.success(newUser);
    };

    async getAll(ctx) {
        const user = await ctx.service.userService.getAllUser();
        this.success(user);
    };

}

module.exports = userAccount;