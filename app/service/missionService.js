'use strict';
const { Service } = require('egg');

class missionService extends Service {
  async createMission(missionObj) {
    const mission = new this.ctx.model.Mission(missionObj);
    await mission.save();
    return mission;
  }

  async updateMission(missionObj) {
    const missionUUid = missionObj.uuid;
    delete missionObj.uuid;
    return this.ctx.model.Mission.findOneAndUpdate({ UUid: missionUUid },
      { $set: missionObj }, { new: true });
  }

  async getMission(condition, option) {
    return this.ctx.model.Mission.find(condition, {}, option);
  }

  async setMissionStatus(condition) {
    return this.ctx.model.Mission.findOneAndUpdate({ UUid: condition.uuid },
      { $set: { status: condition.status } }, { new: true });
  }
}

module.exports = missionService;
