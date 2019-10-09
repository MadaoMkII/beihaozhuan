'use strict';
const Controller = require('./baseController');

class dataAnalyzeController extends Controller {

    async recordBcoinChange(ctx) {
        const {amount, reason} = ctx.request.body;
        let result = await ctx.service[`analyzeService`].recordBcoinChange(ctx.user._id, amount, reason);
        this.success(result);
    }

    async advDetail(ctx) {
        try {
            const [condition, option] = await this.cleanupRequestProperty('pageAndUnitRule',
                `page`, 'unit', `uuid`, `tel_number`);
            if (!condition) {
                return;
            }
            let result = await ctx.service[`analyzeService`].getAdvDetail(condition, option);
            this.success(result);
        } catch (e) {
            this.app.logger.error(e, ctx);
            this.failure();
        }
    };

    async countAdv(ctx) {
        try {
            const [condition, option] = await this.cleanupRequestProperty('dataAnalyzeRules.countAdvRule',
                `unit`, `page`, `source`);
            if (!condition) {
                return;
            }
            let result = await ctx.service[`analyzeService`].countAdv(option, condition.source);
            this.success(result);
        } catch (e) {
            this.app.logger.error(e, ctx);
            this.failure();
        }
    }

    async countByFall(ctx) {
        try {
            const [condition,] = await this.cleanupRequestProperty('dataAnalyzeRules.countByRule',
                `by`, `period`);
            if (!condition) {
                return;
            }
            let result;
            switch (condition.period) {
                case `day`:
                    result = await ctx.service[`analyzeService`].countByHours(condition.by);
                    break;
                case `month`:
                    result = await ctx.service[`analyzeService`].countByDays(condition.by);
                    break;
                case `full`:
                    result = await ctx.service[`analyzeService`].countByMonth(condition.by);
                    break;
            }
            this.success(result)
        } catch (e) {
            this.app.logger.error(e, ctx);
            this.failure();
        }

    };

    async countAdvForChart(ctx) {
        try {
            let beginDate = {};
            const {period} = ctx.request.query;
            if (!ctx.helper.isEmpty(period)) {
                beginDate = ctx.getDateByPeriod(period);
            } else {
                beginDate = new Date(`2019-08-09`);
            }
            let result = await ctx.service[`analyzeService`].countAdvForChart(beginDate);
            this.success(result);
        } catch (e) {
            this.app.logger.error(e, ctx);
            this.failure();
        }
    }

    async countGoodForChart(ctx) {
        try {
            let beginDate = {};
            const {period} = ctx.request.query;
            if (!ctx.helper.isEmpty(period)) {
                beginDate = ctx.getDateByPeriod(period);
            } else {
                beginDate = new Date(`2019-08-09`);
            }
            let result = await ctx.service[`analyzeService`].countGoodForChart(beginDate);
            this.success(result)
        } catch (e) {
            this.app.logger.error(e, ctx);
            this.failure();
        }
    }
}

module.exports = dataAnalyzeController;