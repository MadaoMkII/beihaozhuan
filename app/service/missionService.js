'use strict';
const {Service} = require('egg');

class missionService extends Service {
    async createMission(missionObj) {
        let mission = new this.ctx.model.Mission(missionObj);
        mission.save();
        return mission;
    };

    async updateMission(missionObj) {
        let missionType = missionObj.missionType;
        delete missionObj.missionType;
        console.log(missionObj)
        return this.ctx.model.Mission.findOneAndUpdate({missionType: missionType},
            {$set: missionObj}, {new: true});
    };

    async getMission(condition) {
        return this.ctx.model.Mission.find(condition);
    }
}

module.exports = missionService;