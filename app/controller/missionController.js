'use strict';
// let ms = require('ms');
// let moment = require('moment');
const Controller = require('./baseController');

class missionController extends Controller {
    async createMission(ctx) {
        const [missionObj] = await this.cleanupRequestProperty('missionRule',
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

    async updateMission(ctx) {
        const [condition] = await this.cleanupRequestProperty('missionRules.updateMissionRule',
            `requireAmount`, `reward`, `title`, `missionType`);
        if (condition !== false) {
            if (ctx.request.files) {
                const file = ctx.request.files[0];
                condition.avatar = await ctx.service.picService.putImgs(file);
            }
            let result = await ctx.service.missionService.updateMission(condition);
            this.success(result);
        }
    }

    async getMissions(ctx) {
        const [condition, option] = await this.cleanupRequestProperty('missionRules.getMissionRule', `unit`, `page`, `title`);
        if (condition !== false) {
            let result = await ctx.service.missionService.getMission(condition, option);
            this.success(result);
        }
    }
}

module.exports = missionController;