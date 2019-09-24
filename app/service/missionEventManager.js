'use strict';
const EventEmitter = require('events');
const Service = require('egg').Service;

class MissionEventManager extends Service {
    constructor(ctx) {
        super(ctx);
        this.eventEmitter = new EventEmitter();
    };

    async setMissions(missions, missionName) {
        for (const mission of missions) {
            if (mission.completed) {
                continue;
            }
            this.eventEmitter.on(mission.missionEventName, async (userId) => {
                let missionSearcher = {
                    userID: userId,
                    missionID: mission.missionID._id,
                    effectDay: mission.effectDay,
                    missionEventName: mission.missionEventName
                };
                let res = await this.ctx.model[missionName].findOneAndUpdate(missionSearcher,
                    {$inc: {recentAmount: 1}},
                    {new: true});
                if (!res) {
                    this.ctx.throw(400, `initMissionEventManager Error`)
                }
            });
        }

    };

    async getAndInitMissionEvent(user) {
console.log(this.eventEmitter.eventNames().length === 0)
        console.log(this.ctx.helper.isEmpty(this.eventEmitter.eventNames()))
        if (this.ctx.helper.isEmpty(this.eventEmitter.eventNames()) || this.eventEmitter.eventNames().length === 0) {
            let dailyMissions = await this.ctx.service.missionProcessingTrackerService.getUserDailyMissionProcessing(user._id);
            await this.setMissions(dailyMissions, `DailyMissionProcessingTracker`);

            let permanentMission = await this.ctx.service.missionProcessingTrackerService.getUserPermanentMissionProcessing(user._id);
            await this.setMissions(permanentMission, `PermanentMissionProcessingTracker`);

            let weeklyMission = await this.ctx.service.missionProcessingTrackerService.getUserWeeklyMissionProcessing(user._id);
            await this.setMissions(weeklyMission, `WeeklyMissionProcessingTracker`);
        } else {
            console.log(`do nothing`)
        }

        return this.eventEmitter;
    };

    async getEventEmitter() {
        return this.eventEmitter;
    }
}

module.exports = MissionEventManager;
