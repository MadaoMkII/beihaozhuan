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
// {
//     sign: 'CD17A9E2F180A9E0DC08F4B1AF833898BCAA879B8E603A880F9967911C30A276D84095C1C4A8E251A4D0C6D963B632FBEC2257A334FE907A3E0CF3B9AFBC81355DE6015D3F3DB030C9FAC8CD851BD601689E3DF8E26BFF1CF0C067D5EB2BE88D',
//     uuid: 'ADVck0xmzcbt0000fkufflkyftal',
//     userUUid: 'ck0s0q0xd0000q4ufff2d90e0',
//     timeStamp: '1569324531534'
// }
    async checkAdvertisement(ctx) {
        const [advertisement,] = await this.cleanupRequestProperty('advertisementRules.checkAdvRule',
            `sign`, `uuid`, `userUUid`, `timeStamp`);
        if (!advertisement) {
            return;
        }

        let advertisementObj = await ctx.service[`advertisementService`].getOneAdvertisement({uuid: advertisement.uuid});

        let promise_1 = ctx.service[`analyzeService`].recordAdvIncrease(ctx.user._id, ctx.user._id, 1);
        let promise_2 = ctx.service[`analyzeService`].dataIncrementRecord(`看广告`, advertisementObj.reward, `bcoin`);
        let promise_3 = ctx.service[`userService`].setUserBcionChange(ctx.user.uuid, `观看广告`, `获得`, advertisementObj.reward);

        this.success();
        Promise.all([promise_1, promise_2, promise_3]).catch((error) => {
            console.log(error)
        });
    }

    async checkFinishAdvertisement(ctx) {
        const [advertisement,] = await this.cleanupRequestProperty('advertisementRules.checkAdvRule',
            `sign`, `uuid`, `userUUid`, `timeStamp`);
        if (!advertisement) {
            return;
        }
        let advertisementObj = await ctx.service[`advertisementService`].getOneAdvertisement({uuid: advertisement.uuid});

        let promise_1 = ctx.service[`analyzeService`].recordAdvIncrease(ctx.user._id, ctx.user._id, 1);

        let promise_2 = ctx.service[`analyzeService`].dataIncrementRecord(`广告视频播放完成`,
            advertisementObj.reward, `bcoin`);

        let promise_3 = ctx.service[`userService`].setUserBcionChange(ctx.user.uuid, `观看广告视频完成`,
            `获得`, advertisementObj.reward);
        this.success();
        Promise.all([promise_1, promise_2, promise_3]).catch((error) => {
            console.log(error)
        });
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
            `title`, `positionName`, `source`, `reward`, `activity`, "height", "width", "amount");
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
            `title`, `positionName`, `source`, `activity`, "height", "width", "uuid");
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
        const {positionName} = ctx.request.body;
        if (ctx.helper.isEmpty(positionName)) {
            return this.failure(`positionName必须不为空`, 400);
        }
        let result = await ctx.service[`advertisementService`].getAdvertisementByPosition(positionName);

        if (result.length <= 0) {
            return this.success();
        }
        if (positionName === `任务频道`) {
            return this.success(result);
        } else {
            this.success({advertisements: result[0].advertisements, height: result[0].height, width: result[0].width});
        }

    }
}

module.exports = advertisementController;