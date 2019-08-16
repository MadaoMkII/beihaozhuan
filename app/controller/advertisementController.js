'use strict';
let ms = require('ms');
let moment = require('moment');
const Controller = require('./baseController');

class advertisementController extends Controller {

    async createAD(ctx) {
        let uuid = require('cuid')();
        let mission = this.ctx.model.MissionTracker({
            missionType: "ADV",
            requireAmount: 10,
            recentAmount: 1,
            title: `testing`,
            imgUrl: `https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2642058357,3579319704&fm=179&app=42&f=JPEG?w=320&h=160`,
            good_id: null,
            missionUUid: uuid,
            user_id: ctx.user._id
        });
        mission.save();
        this.success(mission)
    };

    async checkAD(ctx) {
        const eventEmitter = await ctx.service.missionEventManager.getEventEmitter();
        let re=eventEmitter.emit('checkAD', {title: `testing`, user_id: ctx.user._id}, ctx);
        this.success(re);
    }

}

module.exports = advertisementController;