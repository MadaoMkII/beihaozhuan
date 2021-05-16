
'use strict';
const BaseService = require('./baseService');
class userPromotionService extends BaseService {
  async getDetail(condition) {
    const promotion = await this.ctx.model.Promotion.findOne({ uuid: condition.uuid },
      { stepsBox: 0, created_at: 0, updated_at: 0 }).populate('category');
    if (!promotion) {
      this.ctx.throw(400, '找不到这个活动');
    }
    const branches = await this.ctx.model.PromotionBranch.find({ promotionUUid: condition.uuid },
      {}, { sort: { stepNumber: 1 } });
    const userPromotions = await this.ctx.model.UserPromotion.find({ promotionUUid: condition.uuid },
      {
        operator: 0,
        created_at: 0,
      });
    const branchArray = [];
    for (const branch of branches) {
      const ups = userPromotions.find(e => e.promotionBranchUUid === branch.uuid);
      const tempObj = {};
      tempObj.uuid = branch.uuid;
      tempObj.stepNumber = branch.stepNumber;
      tempObj.allowUpload = branch.allowUpload;
      tempObj.rewardSwitch = branch.rewardSwitch;
      tempObj.branchTitle = branch.branchTitle;
      if (!this.isEmpty(ups)) {
        delete ups._doc.promotionBranchUUid;
        delete ups._doc.tel_number;
        delete ups._doc.nickName;
        tempObj.userPromotion = {
          status: ups.status,
          screenshotUrls: ups.screenshotUrls,
        };
      } else {
        tempObj.userPromotion = {
          status: '未开启',
          screenshotUrls: [],
        };
      }
      tempObj.promotionReward = branch.promotionReward;
      tempObj.description = branch.description;
      tempObj.showPics = branch.showPics;
      tempObj.downloadLink = branch.downloadLink;
      branchArray.push(tempObj);
    }
    promotion._doc.branches = branchArray;
    return promotion;
  }
  async getMainPageData(user, platform) {

    const userPromotions = await this.ctx.model.UserPromotion.find({ tel_number: user.tel_number }, {},
      { sort: { update_at: -1 } }).
      populate('promotionBranchObj');
    // 遍历但是要小心失败
    const userPromotionMap = new Map();
    for (const ps of userPromotions) {
      const oldUP = userPromotionMap.get(ps.promotionUUid);
      if (this.isEmpty(oldUP) ||
          (oldUP.promotionBranchObj && oldUP.promotionBranchObj.stepNumber &&
              (oldUP.promotionBranchObj.stepNumber < ps.promotionBranchObj.stepNumber))) {
        userPromotionMap.set(ps.promotionUUid, ps);
      }
    }
    const promotions = await this.ctx.model.Promotion.find({ platform, status: 'enable' }).populate('category');
    let promotionData = [];
    const categoryMap = new Map();
    const statusMap = new Map();
    statusMap.set('已下载', 0);
    statusMap.set('审核中', 0);
    statusMap.set('审核不通过', 0);
    statusMap.set('审核通过', 0);


    for (const promotion of promotions) {
      const ups = userPromotionMap.get(promotion.uuid);
      const tempUserStatus = this.isEmpty(ups) ? '未开启' : ups.status;
      if (categoryMap.has(promotion.category.category)) {
        categoryMap.set(promotion.category.category, categoryMap.get(promotion.category.category) + 1);
      } else {
        categoryMap.set(promotion.category.category, 1);
      }
      if (tempUserStatus !== '未开启') {
        statusMap.set(tempUserStatus, statusMap.get(tempUserStatus) + 1);
      }


      const tempObj = {
        title: promotion.title,
        promotionType: promotion.promotionType,
        platform: promotion.platform,
        // description: promotion.description,
        reward: promotion.reward,
        priority: promotion.priority,
        mainlyShowPicUrl: promotion.mainlyShowPicUrl,
        uuid: promotion.uuid,
        category: promotion.category.category,
        userStatus: tempUserStatus,
        // updated_at: this.app.getLocalTime(promotion.updated_at),
      };
      promotionData.push(tempObj);
    }
    promotionData = promotionData.sort((a, b) => {
      if (a.priority === b.priority) {
        return a.updated_at - b.updated_at;
      }
      return b.priority - a.priority;
    });
    const statusArray = Array.from(statusMap, ([ status, count ]) => ({ status, count }));
    const categoryArray = Array.from(categoryMap, ([ category, count ]) => ({ category, count }));
    return { statusArray, categoryArray, promotionData };
  }

