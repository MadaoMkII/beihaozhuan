'use strict';
const Controller = require('./baseController');
class realMissionController extends Controller {
  async createRealMission(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('missionRules.createRealMissionRule',
        'title', 'type', 'reward', 'requireTimes', 'limit',
        'picUrl', 'extraSwitch', 'extraBonusAmount', 'extraBonusRate');
      if (!condition) {
        return;
      }
      condition.uuid = 'RM' + require('cuid')();
      await ctx.service.realMissionService.createRealMission(condition);
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }

  async doMission(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('missionRules.doMissionRule',
        'type');
      if (!condition) {
        return;
      }
      await ctx.service.realMissionService.doRealMission(condition);
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }

  async getRealMissionForUser(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('pageAndUnitRule',
        'unit', 'page');
      if (!condition) {
        return;
      }
      const result = await ctx.service.realMissionService.getRealMissionForUser(option);
      const count = await this.getFindModelCount('UserMissionTask', { tel_number: ctx.user.tel_number });
      this.success([ result, count ]);
    } catch (e) {
      this.failure(e);
    }
  }
  async getRealMissionForAdmin(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('missionRules.getRealMissionForAdminRule',
        'unit', 'page', 'title', 'extraSwitch');
      if (!condition) {
        return;
      }
      if (!this.isEmpty(condition.title)) {
        condition.title = { $regex: `.*${condition.title}.*` };
      }
      const result = await ctx.service.realMissionService.getRealMissionForAdmin(condition, option);
      const count = await this.getFindModelCount('RealMission', condition);
      this.success([ result, count ]);
    } catch (e) {
      this.failure(e);
    }
  }
  async finishRealMission(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('uuidRule',
        'uuid');
      if (!condition) {
        return;
      }
      const result = await ctx.service.realMissionService.finishRealMission(condition);
      this.success(result);
    } catch (e) {
      this.failure(e);
    }
  }
}
module.exports = realMissionController;
