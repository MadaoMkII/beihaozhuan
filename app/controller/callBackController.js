'use strict';

const Controller = require('./baseController');

class callBackController extends Controller {
    async getCallBackInfo(ctx) {
        console.log(`we are here`)
        console.log(ctx.request.query)
        this.success();
    }
}


module.exports = callBackController;