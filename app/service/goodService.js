'use strict';
const { Service } = require('egg');

class goodService extends Service {
  async createGood(goodObj) {
    await this.ctx.model.Category.updateOne({ uuid: goodObj.categoryUUid }, { $inc: { amount: 1 } });
    const good = new this.ctx.model.Good(goodObj);
    good.save();
  }

  async updateGood(condition) {

    const oldGood = await this.ctx.model.Good.findOneAndUpdate({ uuid: condition.uuid },
      { $set: condition }, { new: false });
    if (!this.ctx.helper.isEmpty(oldGood)) {
      const waitingForDeletingImgs = oldGood.slideShowPicUrlArray;
      waitingForDeletingImgs.push(oldGood.mainlyShowPicUrl);
      // await this.ctx.service.picService.deleteManyImg(waitingForDeletingImgs);
    }
    return oldGood;
  }

  async delGood(uuid) {
    const goodObj = await this.ctx.model.Good.findOne({ uuid });
    await this.ctx.model.Category.updateOne({ uuid: goodObj.categoryUUid }, { $inc: { amount: -1 } });
    return this.ctx.model.Good.deleteOne({ uuid });
  }
  async getGoodForUser(uuid) {
    return this.ctx.model.Good.findOne({ uuid, status: 'enable' }, { isRecommend: false });
  }
  async getGood(uuid) {
    return this.ctx.model.Good.findOne({ uuid });
  }

  async getManyGood(conditions, option) {
    return this.ctx.model.Good.find(conditions, { isRecommend: false, redeemCode: false, giftExchangeContent: false }, option).populate('category');
  }

  async getBannerGood() {
    return this.ctx.model.Good.findOne({}, { inventory: false });
  }

  async setGoodStatus(goodObj) {
    return this.ctx.model.Good.findOneAndUpdate({ uuid: goodObj.uuid }, { $set: { status: goodObj.status } }, { new: true });
  }

  async getRecommendGood() {
    const settingGood = await this.ctx.model.SystemSetting.findOne({}, {},
      { sort: { created_at: -1 } }).populate({
      path: 'recommendGood',
      model: this.ctx.model.Good,
    });

    return settingGood.recommendGood;
  }
  // -------------------------2.0----------------------------
  async createCategory(condition) {
    const goodCategory = new this.ctx.model.Category(condition);
    goodCategory.save();
  }
  async updateCategory(condition) {
    await this.ctx.model.Category.updateOne({ uuid: condition.uuid }, { $set: condition });
  }
  async deleteCategory(condition) {
    await this.ctx.model.Category.deleteOne({ uuid: condition.uuid });
  }
  async getCategory(condition, option) {
    option.sort = { priority: -1 };
    const result = await this.ctx.model.Category.find(condition, { created_at: false, type: false }, option);
    const count = await this.ctx.model.Category.countDocuments(condition);
    return [ result, count ];
  }
}


module.exports = goodService;

