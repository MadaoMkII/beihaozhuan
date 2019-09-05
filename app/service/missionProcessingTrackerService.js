'use strict';
const Service = require('egg').Service;
require(`../model/mission`);

class MissionEventManager extends Service {

    async getUserDailyMissionProcessing(user_ID) {

        return this.ctx.model.DailyMissionProcessingTracker.find({
            userID: user_ID,
            effectDay: this.ctx.app.getFormatDate()
        })
            .populate({path: `missionID`, model: this.ctx.model.Mission});
    }

    async requireMissionToTrack() {
        return await this.ctx.model.Mission.aggregate([
            {$group: {_id: "$missionType", missions: {$push: "$$ROOT"}}}, {
                $project: {
                    // "missions._id": 0,
                    "missions.created_at": 0,
                    "missions.updated_at": 0,
                    "missions.__v": 0
                }
            }
        ]);
        // missionsAgg.find((missionArray) => {
        //     if ([`Weekly`, `Daily`, `Permanent`].includes(missionArray._id)) {
        //         missionArray.missions.forEach(async (mission) => {
        //             let conditions = {
        //                 userID: user_ID,
        //                 missionID: mission._id,
        //                 missionEventName: mission.title
        //             };
        //
        //             let modelName = missionArray._id + `MissionProcessingTracker`;
        //             let weeklyTracker = await this.ctx.model[modelName].findOne(conditions);
        //             if (!weeklyTracker) {
        //                 let missionTracker = new this.ctx.model[modelName](conditions);
        //                 missionTracker.save();
        //             }
        //         });
        //     }
        //
        // });

    }

}

module.exports = MissionEventManager;