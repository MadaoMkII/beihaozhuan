'use strict';
const EventEmitter = require('events');
const Service = require('egg').Service;

class MissionEventManager extends Service {
  constructor(ctx) {
    super(ctx);
    this.eventEmitter = new EventEmitter();
  }

  async setMissions(missions, missionModelName) {
    for (const mission of missions) {
      if (mission.completed) {
        continue;
      }
      this.eventEmitter.on(mission.missionEventName, async userId => {
        const missionSearcher = {
          userID: userId,
          missionID: mission.missionID._id,
          effectDay: mission.effectDay,
          missionEventName: mission.missionEventName,
        };
        const res = await this.ctx.model[missionModelName].findOneAndUpdate(missionSearcher,
          { $inc: { recentAmount: 1 } },
          { new: true });
        if (!res) {
          this.ctx.throw(400, 'initMissionEventManager Error');
        }
      });
    }

  }

  async getAndInitMissionEvent(user) {
    if (this.ctx.helper.isEmpty(this.eventEmitter.eventNames()) || this.eventEmitter.eventNames().length === 0) {
      const dailyMissions = await this.ctx.service.missionProcessingTrackerService.getUserDailyMissionProcessing(user._id);
      await this.setMissions(dailyMissions, 'DailyMissionProcessingTracker');

      const permanentMission = await this.ctx.service.missionProcessingTrackerService.getUserPermanentMissionProcessing(user._id);
      await this.setMissions(permanentMission, 'PermanentMissionProcessingTracker');

      const weeklyMission = await this.ctx.service.missionProcessingTrackerService.getUserWeeklyMissionProcessing(user._id);
      await this.setMissions(weeklyMission, 'WeeklyMissionProcessingTracker');
    }
    return this.eventEmitter;
  }

  async getEventEmitter() {
    return this.eventEmitter;
  }
}

module.exports = MissionEventManager;
