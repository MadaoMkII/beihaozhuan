`use strict`;
const baseController = require(`../controller/baseController`);

class userAccount extends baseController {

    async getUserInfo(ctx) {
        const user = await this.ctx.service.userService.tryUser();
        this.success(user);
    };


}

module.exports = userAccount;