'use strict';
const Controller = require('./baseController');

class advertisementController extends Controller {

  async checkAdvertisement(ctx) {
    try {
      const [ advertisement ] = await this.cleanupRequestProperty('advertisementRules.checkAdvRule',
        'sign', 'uuid', 'userUUid', 'timeStamp');
      if (!advertisement) {
        return;
      }

      const promiseArray = [];
      const advertisementObj = await ctx.service.advertisementService.getOneAdvertisement({ uuid: advertisement.uuid });
      if (ctx.helper.isEmpty(advertisementObj)) {
        return this.failure('找不到目标广告', 4041, 400);
      }
      const promise_1 = ctx.service.analyzeService.recordAdvIncrease(advertisementObj._id, ctx.user._id, 1);
      promiseArray.push(promise_1);

      // ctx.app.eventEmitter.emit(`normalMissionCount`, ctx.user._id, `邀请新人加入`);
      this.success();
      Promise.all(promiseArray).catch(error => {
        ctx.throw(500, error);
      });
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }

  }

  async checkFinishAdvertisement(ctx) {
    try {
      const [ advertisement ] = await this.cleanupRequestProperty('advertisementRules.checkAdvRule',
        'sign', 'uuid', 'userUUid', 'timeStamp');
      if (!advertisement) {
        return;
      }
      const promiseArray = [];
      const userObj = ctx.user;
      const advertisementObj = await ctx.service.advertisementService.getOneAdvertisement({ uuid: advertisement.uuid });
      if (ctx.helper.isEmpty(advertisementObj)) {
        return this.failure('找不到目标广告', 4041, 400);
      }
      const promise_1 = ctx.service.analyzeService.recordAdvIncrease(advertisementObj._id, userObj._id, 1,
        'close');
      const promise_2 = ctx.service.analyzeService.dataIncrementRecord('广告收入',
        advertisementObj.reward, 'bcoin');

      const newBcoin = Number(ctx.user.Bcoins) + Number(advertisementObj.reward);
      const promise_3 = ctx.service.userService.setUserBcionChange(userObj.uuid, '广告收入',
        '获得', advertisementObj.reward, newBcoin);

      // const promise_4 = ctx.service.userService.changeBcoin(ctx.user._id, newBcoin + '');
      this.success();

      ctx.app.eventEmitter.emit('normalMissionCount', ctx.user._id, '看一个广告');
      ctx.app.eventEmitter.emit('normalMissionCount', ctx.user._id, '每周看广告');
      ctx.app.eventEmitter.emit('normalMissionCount', ctx.user._id, '每日看广告');
      ctx.app.eventEmitter.emit('normalMissionCount', ctx.user._id, '每日看广告_高级');
      // ctx.app.eventEmitter.emit(`normalMissionCount`, ctx.user._id, `看一些广告`); //以后需要动态配置 任务没有开启不需要监听器
      promiseArray.push(promise_1, promise_2, promise_3);
      Promise.all(promiseArray).catch(error => {
        ctx.throw(500, error);
      });
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }

  }

  async deleteAdvertisement(ctx) {
    try {
      const { uuid } = ctx.request.body;
      if (ctx.helper.isEmpty(uuid)) {
        return this.success({ object: 'uuid 必须填写' }, 200);
      }
      const result = ctx.service.advertisementService.deleteAdvertisement(uuid);
      this.success();
      await result;
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }

  }

  async createAdvertisement(ctx) {
    try {
      const [ advertisement ] = await this.cleanupRequestProperty('advertisementRules.createAdvertisementRule',
        'title', 'positionName', 'source', 'reward', 'activity', 'height', 'width', 'amount');
      if (!advertisement) {
        return;
      }
      const files = ctx.request.files;
      if (!ctx.helper.isEmpty(files) && !ctx.helper.isEmpty(files[0])) {
        const ossUrl = await ctx.service.picService.putImgs(files[0]);
        advertisement.carouselUrl = (ossUrl);
      }
      await ctx.service.advertisementService.createAdvertisement(advertisement);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }

  }

  async getAdvertisementList(ctx) {
    try {
      const [ advertisement, options ] = await this.cleanupRequestProperty('advertisementRules.getAdvertisementRule',
        'title', 'positionName', 'source', 'activity', 'unit', 'page');
      if (!advertisement) {
        return;
      }
      const result = await ctx.service.advertisementService.getAdvertisement(advertisement, options);
      const count = await this.getFindModelCount('Advertisement', advertisement);
      return this.success([ result, count ]);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async updateAdvertisementList(ctx) {
    try {
      const [ advertisement ] = await this.cleanupRequestProperty('advertisementRules.updateAdvertisementRule',
        'title', 'positionName', 'source', 'activity', 'height', 'width', 'uuid', 'reward');
      if (!advertisement) {
        return;
      }
      const files = ctx.request.files;
      if (!ctx.helper.isEmpty(files) && !ctx.helper.isEmpty(files[0])) {
        const ossUrl = await ctx.service.picService.putImgs(files[0]);
        advertisement.carouselUrl = (ossUrl);
      }

      const service = ctx.service.advertisementService.updateAdvertisement(advertisement.uuid, advertisement);
      this.success();
      await service;
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }

  }

  async setAdvertisementActivity(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('advertisementRules.updateAdvertisementRule',
        'activity', 'uuid');
      if (!condition) {
        return;
      }
      await ctx.service.advertisementService.updateAdvertisement(condition.uuid, condition);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async getAdvertisementByPosition(ctx) {

    try {
      const { positionName } = ctx.request.body;
      if (ctx.helper.isEmpty(positionName)) {
        return this.failure('positionName必须不为空', 400);
      }
      const result = await ctx.service.advertisementService.getAdvertisementByPosition(positionName);

      if (result.length <= 0) {
        return this.success();
      }
      if (positionName === '任务频道') {
        return this.success(result);
      }
      this.success({
        advertisements: result[0].advertisements,
        height: result[0].height,
        width: result[0].width,
      });

    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }
}
module.exports = advertisementController;
