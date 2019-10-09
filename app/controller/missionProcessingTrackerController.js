`use strict`;
const baseController = require(`../controller/baseController`);

class missionProcessingTrackerController extends baseController {
    async getUserWeeklyMissionProcessing(ctx) {
        try {
            let result = await this.service[`missionProcessingTrackerService`].getUserWeeklyMissionProcessing(ctx.user._id);
            this.success([result, result.length]);
        } catch (e) {
            this.app.logger.error(e, ctx);
            this.failure();
        }
    };

    async getUserDailyMissionProcessing(ctx) {
        try {
            let result = await this.service[`missionProcessingTrackerService`].getUserDailyMissionProcessing(ctx.user._id);
            this.success([result, result.length]);
        } catch (e) {
            this.app.logger.error(e, ctx);
            this.failure();
        }
    };

    async getUserPermanentMissionProcessing(ctx) {
        try {
            const {status} = ctx.request.query;
            let result = await this.service[`missionProcessingTrackerService`].getUserPermanentMissionProcessing(ctx.user._id, status);
            this.success([result, result.length]);
        } catch (e) {
            this.app.logger.error(e, ctx);
            this.failure();
        }
    };

    async completeMission(ctx) {
        try {
            const [condition] = await this.cleanupRequestProperty('missionRules.completeMissionRule',
                `modelName`, `missionEventName`);
            if (!condition) {
                return;
            }

            let promise_1 = this.ctx.service[`missionProcessingTrackerService`].completeMission(condition.modelName,
                ctx.user._id, condition.missionEventName);
            let amount = this.ctx.service[`missionService`].getMission({title: condition.missionEventName});
            let promise_3 = this.ctx.service[`userService`].setUserBcionChange(ctx.user.uuid, condition.missionEventName, `获得`, amount);
            this.success();

            Promise.all([promise_1, amount, promise_3]).then(function (values) {
            }).catch(function (error) {
                ctx.throw(503, error);
            })
        } catch (e) {
            this.app.logger.error(e, ctx);
            this.failure();
        }
    };
}

module.exports = missionProcessingTrackerController;