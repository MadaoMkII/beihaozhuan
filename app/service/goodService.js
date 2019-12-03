'use strict';
const { Service } = require('egg');

class goodService extends Service {
  async createGood(goodObj) {
    const good = new this.ctx.model.Good(goodObj);
    good.save();
  }

  async updateGood(goodObj, uuid) {

    const oldGood = await this.ctx.model.Good.findOneAndUpdate({ uuid }, { $set: goodObj }, { new: false });
    if (!this.ctx.helper.isEmpty(oldGood)) {
      const waitingForDeletingImgs = oldGood.slideShowPicUrlArray;
      waitingForDeletingImgs.push(oldGood.mainlyShowPicUrl);
      // await this.ctx.service.picService.deleteManyImg(waitingForDeletingImgs);
    }
    return oldGood;
  }

  async delGood(uuid) {
    return this.ctx.model.Good.deleteOne({ uuid });
  }

  async getGood(uuid) {

    return this.ctx.model.Good.findOne({ uuid });
  }

  async getManyGood(conditions, option) {
    // let count = await this.ctx.model.Good.countDocuments(conditions);//estimatedDocumentCount
    return this.ctx.model.Good.find(conditions, {}, option);
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
}


module.exports = goodService;

