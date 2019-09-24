'use strict';
const Controller = require('./baseController');

class advertisementController extends Controller {

    // async createAD(ctx) {
    //     let uuid = require('cuid')();
    //     let mission = this.ctx.model.MissionTracker({
    //         missionType: "ADV",
    //         requireAmount: 10,
    //         recentAmount: 1,
    //         title: `testing`,
    //         imgUrl: `https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2642058357,3579319704&fm=179&app=42&f=JPEG?w=320&h=160`,
    //         good_id: null,
    //         missionUUid: uuid,
    //         user_id: ctx.user._id
    //     });
    //     mission.save();
    //     this.success(mission)
    // };

    async checkAD(ctx) {

        let {eventName} = ctx.query;
        this.success();
        const eventEmitter = await ctx.service.missionEventManager.getAndInitMissionEvent(ctx.user);
        eventEmitter.emit(eventName,
            ctx.user._id);
        console.log(eventEmitter.eventNames())

    }

    async deleteAdvertisement(ctx) {
        const {uuid} = ctx.request.body;
        if (ctx.helper.isEmpty(uuid)) {
            return this.success({object: `uuid 必须填写`}, 200);
        }
        let result = ctx.service.advertisementService.deleteAdvertisement(uuid);
        this.success(result);
        await result;
    };

    async createAdvertisement(ctx) {

        const [advertisement,] = await this.cleanupRequestProperty('advertisementRules.createAdvertisementRule',
            `title`, `positionName`, `source`, `reward`, `activity`, "length", "width", "amount");
        if (!advertisement) {
            return;
        }
        const files = ctx.request.files;
        if (!ctx.helper.isEmpty(files) && !ctx.helper.isEmpty(files[0])) {
            let ossUrl = await ctx.service.picService.putImgs(files[0]);
            advertisement.carouselUrl = (ossUrl);
        }
        let result = ctx.service.advertisementService.createAdvertisement(advertisement);
        this.success(result);
        await result;
    }

    async getAdvertisementList(ctx) {
        const [advertisement, options] = await this.cleanupRequestProperty('advertisementRules.getAdvertisementRule',
            `title`, `positionName`, `source`, `activity`, 'unit', 'page');
        if (!advertisement) {
            return;
        }
        let result = await ctx.service.advertisementService.getAdvertisement(advertisement, options);
        let count = await this.getFindModelCount(`Advertisement`, advertisement);
        return this.success([result, count]);
    }

    async updateAdvertisementList(ctx) {
        const [advertisement,] = await this.cleanupRequestProperty('advertisementRules.getAdvertisementRule',
            `title`, `positionName`, `source`, `activity`, "length", "width", "uuid");
        if (!advertisement) {
            return;
        }
        const files = ctx.request.files;
        if (!ctx.helper.isEmpty(files) && !ctx.helper.isEmpty(files[0])) {
            let ossUrl = await ctx.service.picService.putImgs(files[0]);
            advertisement.carouselUrl = (ossUrl);
        }
        let service = ctx.service.advertisementService.updateAdvertisement(advertisement.uuid, advertisement);
        this.success();
        await service;
    }

    async setAdvertisementActivity(ctx) {
        const [condition,] = await this.cleanupRequestProperty('advertisementRules.updateAdvertisementRule',
            `activity`, "uuid");
        if (!condition) {
            return;
        }
        let service = ctx.service.advertisementService.updateAdvertisement(condition.uuid, condition);
        this.success();
        await service;
    }

    async getAdvertisementByPosition(ctx) {
        const [advertisement,] = await this.cleanupRequestProperty('advertisementRules.getAdvertisementRule',
            `positionName`);
        let result = await ctx.service.advertisementService.getAdvertisementByPosition(advertisement.positionName);
        if (result.length <= 0) {
            return this.success();
        }
        this.success(result[0].advertisements);
    }
}

module.exports = advertisementController;