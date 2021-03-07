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

}
module.exports = realMissionController;
