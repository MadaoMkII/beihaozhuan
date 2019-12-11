'use strict';
const Service = require('egg').Service;
require('../model/mission');

class MissionEventManager extends Service {

  async completeMission(modelName, userID, missionEventName) {
    let effectDay = {};
    switch (modelName) {
      case 'Permanent':
        effectDay = 'Permanent';
        break;
      case 'Daily':
        effectDay = this.ctx.app.getFormatDate(new Date());
        break;
      case 'Weekly':
        effectDay = this.ctx.app.getFormatWeek(new Date());
        break;
      default:break;
    }
    const missionSearcher = {
      userID,
      missionEventName,
      completed: false,
      effectDay,
    };
    const fullModelName = modelName + 'MissionProcessingTracker';
    const missionTracker = await this.ctx.model[fullModelName].findOne(missionSearcher).populate({
      path: 'missionID',
      model: this.ctx.model.Mission,
      select: '-_id reward',
    });
    if (this.ctx.helper.isEmpty(missionTracker)) {
      this.app.logger.warn('完成任务警告', this.ctx, missionSearcher);
      return false;
    }

    if ((missionTracker.recentAmount >= missionTracker.requireAmount) && !missionTracker.completed) {

      const tempBcoin = Number(this.ctx.user.Bcoins) + Number(missionTracker.missionID.reward);

      // const promise_1 = this.ctx.service.userService.changeBcoin(this.ctx.user._id, tempBcoin);

      const promise_2 = this.ctx.service.analyzeService.dataIncrementRecord(`完成任务-${missionTracker.missionEventName}`,
        missionTracker.missionID.reward, 'bcoin',`任务`);
      const promise_3 = this.ctx.service.userService.setUserBcionChange(this.ctx.user.uuid, `完成任务-${missionTracker.missionEventName}`,
        '获得', missionTracker.missionID.reward, tempBcoin);

      const promise_4 = this.ctx.model[fullModelName].findOneAndUpdate({
        userID,
        missionEventName,
        completed: false,
        effectDay,
      }, { $set: { completed: true } }, { new: true });
      Promise.all([ promise_2, promise_3, promise_4 ]).catch(error => {
        this.app.logger.error(error, this.ctx);
      });
      return true;
    }
    this.ctx.throw(400, 'Already complete');

  }


  async getUserDailyMissionProcessing(user_ID) {

    return this.ctx.model.DailyMissionProcessingTracker.find({
      userID: user_ID,
      effectDay: this.ctx.app.getFormatDate(),
    }).populate({ path: 'missionID', model: this.ctx.model.Mission });
  }

  async getUserWeeklyMissionProcessing(user_ID) {

    return this.ctx.model.WeeklyMissionProcessingTracker.find({
      userID: user_ID,
      effectDay: this.ctx.app.getFormatWeek(),
    }).populate({ path: 'missionID', model: this.ctx.model.Mission });
  }

  async getUserPermanentMissionProcessing(user_ID) {

    return this.ctx.model.PermanentMissionProcessingTracker.find({
      userID: user_ID,
      effectDay: 'Permanent',
    }).populate({ path: 'missionID', model: this.ctx.model.Mission });
  }

  async requireMissionToTrack(status) {
    return this.ctx.model.Mission.aggregate([
      { $match: { status } },
      { $group: { _id: '$missionType', missions: { $push: '$$ROOT' } } }, {
        $project: {
          // "missions._id": 0,
          'missions.created_at': 0,
          'missions.updated_at': 0,
          'missions.__v': 0,
        },
      },
    ]);
  }
}

module.exports = MissionEventManager;
