`use strict`;
const baseController = require(`../controller/baseController`);

class missionProcessingTrackerController extends baseController {
    async getUserMissionProcessing(ctx) {
        let result = await this.service.missionProcessingTrackerService.getUserDailyMissionProcessing(ctx.user._id);
        this.success(result);
    }
}

module.exports = missionProcessingTrackerController;