'use strict';
const Service = require('egg').Service;

class MissionEventManager extends Service {

    async getUserMissionProcessing(user_ID) {
        let good = new this.ctx.model.WeeklyMissionProcessingTracker({missionEventName: 'bisheng'});
        good.save();
        return this.ctx.model.MissionProcessingTracker.find({userID: user_ID})
            .populate({path: `missionID`, select: `requireAmount status missionType title`});

    }


}

module.exports = MissionEventManager;