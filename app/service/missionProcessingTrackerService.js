'use strict';
const Service = require('egg').Service;
require(`../model/mission`);

class MissionEventManager extends Service {

    async completeMission(modelName, userID, missionEventName) {
        let effectDay = {};
        switch (modelName) {
            case `Permanent`:
                effectDay = `Permanent`;
                break;
            case `Daily`:
                effectDay = this.ctx.app[`getFormatDate`](new Date());
                break;
            case `Weekly`:
                effectDay = this.ctx.app[`getFormatWeek`](new Date());
                break;
        }
        let fullModelName = modelName + `MissionProcessingTracker`;
        let missionTracker = await this.ctx.model[fullModelName].findOne({
            userID: userID,
            missionEventName: missionEventName,
            completed: false,
            effectDay: effectDay
        });
        if (this.ctx.helper.isEmpty(missionTracker)) {
            this.ctx.throw(`missionTracker type wrong`);
        }
        if (missionTracker.recentAmount >= missionTracker.requireAmount) {
            return this.ctx.model[fullModelName].findOneAndUpdate({
                userID: userID,
                missionEventName: missionEventName,
                completed: false,
                effectDay: effectDay
            }, {$set: {completed: true}}, {new: true});
        } else {
            this.ctx.throw(400, `Already complete`);
        }
    }


    async getUserDailyMissionProcessing(user_ID) {

        return this.ctx.model.DailyMissionProcessingTracker.find({
            userID: user_ID,
            effectDay: this.ctx.app[`getFormatDate`]()
        }).populate({path: `missionID`, model: this.ctx.model.Mission});
    }

    async getUserWeeklyMissionProcessing(user_ID) {

        return this.ctx.model.WeeklyMissionProcessingTracker.find({
            userID: user_ID,
            effectDay: this.ctx.app[`getFormatWeek`]()
        }).populate({path: `missionID`, model: this.ctx.model.Mission});
    }

    async getUserPermanentMissionProcessing(user_ID) {

        return this.ctx.model.PermanentMissionProcessingTracker.find({
            userID: user_ID,
            effectDay: `Permanent`
        }).populate({path: `missionID`, model: this.ctx.model.Mission});
    }

    async requireMissionToTrack() {
        return this.ctx.model.Mission.aggregate([
            {$group: {_id: "$missionType", missions: {$push: "$$ROOT"}}}, {
                $project: {
                    // "missions._id": 0,
                    "missions.created_at": 0,
                    "missions.updated_at": 0,
                    "missions.__v": 0
                }
            }
        ]);
    }
}

module.exports = MissionEventManager;