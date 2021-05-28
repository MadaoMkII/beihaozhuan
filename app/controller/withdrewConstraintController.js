'use strict';
const Controller = require('./baseController');
class withdrewConstraintController extends Controller {


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

}
module.exports = withdrewConstraintController;
