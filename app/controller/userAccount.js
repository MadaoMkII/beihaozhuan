`use strict`;
const baseController = require(`../controller/baseController`);

class userAccount extends baseController {

    async getUserInfo(ctx) {
        this.success(ctx.user);
    };

}

module.exports = userAccount;