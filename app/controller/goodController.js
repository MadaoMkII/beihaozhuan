'use strict';
const baseController = require('../controller/baseController');

class goodController extends baseController {
  async getManyGoods(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('goodRules.findGoodRule',
        'unit', 'page', 'status', 'title', 'uuid');
      if (!condition) {
        return;
      }
      if (!ctx.helper.isEmpty(condition.title)) {
        condition.title = { $regex: `.*${condition.title}.*` };
      }
      const count = await this.getFindModelCount('Good', condition);
      const result = await ctx.service.goodService.getManyGood(condition, option);
      return this.success([ result, count ]);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async getShowGoods(ctx) {
    ctx.request.body.status = 'enable';
    await this.getManyGoods(ctx);
  }

  async delGood(ctx) {
    try {
      const { uuid } = ctx.request.body;
      if (ctx.helper.isEmpty(uuid)) {
        this.failure('uuid can not be empty', 400);
      }
      await ctx.service.goodService.delGood(uuid);
      return this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async setGoodStatus(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('goodRules.setGoodStatusRule',
        'uuid', 'status');
      if (!condition) {
        return;
      }
      const result = await ctx.service.goodService.setGoodStatus(condition);
      if (ctx.helper.isEmpty(result)) {
        return this.failure('找不到商品', 4031, 400);
      }
      return this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async generatorGood(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('goodRules.createGoodRule',
        'title', 'category', 'description', 'inventory', 'insuranceLink', 'price', 'paymentMethod');
      if (!condition) {
        return false;
      }
      const newGood = {};
      newGood.slideShowPicUrlArray = [];
      const files = ctx.request.files;
      if (!ctx.helper.isEmpty(files)) {
        for (const fileObj of files) {
          const ossUrl = await ctx.service.picService.putImgs(fileObj);
          if (fileObj.field === 'mainlyShowPicUrl') {
            newGood.mainlyShowPicUrl = ossUrl;
          } else {
            newGood.slideShowPicUrlArray.push(ossUrl);
          }
        }
      }
      newGood.category = condition.category;
      newGood.price = Number(condition.price) <= 0 ? 1 : Number(condition.price);
      newGood.title = condition.title;
      newGood.insuranceLink = condition.insuranceLink;
      newGood.description = condition.description;
      newGood.inventory = Number(condition.inventory) <= 0 ? 1 : Number(condition.inventory);
      newGood.paymentMethod = condition.paymentMethod;
      return newGood;
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async updateGood(ctx) {
    try {
      const { uuid } = ctx.request.body;
      const newGood = await this.generatorGood(ctx);
      if (newGood === false) {
        return;
      }
      const result = await ctx.service.goodService.updateGood(newGood, uuid);
      if (ctx.helper.isEmpty(result)) {
        return this.failure('找不到商品', 4031, 400);
      }
      return this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async createGood(ctx) {
    try {
      const uuid = 'GD' + require('cuid')();
      const newGood = await this.generatorGood(ctx);
      if (newGood === false) {
        return;
      }
      newGood.uuid = uuid;
      const result = await ctx.service.goodService.createGood(newGood);
      return this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async getRecommendGood(ctx) {
    try {
      const setting = await this.service.goodService.getRecommendGood();
      this.success(setting);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }
}

module.exports = goodController;
