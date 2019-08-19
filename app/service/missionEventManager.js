'use strict';
const EventEmitter = require('events');
const Service = require('egg').Service;

class MissionEventManager extends Service {
    constructor(ctx) {
        super(ctx);
        this.eventEmitter = new EventEmitter();
        this.eventEmitter.on(`checkAD`, this.checkAd);
    };
    async create(missionObj, ctx) {};
    async checkAd(missionObj, ctx) {
        const {title, user_id} = missionObj;
        let res = await ctx.model.MissionTracker.findOneAndUpdate({user_id: user_id, title: title}, {
                $inc: {recentAmount: 1}
            },
            {new: true});
        //let res = await ctx.model.MissionTracker.findOne({user_id: user_id, title: title});
    };

    async getEventEmitter() {
        return this.eventEmitter;
    }
}

module.exports = MissionEventManager;
