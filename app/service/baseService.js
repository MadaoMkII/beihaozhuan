'use strict';

const { Service } = require('egg');
const { DateTime } = require('luxon');
class BaseService extends Service {
  getAbsoluteDate(useHour = false, date = new Date()) {
    if (!useHour) {
      date.setHours(0);
    }
    date.setMinutes(0, 0, 0);
    return date;
  }

  getBeginAndEndTimeByDate(beginTime, endTime) {
    const beginTime_dateTime = DateTime.fromJSDate(beginTime).reconfigure({ locale: 'zh-CN' });
    const endTime_dateTime = DateTime.fromJSDate(endTime).reconfigure({ locale: 'zh-CN' });
    return [ beginTime_dateTime.startOf('day').toJSDate(), endTime_dateTime.endOf('day').toJSDate() ];
  }

  getTimeQueryByPeriod(period, date = new Date(), queryName = 'created_at') {
    const thisPeriod = {};
    const referenceDay = date;
    const dateTime = DateTime.fromJSDate(new Date()).reconfigure({ locale: 'zh-CN' });
    const midDayOfYear = dateTime.set({ ordinal: 183 }).toISODate();
    const dataTimeOfReferenceDay = DateTime.fromJSDate(referenceDay);
    const returnValue = {};
    switch (period) {
      case '本年':
        thisPeriod.endTime = dataTimeOfReferenceDay.endOf('years').toJSDate();
        thisPeriod.beginTime = dataTimeOfReferenceDay.startOf('years').toJSDate();
        break;
      case '本半年':
        if (dateTime.get('quarter') >= 3) { // 后半年
          thisPeriod.endTime = dataTimeOfReferenceDay.endOf('years').toJSDate();
          thisPeriod.beginTime = midDayOfYear;
        } else {
          thisPeriod.endTime = midDayOfYear;
          thisPeriod.beginTime = dataTimeOfReferenceDay.startOf('years').toJSDate();
        }
        break;
      case '本季度':
        thisPeriod.endTime = dataTimeOfReferenceDay.endOf('quarter').toJSDate();
        thisPeriod.beginTime = dataTimeOfReferenceDay.startOf('quarter').toJSDate();
        break;
      case '本周':
        thisPeriod.endTime = dataTimeOfReferenceDay.endOf('week').toJSDate();
        thisPeriod.beginTime = dataTimeOfReferenceDay.startOf('week').toJSDate();
        break;
      case '本月':
        thisPeriod.endTime = dataTimeOfReferenceDay.endOf('month').toJSDate();
        thisPeriod.beginTime = dataTimeOfReferenceDay.startOf('month').toJSDate();
        break;
      case '本日':
        thisPeriod.endTime = dataTimeOfReferenceDay.endOf('day').toJSDate();
        thisPeriod.beginTime = dataTimeOfReferenceDay.startOf('day').toJSDate();
        break;
      default:
        this.ctx.throw(400, '输入period错误');
        break;
    }
    returnValue[queryName] = { $gte: thisPeriod.beginTime, $lte: thisPeriod.endTime };
    return returnValue;
  }

  async dataIncrementRecord(content, amount, type, category) {

    const date = this.getAbsoluteDate(true);
    const res = await this.ctx.model.DataAnalyze.findOneAndUpdate({
      absoluteDate: date,
      content,
      type, category,
    }, { $inc: { amount } }, { upsert: true, new: true });

    console.log(res);

  }
  async setUserBcionChange(tel_number, category, income, amount, tempBcoin) {
    const newBcionChange = {
      category,
      income,
      amount,
      createTime: new Date(), // 必须加入那些代码
    };
    return this.ctx.model.UserAccount.findOneAndUpdate({ tel_number },
      { $push: { balanceList: newBcionChange }, $set: { Bcoins: tempBcoin } }, { new: true });

  }
}

module.exports = BaseService;
