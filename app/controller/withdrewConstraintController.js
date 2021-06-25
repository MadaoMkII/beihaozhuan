'use strict';
const Controller = require('./baseController');
class withdrewConstraintController extends Controller {

  async getWithdrewList(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('wechatRules.getWithdrewListRule',
        'title', 'source', 'tel_number', 'page', 'unit');
      if (!condition) {
        return;
      }
      let [ result, query ] = await ctx.service.wechatService.getWithdrewList(condition, option);
      result = result.map(e => {
        return {
          nickName: e.nickName,
          tel_number: e.tel_number,
          source: e.source,
          amount: e.amount,
          Bcoins: e.user_id.Bcoins,
          created_at: this.app.getLocalTime(e.created_at),
        };
      });
      const count = await this.getFindModelCount('Withdrew', query);
      this.success([ result, count ]);
    } catch (e) {
      this.failure(e);
    }
  }
  async deleteWithdrewConstraintList(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('idRule',
        'id');
      if (!condition) {
        return;
      }
      await ctx.service.wechatService.deleteWithdrewConstraintList(condition);
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }
  async updateWithdrewConstraintList(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('withdrewConstraintRules.updateWithdrewConstraintListRule',
        'title', 'amount', 'period', 'withdrewConstraintTimes', 'onlyOneTime', 'description', 'id');
      if (!condition) {
        return;
      }
      await ctx.service.wechatService.updateWithdrewConstraintList(condition);
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }
  async createWithdrewConstraint(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('withdrewConstraintRules.createWithdrewConstraintRule',
        'title', 'amount', 'period', 'withdrewConstraintTimes', 'onlyOneTime', 'description');
      if (!condition) {
        return;
      }
      await ctx.service.wechatService.createWithdrewConstraint(condition);
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }
  async getWithdrewConstraintList(ctx) {
    try {
      const result = await ctx.service.wechatService.getWithdrewConstraintList();
      this.success(result);
    } catch (e) {
      this.failure(e);
    }
  }
  async getWithdrewConstraintList_User(ctx) {
    try {
      const result = await ctx.service.wechatService.getWithdrewConstraintList_User();
      this.success(result);
    } catch (e) {
      this.failure(e);
    }
  }
}
module.exports = withdrewConstraintController;