  async checkDownloadLink(condition) {
    const user = this.ctx.user;
    const promotionBranch = await this.ctx.model.PromotionBranch.findOne({
      uuid: condition.promotionBranchUUid });
    if (this.isEmpty(promotionBranch)) {
      this.ctx.throw(400, '找不到这个uuid对应的记录');
    }
    const existFlag = await this.ctx.model.UserPromotion.exists({
      promotionBranchUUid: condition.promotionBranchUUid,
      tel_number: user.tel_number,
      promotionUUid: promotionBranch.promotionUUid,
    });
    if (existFlag) {
      return;
    }
    const userPromotion = {
      uuid: condition.uuid,
      promotionBranchUUid: condition.promotionBranchUUid,
      status: '已下载',
      title: promotionBranch.branchTitle,
      tel_number: user.tel_number,
      nickName: user.nickName,
      reward: promotionBranch.promotionReward,
      promotionUUid: promotionBranch.promotionUUid,
      source: user.source,
      stepNumber: promotionBranch.stepNumber,
    };
    const promotionBranchObj = new this.ctx.model.UserPromotion(userPromotion);
    promotionBranchObj.save();
  }

  async submitUserPromotion(condition) {
    const user = this.ctx.user;
    const promotionBranch = await this.ctx.model.UserPromotion.findOneAndUpdate({
      promotionBranchUUid: condition.promotionBranchUUid,
      status: '已下载',
      tel_number: user.tel_number,
    },
    { $set: { screenshotUrls: condition.screenshotUrls, status: '审核中' } });
    if (this.isEmpty(promotionBranch)) {
      this.ctx.throw(400, '找不到这个uuid对应的记录, 或者状态不对');
    }
  }

  // admin-------------------------------------------
  async approvePromotion(condition) {
    const { user } = this.ctx; //
    const result = await this.ctx.model.UserPromotion.findOneAndUpdate({ uuid: condition.uuid, status: '未审核' },
      { $set: { status: condition.decision, operator: { nickName: user.nickName, tel_number: user.tel_number } } });
    if (this.isEmpty(result)) {
      this.ctx.throw(400, '找不到这个uuid对应的记录, 或者订单状态已经被审核');
    }
    if (condition.decision) {
      const modifyObj = {
        tel_number: result.tel_number,
        content: `活动奖励-${result.title}`,
        category: '活动奖励',
        amount: result.reward,
      };
      await this.ctx.service.userService.modifyUserRcoin(modifyObj);
    }
  }
  async getCheckUserPromotionList(condition, option) {
    return this.ctx.model.UserPromotion.find(condition, {
      tel_number: 1,
      title: 1,
      screenshotUrls: 1,
      reward: 1,
      operator: 1,
      source: 1,
      created_at: 1,
      status: 1,
      uuid: 1,
    }, option);

  }
  async getCheckUserPromotionBranchLabel(condition) {
    const list = await this.ctx.model.UserPromotion.aggregate([
      { $match: { promotionUUid: condition.uuid } },
      { $group: {
        _id: '$promotionBranchUUid',
        stepNumber: { $first: '$stepNumber' },
        totalUnfinished: { $sum: { $cond: [{ $eq: [ '$status', 4 ] }, 1, 0 ] } },
      } },
    ]);
    return list;
  }
}
module.exports = userPromotionService;

