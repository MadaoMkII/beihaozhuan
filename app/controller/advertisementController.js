'use strict';
const Controller = require('./baseController');

class advertisementController extends Controller {

    async checkAdvertisement(ctx) {

        const [advertisement,] = await this.cleanupRequestProperty('advertisementRules.checkAdvRule',
            `sign`, `uuid`, `userUUid`, `timeStamp`);
        if (!advertisement) {
            return;
        }

        let promiseArray = [];
        let advertisementObj = await ctx.service[`advertisementService`].getOneAdvertisement({uuid: advertisement.uuid});
        if (ctx.helper.isEmpty(advertisementObj)) {
            return this.failure(`找不到目标广告`, 4041, 400);
        }
        let promise_1 = ctx.service[`analyzeService`].recordAdvIncrease(advertisementObj._id, ctx.user._id, 1);
        promiseArray.push(promise_1);

        //ctx.app.eventEmitter.emit(`normalMissionCount`, ctx.user._id, `邀请新人加入`);
        this.success();
        Promise.all(promiseArray).catch((error) => {
            console.log(error)
        });
    }

    async checkFinishAdvertisement(ctx) {
        const [advertisement,] = await this.cleanupRequestProperty('advertisementRules.checkAdvRule',
            `sign`, `uuid`, `userUUid`, `timeStamp`);
        if (!advertisement) {
            return;
        }
        let promiseArray = [];
        let userObj = ctx.user;
        let advertisementObj = await ctx.service[`advertisementService`].getOneAdvertisement({uuid: advertisement.uuid});
        if (ctx.helper.isEmpty(advertisementObj)) {
            return this.failure(`找不到目标广告`, 4041, 400);
        }
        let promise_1 = ctx.service[`analyzeService`].recordAdvIncrease(advertisementObj._id, userObj._id, 1,
            `close`);
        let promise_2 = ctx.service[`analyzeService`].dataIncrementRecord(`广告收入`,
            advertisementObj.reward, `bcoin`);
        let promise_3 = ctx.service[`userService`].setUserBcionChange(userObj.uuid, `广告收入`,
            `获得`, advertisementObj.reward);
        let newBcoin = Number(ctx.user.Bcoins) + Number(advertisementObj.reward);
        let promise_4 = ctx.service[`userService`].changeBcoin(ctx.user._id, newBcoin + ``);
        ctx.app.eventEmitter.emit(`normalMissionCount`, ctx.user._id, `看一个广告`);
        ctx.app.eventEmitter.emit(`normalMissionCount`, ctx.user._id, `每周看广告`);
        ctx.app.eventEmitter.emit(`normalMissionCount`, ctx.user._id, `每日看广告`);
        ctx.app.eventEmitter.emit(`normalMissionCount`, ctx.user._id, `每日看广告_高级`);
        //ctx.app.eventEmitter.emit(`normalMissionCount`, ctx.user._id, `看一些广告`); //以后需要动态配置 任务没有开启不需要监听器
        promiseArray.push(promise_1, promise_2, promise_3, promise_4);
        this.success();

        Promise.all(promiseArray).catch((error) => {
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

        const [advertisement,] = await this.cleanupRequestProperty('advertisementRules.updateAdvertisementRule',
            `title`, `positionName`, `source`, `activity`, "height", "width", "uuid", `reward`);
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