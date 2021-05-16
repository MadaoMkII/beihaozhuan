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
      this.success(result);
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
