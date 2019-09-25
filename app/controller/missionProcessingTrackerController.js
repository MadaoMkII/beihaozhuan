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
        let result = await this.service[`missionProcessingTrackerService`].getUserPermanentMissionProcessing(ctx.user._id);
        this.success([result, result.length]);
    };

    async completeMission(ctx) {
        try {
            const [condition] = await this.cleanupRequestProperty('missionRules.completeMissionRule',
                `modelName`, `missionEventName`);
            if (!condition) {
                return;
            }
            await this.service[`missionProcessingTrackerService`].completeMission(condition.modelName,
                ctx.user._id, condition.missionEventName);
            this.success();
        } catch (e) {
            this.failure(e.message);
        }

    }
}

module.exports = missionProcessingTrackerController;