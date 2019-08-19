'use strict';
const {Service} = require('egg');

class missionService extends Service {
    async createMission(missionObj) {
        let mission = new this.ctx.model.Mission(missionObj);
        mission.save();
        return mission;
    }
}

module.exports = missionService;