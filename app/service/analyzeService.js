'use strict';
const { Service } = require('egg');
const { DateTime } = require('luxon');

class analyzeService extends Service {

  async recordAdvIncrease(advID, userID, amount, type = 'click') {
    const date = this.ctx.getAbsoluteDate();
    await this.ctx.model.AdvRecord.findOneAndUpdate({
      advertisementID: advID,
      absoluteDate: date,
      userID,
      type,
    }, {
      $inc: { amount },
    }, { upsert: true });
  }

  async countByMonth(condition) {

    const resultArray = [];
    let matcher = {};
    if (condition === 'increaseBcoin') {
      matcher = { type: 'bcoin', amount: { $gt: 0 } };
      // matcher = {
      //     content: {
      //         $in: ['完成任务-每日晒收入', '完成任务-完善用户信息', '完成任务-看一个广告', '完成任务-每日看广告',
      //             '完成任务-每日签到', '完成任务-看一个广告', '广告收入', '完成任务-每日邀新人', `活动奖励-双十二`],
      //     },
      // };
    }
    if (condition === 'consumeBcoin') {
      matcher = {
        content: {
          $in: [ '提现' ],
        },
      };
    }
    if (condition === 'userRegister') {
      matcher = {
        content: '用户注册',
      };
    }

    const start = DateTime.fromISO('2019-06-18');
    const end = DateTime.fromISO(this.ctx.getAbsoluteDate().toISOString());
    let diffInMonths = end.diff(start, 'months').months;
    diffInMonths = Math.abs(diffInMonths);
    diffInMonths = Math.ceil(diffInMonths);

    let aggregateResult = await this.ctx.model.DataAnalyze.aggregate([
      {
        $project: {
          YearBy: { $year: { date: '$absoluteDate', timezone: '+0700' } },
          MonthBy: { $month: { date: '$absoluteDate', timezone: '+0700' } },
          amount: 1,
          content: 1,
          type: 1,
        },
      },
      { $match: matcher },
      {
        $group: {
          _id: { year: '$YearBy', month: '$MonthBy' },
          total: { $sum: '$amount' },
        },
      }]);

    const categories = [];
    let innerIndex = 0;
    let total = 0;

    aggregateResult = aggregateResult.sort((a, b) => {
      const aDate = DateTime.local(Number(a._id.year), Number(a._id.month), 1);
      const bDate = DateTime.local(Number(b._id.year), Number(b._id.month), 1);
      return Number(aDate.diff(bDate, 'months'));
    });

    let dateTime = start;
    for (let index = 0; index <= diffInMonths; index++) {
      if (!this.ctx.helper.isEmpty(aggregateResult[innerIndex]) &&
                dateTime.month === aggregateResult[innerIndex]._id.month &&
                dateTime.year === aggregateResult[innerIndex]._id.year) {
        resultArray.push(Math.abs(aggregateResult[innerIndex].total));
        total += aggregateResult[innerIndex].total;
        innerIndex = innerIndex < aggregateResult.length - 1 ? innerIndex + 1 : innerIndex;
      } else {
        resultArray.push(0);
      }
      categories.push(`${dateTime.year}/${dateTime.month}`);
      dateTime = dateTime.plus({ months: 1 });
    }
    total = Math.abs(total);
    return {
      total,
      categories,
      series: [
        { seriesData: resultArray },
      ],
    };
  }

  async countByDays(condition) {
    const resultArray = [];
    const local = DateTime.fromISO(new Date().toISOString());
    const rezoned = local.setZone('Asia/Shanghai');
    let matcher = {};
    if (condition === 'increaseBcoin') {
      matcher = { type: 'bcoin', amount: { $gt: 0 } };
      // matcher = {
      //     content: {
      //         $in: ['完成任务-每日晒收入', '完成任务-完善用户信息', '完成任务-看一个广告', '完成任务-每日看广告',
      //             '完成任务-每日签到', '完成任务-看一个广告', '广告收入', '完成任务-每日邀新人', `活动奖励-双十二`],
      //     },
      // };
    }
    if (condition === 'consumeBcoin') {
      matcher = {
        content: {
          $in: [ '提现' ],
        },
      };
    }
    if (condition === 'userRegister') {
      matcher = {
        content: '用户注册',
      };
    }

    matcher.MonthNew = rezoned.month;

    let aggregateResult = await this.ctx.model.DataAnalyze.aggregate([
      {
        $project: {
          MonthNew: { $month: { date: '$absoluteDate', timezone: '+0800' } },
          DogDay: { $dayOfMonth: { date: '$absoluteDate', timezone: '+0800' } },
          amount: 1,
          content: 1,
          type: 1,
        },
      },
      { $match: matcher },
      {
        $group: {
          _id: '$DogDay',
          total: { $sum: '$amount' },
        },
      }]);
    aggregateResult = aggregateResult.sort((a, b) => {
      return a._id - b._id;
    });
    const categories = [];
    let innerIndex = 0;
    let total = 0;
    const daysOfMonth = new Date(rezoned.year, rezoned.month, 0).getDate();
    for (let index = 1; index <= daysOfMonth; index++) {
      if (aggregateResult[innerIndex] && index === aggregateResult[innerIndex]._id) {
        resultArray.push(Math.abs(aggregateResult[innerIndex].total));
        total += aggregateResult[innerIndex].total;
        innerIndex++;
      } else {
        resultArray.push(0);
      }
      categories.push(`${index}号`);
    }
    total = Math.abs(total);
    return {
      total,
      categories,
      series: [
        { seriesData: resultArray },
      ],
    };
  }

