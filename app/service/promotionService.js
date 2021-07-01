'use strict';
const BaseService = require('./baseService');

class promotionService extends BaseService {
  async getPromotionList(condition, option) {
    if (!this.isEmpty(condition.title)) {
      condition.title = { $regex: `.*${condition.title}.*` };
    }
    option.sort = { priority: -1 };
    return this.ctx.model.Promotion.find(condition, {
      title: true,
      categoryUUid: true,
      promotionType: true,
      uuid: true,
      status: true,
      reward: true,
      priority: true,
      created_at: true,
      totalFinishCount: true,
      waitingProcess: true,
    }, option).populate('category');
  }
  async setPromotionBranch(condition) {
    const oldPromotion = await this.ctx.model.Promotion.findOneAndUpdate({ uuid: condition.promotionUUid },
      {}, { sort: { stepNumber: -1 }, new: true });
    if (this.isEmpty(oldPromotion)) { this.ctx.throw(400, '找不到这个活动'); }
    condition.uuid = 'PROB' + require('cuid')();
    const stepNumberShouldBe = oldPromotion.stepsBox.length + 1;
    condition.stepNumber = stepNumberShouldBe;
    await this.ctx.model.Promotion.updateOne({ uuid: condition.promotionUUid },
      { $push: { stepsBox: {
        $each: [{ uuid: condition.uuid, stepNumber: stepNumberShouldBe }],
        $sort: { stepNumber: -1 },
      } } });
    const promotionBranch = new this.ctx.model.PromotionBranch(condition);
    promotionBranch.save();
  }

  async updatePromotionBranch(condition) {
    delete condition.promotionUUid;
    await this.ctx.model.PromotionBranch.updateOne({ uuid: condition.uuid }, { $set: condition });
  }
  async updatePromotion(condition) {
    const oldPromotion = await this.ctx.model.Promotion.
      findOneAndUpdate({ uuid: condition.uuid }, { $set: condition });
    if (condition.categoryUUid) {
      await this.ctx.model.Category.updateOne({ uuid: oldPromotion.categoryUUid }, { $inc: { amount: -1 } });
      await this.ctx.model.Category.updateOne({ uuid: condition.categoryUUid }, { $inc: { amount: 1 } });
    }
  }

  async getPromotionDetail(condition) {
    return this.ctx.model.Promotion.findOne({ uuid: condition.promotionUUid }).populate('category stepsBoxDetail');
  }
  async createPromotion(condition) {
    await this.ctx.model.Category.updateOne({ uuid: condition.categoryUUid }, { $inc: { amount: 1 } });
    const promotion = new this.ctx.model.Promotion(condition);
    promotion.save();
  }
  async cleanPromotionBranch(condition) {
    const uuid = condition.uuid;
    const promotion = await this.ctx.model.Promotion.findOne({ uuid });
    await this.ctx.model.Promotion.updateOne({ uuid: promotion.promotionUUid },
      { $pull: { stepsBox: { uuid } } });
  }
  async deletePromotionBranch(condition) {
    const uuid = condition.uuid;
    const promotion = await this.ctx.model.PromotionBranch.findOne({ uuid });
    await this.ctx.model.Promotion.updateOne({ uuid: promotion.promotionUUid },
      { $pull: { stepsBox: { uuid } } });
    await this.ctx.model.PromotionBranch.deleteOne({ uuid });
  }

  async deletePromotion(condition) {
    const uuid = condition.uuid;
    const promotion = await this.ctx.model.Promotion.findOne({ uuid });
    if (this.isEmpty(promotion)) {
      this.ctx.throw(400, '找不到这个记录');
    }
    await this.ctx.model.Category.updateOne({ uuid: promotion.categoryUUid }, { $inc: { amount: -1 } });
    const flag = await this.ctx.model.UserPromotion.exists({ promotionUUid: uuid });
    if (flag) {
      this.ctx.throw(400, '已经有用户进行了这个活动，无法删除');
    }
    await this.ctx.model.Promotion.deleteOne({ uuid });
  }

}

module.exports = promotionService;

