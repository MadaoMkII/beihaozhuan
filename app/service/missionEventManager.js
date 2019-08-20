'use strict';
const EventEmitter = require('events');
const Service = require('egg').Service;

class MissionEventManager extends Service {
    constructor(ctx) {
        super(ctx);
        this.eventEmitter = new EventEmitter();
        this.eventEmitter.on(`checkAD`, MissionEventManager.checkAd);
    };

    async create(missionObj, ctx) {

    };

    static async checkAd(missionObj, ctx) {
        let res = await ctx.model.MissionProcessingTracker.findOneAndUpdate(missionObj, {
                $inc: {recentAmount: 1}
            },
            {new: true});
        if(!res){ctx.throw(400,`ADV`)}
        //let res = await ctx.model.MissionTracker.findOne({user_id: user_id, title: title});
    };

    async getEventEmitter() {
        return this.eventEmitter;
    }
}

module.exports = MissionEventManager;