  async countByHours(condition) {
    const resultArray = [];
    const local = DateTime.fromISO(new Date().toISOString());
    const rezoned = local.setZone('Asia/Shanghai');
    let matcher = { DogDay: rezoned.day };

    if (condition === 'increaseBcoin') {
      matcher = { type: 'bcoin', amount: { $gt: 0 } };
      // matcher = {
      //   content: {
      //     $in: [ '完成任务-每日晒收入', '完成任务-完善用户信息', '完成任务-看一个广告', '完成任务-每日看广告',
      //       '完成任务-每日签到', '完成任务-看一个广告', '广告收入', '完成任务-每日邀新人' ,`活动奖励-双十二`],
      //   },
      // };
    }
    if (condition === 'consumeBcoin') {
      matcher = {
        content: {
          $in: [ '提现' ],
        },
      };
    }
    if (condition === 'userRegister') {
      matcher = {
        content: '用户注册',
      };
    }

    matcher.DogDay = rezoned.day;
    matcher.DogMonth = rezoned.month;
    let aggregateResult = await this.ctx.model.DataAnalyze.aggregate([
      {
        $project: {
          DogDay: { $dayOfMonth: { date: '$absoluteDate', timezone: '+0800' } },
          DogMonth: { $month: { date: '$absoluteDate', timezone: '+0800' } },
          hourNew: { $hour: { date: '$absoluteDate', timezone: '+0800' } },
          amount: 1,
          content: 1,
          type: 1,
        },
      },
      { $match: matcher },
      {
        $group: {
          _id: '$hourNew',
          total: { $sum: '$amount' },
        },
      }]);
    aggregateResult = aggregateResult.sort((a, b) => {
      return a._id - b._id;
    });

    let innerIndex = 0;
    let total = 0;
    const categories = [];
    for (let index = 0; index < 24; index++) {
      if (!this.ctx.helper.isEmpty(aggregateResult[innerIndex]) && index === aggregateResult[innerIndex]._id) {
        resultArray.push(Math.abs(aggregateResult[innerIndex].total));
        total += aggregateResult[innerIndex].total;
        innerIndex++;
      } else {
        resultArray.push(0);
      }
      const temp = index + 1;
      categories.push(`${temp}:00`);
    }
    total = Math.abs(total);
    return {
      total,
      categories,
      series: [
        { seriesData: resultArray },
      ],
    };
  }

  async getAdvDetail(conditions, option) {

    if (!this.ctx.helper.isEmpty(conditions.title)) {
      conditions.title = { $regex: `.*${conditions.title}.*` };
    }

    const advertisementArray = await this.ctx.model.Advertisement.find({ uuid: conditions.uuid });
    let matcher = {};
    if (!this.ctx.helper.isEmpty(conditions.tel_number)) {
      matcher = { match: { tel_number: conditions.tel_number } };
    }


    let result = [];
    for (let i = advertisementArray.length - 1; i >= 0; i--) {
      const advertisement = advertisementArray[i];
      const aggregateResult = await this.ctx.model.AdvRecord.find({ advertisementID: advertisement._id },
        { _id: 0 }).populate([{
        path: 'userID',
        model: this.ctx.model.UserAccount,
        matcher,
        select: '-_id tel_number avatar',
      }, {
        path: 'advertisementID',
        model: this.ctx.model.Advertisement,
        select: '-_id title source reward positionName activity',
      }]);
      result.push(...aggregateResult);
    }
    result = result.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // 不用aggregate 很难分页
    return [ this.ctx.helper.sliceArray(result, option), result.length ];
    // let endIndex = (option.skip + option.limit) > result.length ? result.length : (option.skip + option.limit);
    // return [result.slice(option.skip, endIndex), result.length];
  }

