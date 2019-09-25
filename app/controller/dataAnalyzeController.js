'use strict';
const Controller = require('./baseController');

class dataAnalyzeController extends Controller {

    async recordBcoinChange(ctx) {
        const {amount, reason} = ctx.request.body;
        let result = await ctx.service.analyzeService.recordBcoinChange(ctx.user._id, amount, reason);
        this.success(result);
    }

    async countByFall(ctx) {
        const [condition,] = await this.cleanupRequestProperty('dataAnalyzeRules.countByRule',
            `by`, `period`);
        if (!condition) {
            return;
        }
        let result;
        switch (condition.period) {
            case `day`:
                result = await ctx.service.analyzeService.countByHours(condition.by);
                break;
            case `month`:
                result = await ctx.service.analyzeService.countByDays(condition.by);
                break;
            case `full`:
                result = await ctx.service.analyzeService.countByMonth(condition.by);
                break;
        }

        this.success(result)
    };


}

module.exports = dataAnalyzeController;