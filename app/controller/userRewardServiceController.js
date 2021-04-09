'use strict';
const Controller = require('./baseController');
class userRewardServiceController extends Controller {

  async getUserRewardList(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('userRewardRules.getUserRewardListRule',
        'page', 'unit', 'title');
      if (!condition) {
        return;
      }
      if (!ctx.helper.isEmpty(condition.title)) {
        condition.title = { $regex: `.*${condition.title}.*` };
      }
      const result = await ctx.service.userRewardService.getUserRewardList(condition, option);
      const count = await this.getFindModelCount('UserReward', condition);
      this.success([ result, count ]);
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }

  async getUserRewardDetail(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('uuidRule',
        'uuid');
      if (!condition) {
        return;
      }
      const result = await ctx.service.userRewardService.getUserRewardDetail(condition);
      this.success(result);
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }
  async updateUserReward(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('userRewardRules.createUserRewardRule',
        'title', 'singleReward', 'guests', 'uuid');
      if (!condition) {
        return;
      }
      await ctx.service.userRewardService.updateUserReward(condition);
      this.success();
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }
  async deleteUserReward(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('uuidRule',
        'uuid');
      if (!condition) {
        return;
      }
      await ctx.service.userRewardService.deleteUserReward(condition);
      this.success();
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }
  async createUserReward(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('userRewardRules.createUserRewardRule',
        'title', 'singleReward', 'guests');
      if (!condition) {
        return;
      }
      await ctx.service.userRewardService.createUserReward(condition);
      this.success();
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }

  async activityUserReward(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('uuidRule',
        'uuid');
      if (!condition) {
        return;
      }
      await ctx.service.userRewardService.activityUserReward(condition);
      this.success();
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }


  async quickUserList(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('userRewardRules.quickUserList',
        'username');
      if (!condition) {
        return;
      }
      const result = await ctx.service.userRewardService.quickUserList(condition);
      this.success(result);
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }
}
module.exports = userRewardServiceController;
