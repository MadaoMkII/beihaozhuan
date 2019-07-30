`use strict`;
const baseController = require(`../controller/baseController`);

class userAccount extends baseController {

    async getUserInfo(ctx) {
        //const user = await this.ctx.service.userService.tryUser();
console.log(this.ctx.user)
        this.success(ctx.user);
    };


}

module.exports = userAccount;