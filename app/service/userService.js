'use strict';
const BaseService = require('./baseService');
require('moment-timezone');

class UserService extends BaseService {

  async getMyTodayIncoming() {
    const thisDay = this.getTimeQueryByPeriod('本日');
    return this.ctx.model.UserAccount.aggregate([
      { $match: { uuid: this.ctx.user.uuid } },
      {
        $project: {
          tel_number: 1,
          nickName: 1,
          balanceList: 1,
        },
      },
      {
        $project: {
          items: {
            $filter: {
              input: '$balanceList',
              as: 'item',
              cond: {
                $and:
                  [
                    { $gte: [ '$$item.createTime', thisDay.created_at.$gte ] },
                    { $lte: [ '$$item.createTime', thisDay.created_at.$lte ] },
                    { $eq: [ '$$item.income', '获得' ] },
                  ],
              },
            },
          },
          tel_number: 1,
          nickName: 1,
        },
      },
      {
        $unwind: {
          path: '$items',
          preserveNullAndEmptyArrays: true,
        },
      },
      // { $match: { '$items.income': '消费' } },
      {
        $group: {
          _id: '$tel_number',
          todayIncoming: { $sum: '$items.amount' },
          tel_number: { $first: '$tel_number' },
          nickName: { $first: '$nickName' },
        },
      },
    ]);
  }


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


  // async syncingTasks(user) { // 把mission同步为missionTracker
  //
  //   const promiseArray = [];
  //   const closedMissionArray = await this.ctx.service.missionProcessingTrackerService.requireMissionToTrack('disable');
  //
  //   for (const missionElement of closedMissionArray) {
  //     const modelName = missionElement._id + 'MissionProcessingTracker';
  //     missionElement.missions.forEach(littleMission => {
  //       const promise = this.ctx.model[modelName].deleteOne({ missionID: littleMission._id });
  //       promiseArray.push(promise);
  //     });
  //   }
  //
  //   const requireMissionResult = await this.ctx.service.missionProcessingTrackerService.requireMissionToTrack('enable');
  //
  //
  //   requireMissionResult.forEach(missionArray => {
  //     if ([ 'Weekly', 'Daily', 'Permanent' ].includes(missionArray._id)) {
  //       missionArray.missions.forEach(async mission => {
  //         const conditions = {
  //           userID: user._id,
  //           missionID: mission._id,
  //           missionEventName: mission.title,
  //           requireAmount: mission.requireAmount,
  //         };
  //         const modelName = missionArray._id + 'MissionProcessingTracker';
  //
  //         switch (missionArray._id) {
  //           case 'Permanent':
  //             conditions.effectDay = 'Permanent';
  //             break;
  //           case 'Daily':
  //             conditions.effectDay = this.ctx.app.getFormatDate(new Date());
  //             break;
  //           case 'Weekly':
  //             conditions.effectDay = this.ctx.app.getFormatWeek(new Date());
  //             break;
  //           default:break;
  //         }
  //         const missionTracker = await this.ctx.model[modelName].findOne(conditions);
  //         if (this.ctx.helper.isEmpty(missionTracker)) {
  //           const newMissionTracker = new this.ctx.model[modelName](conditions);
  //
  //           const savePromise = newMissionTracker.save();
  //           promiseArray.push(savePromise);
  //         }
  //       });
  //     }
  //   });
  //   Promise.all(promiseArray).then();
  //   return requireMissionResult;
  // }

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
        this.ctx.throw('找不到这个推荐码');
      }
      return userResult._id;
    }
  }

  async addUser(user, inviteCode = '') {

    const userNew = new this.ctx.model.UserAccount(user);
    if (!this.isEmpty(inviteCode)) {
      userNew.referrer = await this.getReferrerID(inviteCode);

      if (!this.ctx.helper.isEmpty(userNew.referrer)) {
        await this.ctx.model.UserAccount.findOneAndUpdate({
          _id: userNew.referrer,
        }, { $push: { referrals: userNew._id } });
        // this.ctx.app.eventEmitter.emit('normalMissionCount', userNew.referrer, '每日邀新人');
        // this.ctx.app.eventEmitter.emit('normalMissionCount', userNew.referrer, '每周邀新人');
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
      { $match: { category: { $regex: '.*活动奖励-邀请.*' } } },
      { $group: {
        _id: '$tel_number',
        totalAmount: { $sum: '$amount' },
      } },
    ]);

    let totalAmount = 0;
    if (!this.isEmpty(userAmount) && userAmount.length > 0) {
      totalAmount = userAmount[0].totalAmount;
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
    if (this.isEmpty(referrer)) {
      this.ctx.throw(400, '找不到该用户');
    }
    await this.ctx.service.analyzeLogService.recordPersonalBcoinChange(referrer, reward, '获得', '返利');
    const newMoney = Number(referrer.Bcoins) + Number(reward);
    const content = '活动奖励-邀请返利';
    const category = '返利';
    await this.ctx.service.analyzeService.dataIncrementRecord(content, reward, 'bcoin', category);
    await this.setUserBcionChange(referrer.uuid, content, '获得', reward, newMoney);
  }


  async modifyUserRcoin(condition) {
    const user = await this.ctx.model.UserAccount.findOne({ tel_number: condition.tel_number });
    if (this.isEmpty(user)) {
      this.ctx.throw(400, '找不到该用户');
    }
    const newMoney = Number(user.Bcoins) + Number(condition.amount);
    const content = !this.isEmpty(condition.content) ? condition.content : '活动奖励-人工设置';
    const category = !this.isEmpty(condition.category) ? condition.category : '活动';
    let income;
    if (condition.amount > 0) {
      income = '获得';
    } else {
      if (Number(user.Bcoins) + Number(condition.amount) < 0) {
        this.ctx.throw(200, '用户余额不足');
      }
      income = '消费';
    }
    await this.ctx.service.analyzeService.dataIncrementRecord(content, condition.amount, 'bcoin', category);
    await this.setUserBcionChange(user.uuid, content, income, condition.amount, newMoney);
    if (condition.category === '广告') {
      await this.ctx.service.analyzeService.recordAdvIncrease(condition._id, user._id, 1, 'close');
    }
    const setting = await this.ctx.model.SystemSetting.findOne();
    const amount = Number(condition.amount).toFixed(0);
    const rate = setting.rewardPercent / 100;
    if (!this.isEmpty(user.referrer) && Number(condition.amount) > 0) {
      const reward = rate * Number(condition.amount);
      await this.ctx.service.analyzeLogService.recordPersonalBcoinChange(user, Number(amount), '贡献', '给利');
      await this.referrerReward(user.referrer, reward);
    }

    await this.ctx.service.analyzeLogService.recordPersonalBcoinChange(user, Number(amount), income);
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

  async getUserBalanceList(userUUid, option) {

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
        // created_at: { $dateToString: { format: '%Y-%m-%d %H:%M:%S', date: '$created_at', timezone: '+08:00' } },
        'balanceList._id': 0,
      },
    },
    {
      $project: {
        totalCount: 1,
        // created_at: { $dateToString: { format: '%Y-%m-%d %H:%M:%S', date: '$created_at', timezone: '+08:00' } },
        'balanceList.income': 1,
        'balanceList.amount': 1,
        'balanceList.category': 1,
        'balanceList.createTime': { $dateToString: { format: '%Y-%m-%d %H:%M:%S', date: '$balanceList.createTime', timezone: '+08:00' } },
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
