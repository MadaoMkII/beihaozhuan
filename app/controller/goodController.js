'use strict';
const baseController = require('../controller/baseController');

class goodController extends baseController {

  async getGoodDetailForUser(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('uuidRule',
        'uuid');
      if (!condition) {
        return;
      }
      const result = await ctx.service.goodService.getGood(condition.uuid, { giftExchangeContent: false });
      return this.success(result);
    } catch (e) {
      this.failure(e);
    }
  }

  async getGoodDetailForAdmin(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('uuidRule',
        'uuid');
      if (!condition) {
        return;
      }
      const result = await ctx.service.goodService.getGood(condition.uuid);
      return this.success(result);
    } catch (e) {
      // this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async getManyGoods(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('goodRules.findGoodRule',
        'unit', 'page', 'status', 'title', 'categoryUUid');
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
      this.failure();
    }
  }

  async getShowGoods(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('goodRules.findGoodRule',
        'unit', 'page', 'status', 'title', 'categoryUUid');
      if (!condition) {
        return;
      }
      if (!ctx.helper.isEmpty(condition.title)) {
        condition.title = { $regex: `.*${condition.title}.*` };
      }
      condition.status = 'enable';
      const count = await this.getFindModelCount('Good', condition);
      const result = await ctx.service.goodService.getManyGood(condition, option);
      return this.success([ result, count ]);
    } catch (e) {
      this.failure();
    }
  }
  async getGoodListForUser(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('goodRules.getGoodListForUserRule',
        'unit', 'page', 'categoryUUid');
      if (!condition) {
        return false;
      }
      if (condition.categoryUUid === '全部') {
        delete condition.categoryUUid;
      }
      const result = await ctx.service.goodService.getGoodListForUser(condition, option);
      const count = await this.getFindModelCount('Good', condition);
      this.success([ result, count ]);
    } catch (e) {
      this.failure(e);
    }
  }

  async delGood(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('uuidRule',
        'uuid');
      if (!condition) {
        return false;
      }
      await ctx.service.goodService.delGood(condition.uuid);
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
      const [ condition ] = await this.cleanupRequestProperty('goodRules.updateGoodRule',
        'uuid', 'title', 'categoryUUid', 'price', 'description', 'inventory', 'status', 'exchangeWay', 'paymentMethod', 'giftExchangeContent');
      if (!condition) {
        return false;
      }
      const files = ctx.request.files;
      if (!ctx.helper.isEmpty(files)) {
        condition.slideShowPicUrlArray = [];
        for (const fileObj of files) {
          const ossUrl = await ctx.service.picService.putImgs(fileObj);
          if (fileObj.field === 'mainlyShowPicUrl') {
            condition.mainlyShowPicUrl = ossUrl;
          } else {
            condition.slideShowPicUrlArray.push(ossUrl);
          }
        }
      }
      condition.paymentMethod = 'Bcoin';
      if (condition.price) { condition.price = Number(condition.price) <= 0 ? 1 : Number(condition.price); }
      if (condition.inventory) { condition.inventory = Number(condition.inventory) <= 0 ? 1 : Number(condition.inventory); }
      const result = await ctx.service.goodService.updateGood(condition);
      if (ctx.helper.isEmpty(result)) {
        return this.failure('找不到商品', 4031, 400);
      }
      return this.success();
    } catch (e) {
      this.failure(e);
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
      this.failure();
    }
  }

  async getRecommendGood() {
    try {
      const setting = await this.service.goodService.getRecommendGood();
      this.success(setting);
    } catch (e) {
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
      this.failure();
    }
  }
  async getCategory(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('goodRules.getCategoryRule',
        'category', 'unit', 'page', 'type');
      if (!condition) {
        return false;
      }
      if (condition.category) {
        condition.category = { $regex: `.*${condition.category}.*` };
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
      const [ condition ] = await this.cleanupRequestProperty('goodRules.updateCategoryRule',
        'category', 'priority', 'uuid');
      if (!condition) {
        return false;
      }
      await ctx.service.goodService.updateCategory(condition);
      this.success();
    } catch (e) {
      // this.app.logger.error(e, ctx);
      this.failure();
    }
  }
  async deleteCategory(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('uuidRule',
        'uuid');
      if (!condition) {
        return false;
      }
      await ctx.service.goodService.deleteCategory(condition);
      this.success();
    } catch (e) {
      // this.app.logger.error(e, ctx);
      this.failure();
    }
  }


}

module.exports = goodController;
