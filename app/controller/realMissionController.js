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
        'type', 'noncestr', 'timestamp', 'sign');
      if (!condition) {
        return;
      }
      const testObj = {
        noncestr: condition.noncestr,
        timestamp: condition.timestamp,
        type: condition.type,
        tel_number: ctx.user.tel_number,
      };
      const [ , signStr ] = await ctx.service.wechatService.getSign(testObj, 'MD5', 'beihaozhuan01');
      console.log(signStr);
      console.log(condition.sign);
      if (signStr !== condition.sign) {
        ctx.throw(400, '签名并不匹配');
      }
      const diffTime = ctx.diffTime(condition.timestamp, null, 'minutes');
      if (Math.abs(diffTime) >= 1) {
        ctx.throw(400, '请求超过时限');
      }
      const promise = ctx.service.realMissionService.doRealMission(condition);
      this.success();
      Promise.all([ promise ]).then();
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
      const [ result, count ] = await ctx.service.realMissionService.getRealMissionForUser(option);
      // const count = await this.getFindModelCount('UserMissionTask', query);
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
  async getRealMissionDetail(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('uuidRule',
        'uuid');
      if (!condition) {
        return;
      }
      const result = await ctx.service.realMissionService.getRealMissionDetail(condition);
      this.success(result);
    } catch (e) {
      this.failure(e);
    }
  }

  async updateRealMission(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('missionRules.updateRealMissionRule',
        'title', 'type', 'reward', 'requireTimes', 'uuid',
        'limit', 'picUrl', 'extraSwitch', 'extraBonusAmount', 'extraBonusRate', 'status');
      if (!condition) {
        return;
      }
      const result = await ctx.service.realMissionService.updateRealMission(condition);
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
  async finishRealMission_extra(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('uuidRule',
        'uuid');
      if (!condition) {
        return;
      }
      const result = await ctx.service.realMissionService.finishRealMission_extra(condition);
      this.success(result);
    } catch (e) {
      this.failure(e);
    }
  }
}
module.exports = realMissionController;
