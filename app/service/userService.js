'use strict';
const BaseService = require('./baseService');
require('moment-timezone');

class UserService extends BaseService {

  async setUserBcionChange(user_uuid, category, income, amount, tempBcoin) {
    const newBcionChange = {
      category,
      income,
      amount,
      createTime: new Date(), // 必须加入那些代码
    };
    return this.ctx.model.UserAccount.findOneAndUpdate({ uuid: user_uuid },
      { $push: { balanceList: newBcionChange }, $set: { Bcoins: tempBcoin } }, { new: true });

  }


  async syncingTasks(user) { // 把mission同步为missionTracker

    const promiseArray = [];
    const closedMissionArray = await this.ctx.service.missionProcessingTrackerService.requireMissionToTrack('disable');

    for (const missionElement of closedMissionArray) {
      const modelName = missionElement._id + 'MissionProcessingTracker';
      missionElement.missions.forEach(littleMission => {
        const promise = this.ctx.model[modelName].deleteOne({ missionID: littleMission._id });
        promiseArray.push(promise);
      });
    }

    const requireMissionResult = await this.ctx.service.missionProcessingTrackerService.requireMissionToTrack('enable');


    requireMissionResult.forEach(missionArray => {
      if ([ 'Weekly', 'Daily', 'Permanent' ].includes(missionArray._id)) {
        missionArray.missions.forEach(async mission => {
          const conditions = {
            userID: user._id,
            missionID: mission._id,
            missionEventName: mission.title,
            requireAmount: mission.requireAmount,
          };
          const modelName = missionArray._id + 'MissionProcessingTracker';

          switch (missionArray._id) {
            case 'Permanent':
              conditions.effectDay = 'Permanent';
              break;
            case 'Daily':
              conditions.effectDay = this.ctx.app.getFormatDate(new Date());
              break;
            case 'Weekly':
              conditions.effectDay = this.ctx.app.getFormatWeek(new Date());
              break;
            default:break;
          }
          const missionTracker = await this.ctx.model[modelName].findOne(conditions);
          if (this.ctx.helper.isEmpty(missionTracker)) {
            const newMissionTracker = new this.ctx.model[modelName](conditions);

            const savePromise = newMissionTracker.save();
            promiseArray.push(savePromise);
          }
        });
      }
    });
    Promise.all(promiseArray).then();
    return requireMissionResult;
  }

  async updateUser(user_uuid, userObj) {
    delete userObj.uuid;
    return this.ctx.model.UserAccount.findOneAndUpdate({ uuid: user_uuid }, { $set: userObj }, { new: true });
  }

  async updateUserPassword(tel_number, newPassword) {
    return this.ctx.model.UserAccount.findOneAndUpdate({ tel_number },
      { $set: { password: newPassword } }, { new: true });
  }

  async updateUser_login(user) {
    return this.ctx.model.UserAccount.findOneAndUpdate({ uuid: user.uuid }, {
      $inc: { loginTimes: 1 },
    }, { new: true });
  }

  async getReferrerID(inviteCode) {

    if (!this.ctx.helper.isEmpty(inviteCode)) {
      const userResult = await this.ctx.model.UserAccount.findOne({
        inviteCode,
      });
      if (!userResult) {
        this.ctx.throw('zhaobudao');
      }
      return userResult._id;
    }
  }

  async addUser(user, inviteCode) {

    const userNew = this.ctx.model.UserAccount(user);
    if (!this.ctx.helper.isEmpty(inviteCode)) {
      userNew.referrer = await this.getReferrerID(inviteCode);

      if (!this.ctx.helper.isEmpty(userNew.referrer)) {
        await this.ctx.model.UserAccount.findOneAndUpdate({
          _id: userNew.referrer,
        }, { $push: { referrals: userNew._id } });
        this.ctx.app.eventEmitter.emit('normalMissionCount', userNew.referrer, '每日邀新人');
        this.ctx.app.eventEmitter.emit('normalMissionCount', userNew.referrer, '每周邀新人');
      }
    }
    await userNew.save();
    return userNew;
  }

  async getUser(user, project) {
    return this.ctx.model.UserAccount.findOne(user, project);
  }

