'use strict';
// let ms = require('ms');
// let moment = require('moment');
const Controller = require('./baseController');

class missionController extends Controller {
    async createMission(ctx) {
        const {missionObj} = this.cleanupRequestProperty('missionRule',
            `missionType`, `title`, `requireAmount`, `reward`, `eventName`);
        if (!missionObj) {
            return;
        }
        let missionEntity = {
            missionType: missionObj.missionType,
            title: missionObj.title,
            requireAmount: missionObj.requireAmount,
            reward: missionObj.reward,
            UUid: require('cuid')(),
            eventName: missionObj.eventName
        };
        if (ctx.request.files) {
            const file = ctx.request.files[0];
            missionEntity.avatar = await ctx.service.picService.putImgs(file);
        }
        let mission = await ctx.service.missionService.createMission(missionEntity);
        return this.success(mission)
    }
}

module.exports = missionController;