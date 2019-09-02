'use strict';
const Service = require('egg').Service;

class MissionEventManager extends Service {

    async getUserMissionProcessing(user_ID) {
        let good = new this.ctx.model.WeeklyMissionProcessingTracker({missionEventName: 'bisheng'});
        good.save();
        return this.ctx.model.MissionProcessingTracker.find({userID: user_ID})
            .populate({path: `missionID`, select: `requireAmount status missionType title`});

    }

    async requireMissionToTrack(user_ID) {


        let missionsAgg = await this.ctx.model.Mission.aggregate([
            {$group: {_id: "$missionType", missions: {$push: "$$ROOT"}}}, {
                $project: {
                    "missions._id": 0,
                    "missions.created_at": 0,
                    "missions.updated_at": 0,
                    "missions.__v": 0
                }
            }
        ]);
        missionsAgg.find((missionArray) => {
            if ([`Weekly`, `Daily`, `Permanent`].includes(missionArray._id)) {
                missionArray.missions.forEach(async (mission) => {
                    let conditions = {
                        userID: user_ID,
                        missionID: mission._id,
                        missionEventName: mission.title
                    };

                    let modelName = missionArray._id + `MissionProcessingTracker`;
                    let weeklyTracker = await this.ctx.model[modelName].findOne(conditions);
                    if (!weeklyTracker) {
                        let missionTracker = new this.ctx.model[modelName](conditions);
                        missionTracker.save();
                    }
                });
            }

        });
        return missionsAgg;
        // return this.ctx.model.MissionProcessingTracker.find({userID: user_ID})
        //     .populate({path: `missionID`, select: `requireAmount status missionType title`});

    }

}

module.exports = MissionEventManager;