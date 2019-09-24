'use strict';
const Controller = require('./baseController');

class dataAnalyzeController extends Controller {

    async recordBcoinChange(ctx) {
        const {amount, reason} = ctx.request.body;
        let result = await ctx.service.analyzeService.recordBcoinChange(ctx.user._id, amount, reason);
        this.success(result);
    }

    async recordBcoinChange(ctx) {
        const {amount, reason} = ctx.request.body;

        let result = await ctx.service.analyzeService.recordBcoinChange(ctx.user._id, amount, reason);
        this.success(result);

    }


}

module.exports = dataAnalyzeController;