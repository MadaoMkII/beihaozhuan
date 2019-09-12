'use strict';
// let ms = require('ms');
// let moment = require('moment');
const Controller = require('./baseController');

class missionController extends Controller {
    async createMission(ctx) {
        try {
            const [missionObj] = await this.cleanupRequestProperty('missionRules.missionRule',
                `missionType`, `title`, `requireAmount`, `reward`);
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
            if (!ctx.helper.isEmpty(ctx.request.files)) {
                const file = ctx.request.files[0];
                missionEntity.avatar = await ctx.service.picService.putImgs(file);
            }
            let mission = await ctx.service.missionService.createMission(missionEntity);
            return this.success(mission)
        } catch (e) {
            this.failure(e.message)
        }

    }

    async setMissionStatus(ctx) {
        const [condition] = await this.cleanupRequestProperty('commonRules.statusRule',
            `uuid`, `status`);
        if (condition === false) {
            return;
        }
        if (!ctx.helper.isEmpty(ctx.request.files)) {
            const file = ctx.request.files[0];
            condition.avatar = await ctx.service.picService.putImgs(file);
        }
        let result = await ctx.service.missionService.setMissionStatus(condition);
        this.success(result);
    };

    async updateMission(ctx) {
        const [condition] = await this.cleanupRequestProperty('missionRules.updateMissionRule',
            `requireAmount`, `reward`, `title`, `uuid`);
        if (condition !== false) {
            if (!ctx.helper.isEmpty(ctx.request.files)) {
                const file = ctx.request.files[0];
                condition.imgUrl = await ctx.service.picService.putImgs(file);
            }
            let result = await ctx.service.missionService.updateMission(condition);
            this.success(result);
        }
    }

    async getMissions(ctx) {
        const [condition, option] = await this.cleanupRequestProperty('missionRules.getMissionRule',
            `title`, `missionType`,`unit`,`page`);//`unit`, `page`,
        if (condition !== false) {
            if (!ctx.helper.isEmpty(condition.title)) {
                condition.title = {$regex: `.*${condition.title}.*`};
            }
            let result = await ctx.service.missionService.getMission(condition, option);
            this.success(result);
        }
    }

    async checkMissions(ctx) {
        let result = await ctx.service.missionProcessingTrackerService.requireMissionToTrack(ctx.user._id);
        this.success(result);
    }
}

module.exports = missionController;