  async getMyTeam(user_uuid, option) {
    const result = await this.ctx.model.UserAccount.findOne({ uuid: user_uuid });
    const userAmount = await this.ctx.model.UserAccount.aggregate([

      { $match: { uuid: user_uuid } },
      { $project: {
        tel_number: 1,
        balanceList: 1,
      } },
      { $unwind: '$balanceList' },
      { $project: {
        tel_number: 1,
        amount: '$balanceList.amount',
        category: '$balanceList.category',
      } },
      { $match: { category: '活动奖励-邀请返利' } },
      { $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
      } },
    ]);
    let totalAmount = 0;
    if (!this.app.isEmpty(userAmount) && !this.app.isEmpty(userAmount.totalAmount)) {
      totalAmount = userAmount.totalAmount;
    }
    const count = result.referrals.length;
    const slicedArray = this.ctx.helper.sliceArray(result.referrals, option);
    let membersInfo = await this.ctx.model.UserAccount.aggregate([
      { $match: { _id: { $in: slicedArray } } },
      { $project: {
        tel_number: 1,
        avatar: 1,
        created_at: 1,
        nickName: 1,
        balanceList: 1,
      },
      },
      { $unwind: '$balanceList' },
      { $project: {
        tel_number: 1,
        avatar: 1,
        created_at: 1,
        nickName: 1,
        amount: '$balanceList.amount',
      } },
      { $match: { amount: { $gte: 0 } } },
      { $group: {
        _id: '$tel_number',
        amount: { $sum: '$amount' },
        tel_number: { $first: '$tel_number' },
        avatar: { $first: '$avatar' },
        created_at: { $first: '$created_at' },
        nickName: { $first: '$nickName' },
      } },
    ]);
    membersInfo = membersInfo.map(element => {
      return {
        tel_number: element._id,
        avatar: element.avatar,
        created_at: this.app.getLocalTime(element.created_at),
        nickName: element.nickName,
        amount: element.amount,
      };
    });
    // const result = await this.ctx.model.UserAccount.findOne({ uuid: user_uuid }, { referrals: 1 }).populate({
    //   path: 'referrals',
    //   model: this.ctx.model.UserAccount,
    //   select: 'nickName -_id created_at avatar tel_number',
    // });
    // if (this.ctx.helper.isEmpty(result)) {
    //   return [[], 0 ];
    // }


    return { data: membersInfo, count, totalAmount };
  }
  async referrerReward(userID, reward) {
    const referrer = await this.ctx.model.UserAccount.findOne({ _id: userID });
    if (this.app.isEmpty(referrer)) {
      this.ctx.throw(400, '找不到该用户');
    }

    const newMoney = Number(referrer.Bcoins) + Number(reward);
    const content = '活动奖励-邀请返利';
    const category = '返利';
    await this.ctx.service.analyzeService.dataIncrementRecord(content, reward, 'bcoin', category);
    await this.setUserBcionChange(referrer.uuid, content, '获得', reward, newMoney);
  }
  async modifyUserRcoin(condition) {
    const user = await this.ctx.model.UserAccount.findOne({ tel_number: condition.tel_number });
    if (this.app.isEmpty(user)) {
      this.ctx.throw(400, '找不到该用户');
    }
    const newMoney = Number(user.Bcoins) + Number(condition.amount);
    const content = !this.app.isEmpty(condition.content) ? condition.content : '活动奖励-人工设置';
    const category = !this.app.isEmpty(condition.category) ? condition.category : '活动';
    let income;
    if (condition.amount > 0) {
      income = '获得';
    } else {
      income = '消费';
    }
    await this.ctx.service.analyzeService.dataIncrementRecord(content, condition.amount, 'bcoin', category);
    await this.setUserBcionChange(user.uuid, content, income, condition.amount, newMoney);
    if (condition.category === '广告') {
      await this.ctx.service.analyzeService.recordAdvIncrease(condition._id, user._id, 1, 'close');
    }
    if (!this.app.isEmpty(user.referrer)) {
      const reward = 0.5 * Number(condition.amount);// TODO
      await this.referrerReward(user.referrer, reward);
    }


  }
  async getManyUser(conditions, option, project = {}) {
    if (!this.ctx.helper.isEmpty(conditions.nickName)) {
      conditions.nickName = { $regex: `.*${conditions.nickName}.*` };
    }
    option.sort = { created_at: -1 };
    const count = await this.ctx.model.UserAccount.countDocuments(conditions);
    const data = await this.ctx.model.UserAccount.find(conditions, project, option);
    return [ data, count ];
  }

  async getUserBalanceListRule(userUUid, option) {

    const result = await this.ctx.model.UserAccount.aggregate([{
      $match: {
        uuid: userUUid,
        'balanceList.createTime': {
          $gte: new Date(option.beginDate),
        },
      },
    },
    { $addFields: { totalCount: { $size: '$balanceList' } } },
    { $unwind: '$balanceList' },
    { $sort: { 'balanceList.createTime': -1 } },
    { $limit: option.limit + option.skip },
    { $skip: option.skip },
    // {
    //     $project: {
    //         //sizeAmount: {$size: "$balanceList"},
    //         balanceList: 1,
    //         $count: "passing_scores"
    //         // balanceList: {
    //         //     $slice: ["$balanceList", option.skip, option.limit]
    //         // }
    //     }
    // },
    {
      $project: {
        // updated_at: 0,
        // created_at: 0,
        'balanceList._id': 0,
      },
    },
    {
      $group: {
        _id: null, // type: "$type" 这件事得问问前端
        balanceListArray: { $push: '$balanceList' },
        totalCount: { $first: '$totalCount' },
      },
    },


    ]);
    if (result.length > 0) {
      // let tempArray = result[0].balanceList.sort((a, b) => {
      //     return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
      // });
      const tempArray = result[0];
      // let count = await this.ctx.model[`UserAccount`].find
      return [ tempArray.balanceListArray, tempArray.totalCount ];
    }
    return [];
  }

  async setUserStatus(id, setObj, pushObj) {
    return this.ctx.model.UserAccount.findOneAndUpdate({ _id: id },
      { $set: setObj, $push: pushObj }, { new: true });
  }

  // async setUser(id, setObj, pushObj = {}) {
  //   return this.ctx.model.UserAccount.findOneAndUpdate({ _id: id },
  //     { $set: setObj, $push: pushObj }, { new: true });
  // }
}

module.exports = UserService;
