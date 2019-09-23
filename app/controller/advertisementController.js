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

    async createAdvertisement(ctx) {

        const [advertisement,] = await this.cleanupRequestProperty('advertisementRules.createAdvertisementRule',
            `title`, `positionName`, `source`, `reward`, `activity`, "length", "width");
        if (!advertisement) {
            return;
        }
        const files = ctx.request.files;
        if (!ctx.helper.isEmpty(files)) {
            advertisement.mainlyShowPicUrl = await ctx.service.picService.putImgs(files[0]);
        }
        let result = ctx.service.advertisementService.createAdvertisement(advertisement);
        this.success(result);
        await result;
    }
}

module.exports = advertisementController;