'use strict';
// let ms = require('ms');
// let moment = require('moment');
const Controller = require('./baseController');

class missionController extends Controller {
    async createMission(ctx) {
        const {missionType, title, requireAmount, reward} = ctx.request.body;
        const validateResult = await ctx.validate('missionRule', {missionType, title, requireAmount, reward});
        if (!validateResult) return;
        let missionObj = {
            missionType: missionType,
            title: title,
            requireAmount: requireAmount,
            reward: reward,
            UUid: require('cuid')(),
            eventName: `defaultEvent`
        };
        if (ctx.request.files) {
            const file = ctx.request.files[0];
            missionObj.avatar = await ctx.service.picService.putImgs(file);
        }
        console.log(missionObj)
        let mission = await ctx.service.missionService.createMission(missionObj);
        return this.success(mission)
    }
}

module.exports = missionController;