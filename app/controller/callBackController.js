'use strict';

const {Controller} = require('egg');

class callBackController extends Controller {
    async getCallBackInfo(ctx) {
        console.log(ctx.request.query)
        this.success();
    }
}


module.exports = callBackController;