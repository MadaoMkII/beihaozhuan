
'use strict';
const BaseService = require('./baseService');
class promotionService extends BaseService {
  async setPromotionBranch(condition) {
    const promotionBranch = new this.ctx.model.PromotionBranch(condition);
    await this.ctx.model.Promotion.updateOne({ uuid: condition.promotionUUid },
      { $push: { stepsBox: { uuid: condition.uuid, stepNumber: condition.stepNumber } } });
    promotionBranch.save();
  }
  async updatePromotionBranch(condition) {
    delete condition.promotionUUid;
    await this.ctx.model.PromotionBranch.updateOne({ uuid: condition.uuid }, { $set: condition });
  }
  async createPromotion(condition) {
    const promotion = new this.ctx.model.Promotion(condition);
    promotion.save();
  }


}module.exports = promotionService;

