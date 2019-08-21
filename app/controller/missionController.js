'use strict';
// let ms = require('ms');
// let moment = require('moment');
const Controller = require('./baseController');

class missionController extends Controller {
    async createMission(ctx) {
        const {missionType, title, requireAmount, reward, eventName} = ctx.request.body;
        const validateResult = await ctx.validate('missionRule', {
            missionType,
            title,
            requireAmount,
            reward,
            eventName
        });
        if (!validateResult) return;
        let missionObj = this.ctx.helper.cleanupRequest([`unit`, `page`], {
            missionType,
            title,
            requireAmount,
            reward,
            eventName
        });
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