'use strict';
const BaseService = require('./baseService');
class userRewardService extends BaseService {

  async getUserRewardList(condition, option) {
    return this.ctx.model.UserReward.find(condition, { created_at: false }, option);
  }
  async getUserRewardDetail(condition) {
    return this.ctx.model.UserReward.findOne({ uuid: condition.uuid });
  }
  async deleteUserReward(condition) {
    await this.ctx.model.UserReward.deleteOne({ uuid: condition.uuid, status: '关闭' });
  }
  async updateUserReward(condition) {
    const user = this.ctx.user;
    condition.numberOfPeople = condition.guests.length;
    condition.totalAmount = condition.numberOfPeople * condition.singleReward;
    condition.operator = { tel_number: user.tel_number, nickName: user.nickName };
    await this.ctx.model.UserReward.updateOne({ uuid: condition.uuid }, { $set: condition });
  }
  async createUserReward(condition) {
    const user = this.ctx.user;
    condition.status = '关闭';
    condition.uuid = 'UR' + require('cuid')();
    condition.numberOfPeople = condition.guests.length;
    condition.totalAmount = condition.numberOfPeople * condition.singleReward;
    condition.creator = { tel_number: user.tel_number, nickName: user.nickName };
    condition.operator = { tel_number: user.tel_number, nickName: user.nickName };
    const userReward = new this.ctx.model.UserReward(condition);
    userReward.save();
  }
  async activityUserReward(condition) {

    const userReward = await this.ctx.model.UserReward.findOneAndUpdate({ uuid: condition.uuid,
      status: '关闭' },
    { $set: { operator: { tel_number: this.ctx.user.tel_number, nickName: this.ctx.user.nickName },
      status: '开启' } });
    if (this.isEmpty(userReward)) {
      this.ctx.throw(400, '找不到对应的记录');
    }
    for (const guest of userReward.guests) {
      const modifyObj = {
        tel_number: guest.tel_number,
        content: `平台奖励-${userReward.title}`,
        category: '用户奖励',
        amount: userReward.singleReward,
      };
      await this.ctx.service.userService.modifyUserRcoin(modifyObj);
    }

  }

  async quickUserList(condition) {
    let query = { tel_number: { $regex: `.*${condition.username}.*` } };
    if (this.app.isEmpty(condition.username)) {
      query = {};
    }
    return this.ctx.model.UserAccount.find(query,
      { nickName: 1, tel_number: 1 }, { limit: 30 });
  }
}


module.exports = userRewardService;
