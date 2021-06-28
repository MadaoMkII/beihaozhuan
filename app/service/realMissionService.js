'use strict';
const BaseService = require('./baseService');

class realMissionService extends BaseService {

  async updateRealMission(condition) {
    await this.ctx.model.RealMission.updateOne({ uuid: condition.uuid }, { $set: condition });
  }

  async getRealMissionDetail(condition) {
    return this.ctx.model.RealMission.findOne({ uuid: condition.uuid });
  }

  async doRealMission(condition) {
    const user = this.ctx.user;
    const missions = await this.ctx.model.UserMissionTask.find({
      tel_number: user.tel_number,
      type: condition.type,
      status: '进行中',
    });
    // if (this.app.isEmpty(missions)) {
    //   this.ctx.throw(400, '任务已经过期，请重新登录');
    // }
    // 日后有多段判断 就用现在的完成数X需要完成数 % 每轮的需求书 求余数
    for (const mission of missions) {
      if (mission.recentTimes >= mission.requireTimes) {
        continue;
      }
      if (mission.recentTimes + 1 >= mission.requireTimes) {
        await this.ctx.model.UserMissionTask.updateOne({ uuid: mission.uuid }, {
          $set: { status: '等待领取', recentTimes: mission.requireTimes },
        });
      } else {
        await this.ctx.model.UserMissionTask.updateOne({ uuid: mission.uuid }, {
          $inc: { recentTimes: 1 },
        });
      }
    }
  }

  async syncingMissionTasks(user) {
    const missions = await this.ctx.model.RealMission.find({ status: 'enable' });
    const userTaskArray = [];
    await this.ctx.model.UserMissionTask.updateMany({
      tel_number: user.tel_number,
      status: '进行中',
    },
    { $set: { status: '过期' } });
    for (const mission of missions) {
      const uuid = 'UM' + require('cuid')();
      const userTask = {
        uuid,
        title: mission.title,
        mission_id: mission._id,
        picUrl: mission.picUrl,
        type: mission.type,
        reward: mission.reward,
        requireTimes: mission.requireTimes,
        recentTimes: 0,
        limit: mission.limit,
        finishedTimes: 0,
        status: '进行中',
        tel_number: user.tel_number,
        nickName: user.nickName,
        extraBonus: {
          switch: mission.extraSwitch,
          finished: false,
          amount: mission.extraBonusAmount,
          rate: mission.extraBonusRate,
        },
      };
      userTaskArray.push(userTask);
    }
    await this.ctx.model.UserMissionTask.insertMany(userTaskArray);
    await this.ctx.model.UserAccount.updateOne({ tel_number: user.tel_number },
      { $set: { last_sync_time: new Date() } });
  }

  async createRealMission(condition) {
    const mission = new this.ctx.model.RealMission(condition);
    mission.save();
  }

  async getRealMissionForUser(option) {
    const { user } = this.ctx;
    const query = this.getTimeQueryByPeriod('本日');
    query.tel_number = user.tel_number;
    const project = {
      updated_at: false,
      created_at: false,
      nickName: false,
      tel_number: false,
      finishedTimes: false,
      type: false,
    };
    option.autopopulate = false;
    let list = await this.ctx.model.UserMissionTask.find(query, project, option);
    if (this.isEmpty(list)) {
      await this.syncingMissionTasks(user);
      list = await this.ctx.model.UserMissionTask.find(query, project, option);
    }
    const allMission = await this.ctx.model.RealMission.find({ status: 'enable' }, {
      created_at: false,
      updated_at: false,
      __v: false,
      status: false,
    });
    // if (list.length < allMission.length) {
    //   await this.syncingMissionTasks(this.ctx.user);
    // }
    const result = [];
    for (const mission of allMission) {
      const tempObj = mission;
      const objInList = list.find(e => e.mission_id.equals(mission._id));
      if (!this.isEmpty(objInList)) {
        tempObj._doc.completed = objInList.status === '完成';
        tempObj._doc.status = objInList.status;
        tempObj._doc.recentTimes = objInList.recentTimes > tempObj.requireTimes ? tempObj.requireTimes : objInList.recentTimes;
      } else {
        const uuid = 'UM' + require('cuid')();
        const userTask = {
          uuid,
          title: mission.title,
          mission_id: mission._id,
          picUrl: mission.picUrl,
          type: mission.type,
          reward: mission.reward,
          requireTimes: mission.requireTimes,
          recentTimes: 0,
          limit: mission.limit,
          finishedTimes: 0,
          status: '进行中',
          tel_number: user.tel_number,
          nickName: user.nickName,
          extraBonus: {
            switch: mission.extraSwitch,
            finished: false,
            amount: mission.extraBonusAmount,
            rate: mission.extraBonusRate,
          },
        };
        await this.ctx.model.UserMissionTask.insertMany([ userTask ]);
        tempObj._doc.recentTimes = 0;
      }
      result.push(tempObj);
    }
    return [ result, allMission.length ];
  }

  async finishRealMission(condition) {

    const RM = await this.ctx.model.RealMission.findOne({ uuid: condition.uuid });
    if (this.isEmpty(RM)) {
      this.ctx.throw(400, '找不到这条RM记录');
    }
    const missionTask = await this.ctx.model.UserMissionTask.findOne({
      mission_id: RM._id,
      tel_number: this.ctx.user.tel_number }, {}, { sort: { created_at: -1 } });

    if (this.isEmpty(missionTask)) {
      this.ctx.throw(400, '找不到这条用户记录');
    }
    console.log(missionTask);
    if (missionTask.status === '进行中') {
      this.ctx.throw(400, '这个任务还没有达到领取程度');
    }
    if (missionTask.status === '完成') {
      this.ctx.throw(400, '这个任务已经完成了');
    }
    if (missionTask.recentTimes < missionTask.requireTimes) {
      this.ctx.throw(400, '任务不满足完成条件');
    }
    if (missionTask.status === '过期') {
      this.ctx.throw(400, '你无法完成一个已经过期的臭任务');
    }
    const modifyObj = {
      tel_number: this.ctx.user.tel_number,
      content: `活动奖励-${missionTask.title}`,
      category: '活动奖励',
      amount: missionTask.reward,
    };
    await this.ctx.service.userService.modifyUserRcoin(modifyObj);
    await this.ctx.model.UserMissionTask.updateOne({
      mission_id: RM._id,
      tel_number: this.ctx.user.tel_number }, { $set: { status: '完成' } });
  }

  async finishRealMission_extra(condition) {

    const missionTask = await this.ctx.model.UserMissionTask.findOne({ uuid: condition.uuid });
    if (this.isEmpty(missionTask)) {
      this.ctx.throw(400, '找不到这条记录');
    }
    if (missionTask.extraBonus.switch) {
      this.ctx.throw(400, '这个任务没有开启激励');
    }
    if (missionTask.status !== '完成') {
      this.ctx.throw(400, '这个任务还没有完成呢');
    }

    const amount = missionTask.extraBonus.amount * missionTask.extraBonus.rate;

    const modifyObj = {
      tel_number: this.ctx.user.tel_number,
      content: `活动奖励-激励-${missionTask.title}`,
      category: '活动奖励',
      amount,
    };
    await this.ctx.service.userService.modifyUserRcoin(modifyObj);
    await this.ctx.model.UserMissionTask.updateOne({ uuid: condition.uuid },
      { $set: { 'extraBonus.finished': true } });
  }

  async getRealMissionForAdmin(condition, option) {
    condition.status = { $ne: 'deleted' };
    return this.ctx.model.RealMission.find(condition, {}, option);
  }
}

module.exports = realMissionService;