  async countAdv(option, source) {

    if (this.ctx.helper.isEmpty(source)) {
      source = {
        $not: { $eq: null },
      };

    }
    const aggregateResult = await this.ctx.model.AdvRecord.aggregate([
      {
        $lookup:
                    {
                      from: 'Advertisement',
                      localField: 'advertisementID',
                      foreignField: '_id',
                      as: 'AdvertisementObj',
                    },
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: [ '$AdvertisementObj', 0 ] }, '$$ROOT' ] } },
      },
      {
        $project:
                    {
                      positionName: 1,
                      type: 1,
                      advertisementID: 1,
                      amount: 1,
                      source: 1,
                      updated_at: 1, title: 1,
                      reward: 1, activity: 1, uuid: 1,
                    },
      },

      {
        $group: {
          _id: { advertisementID: '$advertisementID', type: '$type' }, // type: "$type" 这件事得问问前端
          total: { $sum: '$amount' },
          positionName: { $first: '$positionName' },
          source: { $first: '$source' },
          updated_at: { $first: '$updated_at' },
          reward: { $first: '$reward' },
          activity: { $first: '$activity' },
          uuid: { $first: '$uuid' },
          title: { $first: '$title' },
        },
      },
      {
        $match: { source, '_id.type': 'close' },
      },
      {
        $addFields: {
          rewardInt: { $toInt: '$reward' },
        },
      },
      {
        $project:
                    {
                      _id: 0,
                      positionName: '$positionName',
                      totalAmount: { $multiply: [ '$total', '$rewardInt' ] },
                      commission: { $multiply: [ '$total', '$rewardInt', 0.0001 ] },
                      type: 1,
                      advertisementID: 1,
                      total: 1, title: 1,
                      source: 1,
                      updated_at: 1, activity: 1, uuid: 1,
                    },
      },
    ]);

    const count = aggregateResult.length;
    const result = aggregateResult.slice(option.skip, option.skip + option.limit);
    return [ result, count ];

  }

  async countAdvForChart(beginDate = new Date('2019-08-30')) {
    let aggregateResult = await this.ctx.model.AdvRecord.aggregate([
      { $match: { absoluteDate: { $gte: beginDate } } },
      {
        $lookup:
                    {
                      from: 'Advertisement',
                      localField: 'advertisementID',
                      foreignField: '_id',
                      as: 'AdvertisementObj',
                    },
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: [ '$AdvertisementObj', 0 ] }, '$$ROOT' ] } },
      },
      {
        $group: {
          _id: { advertisementID: '$advertisementID', type: '$type' }, // type: "$type" 这件事得问问前端
          total: { $sum: '$amount' },
          title: { $first: '$title' },
          type: { $first: '$type' },
        },
      },
      {
        $project:
                    {
                      _id: 0,
                      title: '$title',
                      // totalAmount: {$multiply: ["$total", "$rewardInt"]},
                      advertisementID: '$_id.advertisementID',
                      type: 1,
                      total: 1,
                    },
      },
    ]);

    aggregateResult = aggregateResult.sort((a, b) => {
      return a.type - b.type;
    });


    const categories = [];
    const seriesData_1 = [];
    const seriesData_2 = [];

    let totalAmount = 0;
    const clickList = aggregateResult.filter(element => {
      return element.type === 'click';
    });
    const closeList = aggregateResult.filter(element => {
      return element.type === 'close';
    });

    clickList.forEach(element => {
      categories.push(element.title);
      seriesData_1.push(element.total);
      const closer = closeList.find(value => {
        return value.advertisementID.toString() === element.advertisementID.toString();

      });
      const closeTotal = undefined === closer ? 0 : closer.total;
      seriesData_2.push(closeTotal);
      totalAmount += element.total + closeTotal;
    });

    return {
      total: totalAmount, categories, series: [
        { seriesData: seriesData_1 }, { seriesData: seriesData_2 },
      ],
    };

  }


  async countGoodForChart(beginDate = new Date('2019-08-30')) {
    let aggregateResult = await this.ctx.model.OrderTracker.aggregate([
      { $match: { created_at: { $gte: beginDate } } },
      // {
      //     $lookup:
      //         {
      //             from: "Good",
      //             localField: "goodID",
      //             foreignField: "_id",
      //             as: "GoodObj"
      //         }
      // },
      // {
      //     $replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$GoodObj", 0]}, "$$ROOT"]}}
      // },
      {
        $group: {
          _id: { goodID: '$goodID' }, // type: "$type" 这件事得问问前端
          total: { $sum: '$goodPrice' },
          title: { $first: '$title' },
        },
      },
      {
        $project:
                    {
                      _id: 0,
                      title: '$title',
                      total: 1,
                    },
      },
    ]);
    aggregateResult = aggregateResult.sort((a, b) => {
      return a.type - b.type;
    });


    const categories = [];
    const seriesData_1 = [];
    let totalAmount = 0;
    aggregateResult.forEach(element => {
      totalAmount += element.total;
      categories.push(element.title);
      seriesData_1.push(element.total);
    });

    return {
      total: totalAmount, categories, series: [
        { seriesData: seriesData_1 },
      ],
    };
  }


  async dataIncrementRecord(content, amount, type, category) {

    const date = this.ctx.getAbsoluteDate(true);
    const res = await this.ctx.model.DataAnalyze.findOneAndUpdate({
      absoluteDate: date,
      content,
      type, category,
    }, { $inc: { amount } }, { upsert: true, new: true });


  }

}

module.exports = analyzeService;
