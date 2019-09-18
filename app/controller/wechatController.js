`use strict`;
const baseController = require(`../controller/baseController`);

class wechatController extends baseController {

    async callback(ctx) {
        console.log(ctx.request)
        this.success();
    }
}

module.exports = wechatController;