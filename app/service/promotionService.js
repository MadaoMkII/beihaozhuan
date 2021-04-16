'use strict';
const BaseService = require('./baseService');

class promotionService extends BaseService {
  async getPromotionList(condition, option) {
    if (!this.isEmpty(condition.title)) {
      condition.title = { $regex: `.*${condition.title}.*` };
    }
    option.sort = { priority: 1 };
    return this.ctx.model.Promotion.find(condition, {
      title: true,
      categoryUUid: true,
      promotionType: true,
      uuid: true,
      reward: true,
      priority: true,
      created_at: true,
      totalFinishCount: true,
    }, option).populate('category');
  }
  async setPromotionBranch(condition) {
    condition.uuid = 'PROB' + require('cuid')();
    const oldPromotionBranches = await this.ctx.model.PromotionBranch.find({ promotionUUid: condition.promotionUUid },
      {}, { sort: { stepNumber: -1 } });
    let stepNumberShouldBe = 1;
    if (!this.isEmpty(oldPromotionBranches) && oldPromotionBranches.length > 0) {
      stepNumberShouldBe = oldPromotionBranches.length + 1;
    }
    condition.stepNumber = stepNumberShouldBe;
    await this.ctx.model.Promotion.updateOne({ uuid: condition.promotionUUid },
      { $push: { stepsBox: { uuid: condition.uuid, stepNumber: stepNumberShouldBe } } });
    const promotionBranch = new this.ctx.model.PromotionBranch(condition);
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

  async deletePromotionBranch(condition) {
    const uuid = condition.uuid;
    const promotion = await this.ctx.model.PromotionBranch.findOne({ uuid });
    await this.ctx.model.Promotion.updateOne({ uuid: promotion.promotionUUid },
      { $pull: { stepsBox: { uuid } } });
    await this.ctx.model.PromotionBranch.deleteOne({ uuid });
  }
}

module.exports = promotionService;

