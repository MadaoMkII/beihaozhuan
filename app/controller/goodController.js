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
    // ctx.request.body.status = 'enable';
    await this.getManyGoods(ctx);
  }

  async delGood(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('goodRules.createGoodRule',
        'uuid');
      if (!condition) {
        return false;
      }
      const { uuid } = condition;
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
        'title', 'categoryUUid', 'description', 'inventory',
        'price', 'exchangeWay', 'giftExchangeContent');
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
      newGood.paymentMethod = 'Bcoin';
      newGood.category = condition.category;
      newGood.price = Number(condition.price) <= 0 ? 1 : Number(condition.price);
      newGood.title = condition.title;
      newGood.insuranceLink = condition.insuranceLink;
      newGood.categoryUUid = condition.categoryUUid;
      newGood.description = condition.description;
      newGood.exchangeWay = condition.exchangeWay;
      newGood.giftExchangeContent = condition.giftExchangeContent;
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
      const [ condition ] = await this.cleanupRequestProperty('goodRules.createGoodRule',
        'uuid');
      if (!condition) {
        return false;
      }
      const { uuid } = condition;
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


  // -------------------------2.0----------------------------
  async createCategory(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('goodRules.createCategoryRule',
        'category', 'priority', 'type');
      if (!condition) {
        return false;
      }
      condition.uuid = 'GDC' + require('cuid')();
      await ctx.service.goodService.createCategory(condition);
      this.success();
    } catch (e) {
      console.log(e);
      // this.app.logger.error(e, ctx);
      this.failure();
    }
  }
  async getCategory(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('goodRules.getCategoryRule',
        'title', 'unit', 'page');
      if (!condition) {
        return false;
      }
      const result = await ctx.service.goodService.getCategory(condition, option);
      this.success(result);
    } catch (e) {
      // this.app.logger.error(e, ctx);
      this.failure();
    }
  }
  async updateCategory(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('goodRules.createGoodRule',
        'category', 'priority', 'uuid');
      if (!condition) {
        return false;
      }
      await ctx.service.goodService.updateCategory(condition);
    } catch (e) {
      // this.app.logger.error(e, ctx);
      this.failure();
    }
  }
  async deleteCategory(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('goodRules.createGoodRule',
        'uuid');
      if (!condition) {
        return false;
      }
      await ctx.service.goodService.deleteCategory(condition);
    } catch (e) {
      // this.app.logger.error(e, ctx);
      this.failure();
    }
  }

}

module.exports = goodController;
