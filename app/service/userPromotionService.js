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
    const userPromotions = await this.ctx.model.UserPromotion.find({ tel_number: this.ctx.user.tel_number,
      promotionUUid: condition.uuid },
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
    console.log(userPromotions);
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
    statusMap.set('审核未通过', 0);
    statusMap.set('审核通过', 0);
    statusMap.set('已完成', 0);

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
        totalFinishCount: promotion.totalFinishCount,
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
    const promotion = await this.ctx.model.Promotion.findOne({ uuid: promotionBranch.promotionUUid },
      { promotionType: 1 });
    if (existFlag) {
      return;
    }
    const userPromotion = {
      uuid: condition.uuid,
      promotionBranchUUid: condition.promotionBranchUUid,
      status: '已下载',
      type: promotion.promotionType,
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
    const oldUserPromotion = await this.ctx.model.UserPromotion.findOne({
      promotionBranchUUid: condition.promotionBranchUUid,
      tel_number: user.tel_number,
    });
    if (!this.isEmpty(oldUserPromotion)) {
      if (oldUserPromotion.status === '审核中') {
        this.ctx.throw(400, '您已经提交过了，请等待审批');
      }
      if (oldUserPromotion.status === '审核通过') {
        this.ctx.throw(400, '您已经提交过了，这个审核已经通过了');
      }
      if (oldUserPromotion.status === '审核未通过') {
        await this.ctx.model.UserPromotion.updateOne({
          promotionBranchUUid: condition.promotionBranchUUid,
          tel_number: user.tel_number,
        }, { $set: {
          status: '审核中',
          screenshotUrls: condition.screenshotUrls,
        } });
        return;
      }
    }
    const promotionBranch = await this.ctx.model.PromotionBranch.findOne({ uuid: condition.promotionBranchUUid });
    if (!this.isEmpty(promotionBranch.downloadLink)) {
      if (this.isEmpty(oldUserPromotion)) {
        this.ctx.throw(400, '找不到这个uuid对应的记录');
      }
    }
    const promotion = await this.ctx.model.Promotion.findOne({ uuid: promotionBranch.promotionUUid },
      { promotionType: 1 });
    const userPromotion = {
      uuid: condition.uuid,
      promotionBranchUUid: condition.promotionBranchUUid,
      status: '审核中',
      type: promotion.promotionType,
      title: promotionBranch.branchTitle,
      tel_number: user.tel_number,
      nickName: user.nickName,
      reward: promotionBranch.promotionReward,
      promotionUUid: promotionBranch.promotionUUid,
      source: user.source,
      stepNumber: promotionBranch.stepNumber,
    };
    await this.ctx.model.Promotion.updateOne({ uuid: promotionBranch.promotionUUid },
      { $inc: { waitingProcess: 1 } });
    const promotionBranchObj = new this.ctx.model.UserPromotion(userPromotion);
    promotionBranchObj.save();
  }

  // admin-------------------------------------------
  async approvePromotion(condition) {
    const { user } = this.ctx; //
    const result = await this.ctx.model.UserPromotion.findOneAndUpdate({
      uuid: condition.uuid,
      status: { $in: [ '审核中', '审核未通过' ] } },
    { $set: { status: condition.decision, operator: { nickName: user.nickName, tel_number: user.tel_number } } });
    if (this.isEmpty(result)) {
      this.ctx.throw(400, '找不到这个uuid对应的记录, 或者订单状态已经被审核');
    }
    if (condition.decision === '审核通过') {
      const modifyObj = {
        tel_number: result.tel_number,
        content: `活动奖励-${result.title}`,
        category: '活动奖励',
        amount: result.reward,
      };
      await this.ctx.service.userService.modifyUserRcoin(modifyObj);
      await this.ctx.model.Promotion.updateOne({ uuid: result.promotionUUid },
        { $inc: { totalFinishCount: 1, waitingProcess: -1 } });
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
        totalUnfinished: { $sum: { $cond: [{ $eq: [ '$status', 1 ] }, 1, 0 ] } },
      } },
    ]);
    const branches = await this.ctx.model.PromotionBranch.find({ promotionUUid: condition.uuid });
    const result = [];
    for (const branch of branches) {
      const totalUnfinishedObj = list.find(e => e._id === branch.uuid);
      if (this.isEmpty(totalUnfinishedObj)) {
        result.push({
          uuid: branch.uuid,
          stepNumber: branch.stepNumber,
          totalUnfinished: 0,
        });
      } else {
        result.push({
          uuid: branch.uuid,
          stepNumber: branch.stepNumber,
          totalUnfinished: totalUnfinishedObj.totalUnfinished,
        });
      }
    }
    return result;
  }
}
module.exports = userPromotionService;

