`use strict`;
const baseController = require(`../controller/baseController`);

class missionProcessingTrackerController extends baseController {
    async getUserWeeklyMissionProcessing(ctx) {

        let result = await this.service[`missionProcessingTrackerService`].getUserWeeklyMissionProcessing(ctx.user._id);
        this.success([result, result.length]);
    };

    async getUserDailyMissionProcessing(ctx) {

        let result = await this.service[`missionProcessingTrackerService`].getUserDailyMissionProcessing(ctx.user._id);
        this.success([result, result.length]);
    };

    async getUserPermanentMissionProcessing(ctx) {
        const {status} = ctx.request.query;
        let result = await this.service[`missionProcessingTrackerService`].getUserPermanentMissionProcessing(ctx.user._id, status);
        this.success([result, result.length]);
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
            }).catch(function (reason) {

            })
        } catch (e) {
            this.failure(e.message);
        }

    }
}

module.exports = missionProcessingTrackerController;