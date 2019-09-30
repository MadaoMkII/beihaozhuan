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
        }).populate({path: `missionID`, model: this.ctx.model.Mission, select: `-_id reward`});
        if (this.ctx.helper.isEmpty(missionTracker)) {
            this.ctx.throw(`missionTracker type wrong`);
        }

        if ((missionTracker.recentAmount >= missionTracker.requireAmount) && !missionTracker.completed) {

            let tempBcoin = Number(this.ctx.user.Bcoins) + Number(missionTracker.missionID.reward);

            let promise_1 = this.ctx.service.userService.changeBcoin(this.ctx.user._id, tempBcoin);

            let promise_2 = this.ctx.service[`analyzeService`].dataIncrementRecord(`完成任务-${missionTracker.missionEventName}`,
                missionTracker.missionID.reward, `bcoin`);
            let promise_3 = this.ctx.service[`userService`].setUserBcionChange(this.ctx.user.uuid, `完成任务-${missionTracker.missionEventName}`,
                `获得`, missionTracker.missionID.reward);

            let promise_4 = this.ctx.model[fullModelName].findOneAndUpdate({
                userID: userID,
                missionEventName: missionEventName,
                completed: false,
                effectDay: effectDay
            }, {$set: {completed: true}}, {new: true});
            Promise.all([promise_1, promise_2, promise_3, promise_4]).catch((e) => {

            });
        } else {
            this.ctx.throw(400, `Already complete`);
        }
    }


    async getUserDailyMissionProcessing(user_ID, status = false) {

        return this.ctx.model.DailyMissionProcessingTracker.find({
            userID: user_ID,
            effectDay: this.ctx.app[`getFormatDate`](),
            completed: status
        }).populate({path: `missionID`, model: this.ctx.model.Mission});
    }

    async getUserWeeklyMissionProcessing(user_ID, status = false) {

        return this.ctx.model.WeeklyMissionProcessingTracker.find({
            userID: user_ID,
            effectDay: this.ctx.app[`getFormatWeek`](),
            completed: status
        }).populate({path: `missionID`, model: this.ctx.model.Mission});
    }

    async getUserPermanentMissionProcessing(user_ID, status = false) {

        return this.ctx.model.PermanentMissionProcessingTracker.find({
            userID: user_ID,
            effectDay: `Permanent`,
            completed: status
        }).populate({path: `missionID`, model: this.ctx.model.Mission});
    }

    async requireMissionToTrack(status) {
        return this.ctx.model.Mission.aggregate([
            {$match: {"status": status}},
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