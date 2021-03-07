
'use strict';
const BaseService = require('./baseService');
class realMissionService extends BaseService {

  async createRealMission(condition) {
    const mission = new this.ctx.model.RealMission(condition);
    mission.save();
  }
}
module.exports = realMissionService;
