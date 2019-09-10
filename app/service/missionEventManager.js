'use strict';
const EventEmitter = require('events');
const Service = require('egg').Service;

class MissionEventManager extends Service {
    constructor(ctx) {
        super(ctx);
        this.eventEmitter = new EventEmitter();
    };

    async getAndInitMissionEvent(user) {
        if (this.ctx.helper.isEmpty(this.eventEmitter.eventNames()) || this.eventEmitter.eventNames().length === 0) {
            let dailyMissions = await this.ctx.service.missionProcessingTrackerService.getUserDailyMissionProcessing(user._id);
            for (const mission of dailyMissions) {
                this.eventEmitter.on(mission.missionEventName, async (userId) => {
                    let missionSearcher = {
                        userID: userId,
                        missionID: mission.missionID._id,
                        effectDay: mission.effectDay,
                        missionEventName: mission.missionEventName
                    };
                    let res = await this.ctx.model.DailyMissionProcessingTracker.findOneAndUpdate(missionSearcher,
                        {$inc: {recentAmount: 1}},
                        {new: true});
                    if (!res) {
                        this.ctx.throw(400, `initMissionEventManager Error`)
                    }
                });
            }

            let permanentMission = await this.ctx.service.missionProcessingTrackerService.getUserPermanentMissionProcessing(user._id);
            for (const mission of permanentMission) {
                this.eventEmitter.on(mission.missionEventName, async (userId) => {
                    let missionSearcher = {
                        userID: userId,
                        missionID: mission.missionID._id,
                        effectDay: mission.effectDay,
                        missionEventName: mission.missionEventName
                    };
                    let res = await this.ctx.model.PermanentMissionProcessingTracker.findOneAndUpdate(missionSearcher,
                        {$inc: {recentAmount: 1}},
                        {new: true});
                    if (!res) {
                        this.ctx.throw(400, `initMissionEventManager Error`)
                    }
                });
            }

            let weeklyMission = await this.ctx.service.missionProcessingTrackerService.getUserWeeklyMissionProcessing(user._id);
            for (const mission of weeklyMission) {
                this.eventEmitter.on(mission.missionEventName, async (userId) => {
                    let missionSearcher = {
                        userID: userId,
                        missionID: mission.missionID._id,
                        effectDay: mission.effectDay,
                        missionEventName: mission.missionEventName
                    };
                    let res = await this.ctx.model.WeeklyMissionProcessingTracker.findOneAndUpdate(missionSearcher,
                        {$inc: {recentAmount: 1}},
                        {new: true});
                    if (!res) {
                        this.ctx.throw(400, `initMissionEventManager Error`)
                    }
                });
            }

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
