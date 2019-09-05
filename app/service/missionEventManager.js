'use strict';
const EventEmitter = require('events');
const Service = require('egg').Service;

class MissionEventManager extends Service {
    constructor(ctx) {
        super(ctx);
        this.eventEmitter = new EventEmitter();


    };

    async initMissionEventManager(user) {
        let dailyMissions = await this.ctx.service.missionProcessingTrackerService.getUserDailyMissionProcessing(user._id);
        if (this.ctx.helper.isEmpty(this.eventEmitter.eventNames()) || this.eventEmitter.eventNames().length === 0) {
            dailyMissions.forEach(async (mission) => {
                this.eventEmitter.on(mission.missionEventName, async (userId) => {
                    let missionSearcher = {
                        userID: userId,
                        missionID: mission.missionID._id,
                        effectDay: this.ctx.app.getFormatDate(),
                        missionEventName: mission.missionEventName
                    };

                    let res = await this.ctx.model.DailyMissionProcessingTracker.findOneAndUpdate(missionSearcher,
                        {$inc: {recentAmount: 1}},
                        {new: true});
                    if (!res) {
                        this.ctx.throw(400, `ADV`)
                    }
                });
            });
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
