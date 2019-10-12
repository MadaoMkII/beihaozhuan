'use strict';
const Controller = require('./baseController');
const { DateTime } = require('luxon');

class LoggerController extends Controller {

  async getLogger(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('loggerRules.findLoggerRule',
        'level', 'beginTime', 'endTime', 'nickName', 'tel_number', 'role', 'unit', 'page');
      if (!condition) {
        return;
      }

      condition.date = { $gte: new Date('2019-09-18') };
      option.sort = { date: -1 };
      if (!ctx.helper.isEmpty(condition.beginTime)) {
        const localTime = DateTime.fromISO(condition.beginTime);
        condition.date.$gte = localTime.plus({ hour: -8 }).toJSDate();
      }
      if (!ctx.helper.isEmpty(condition.endTime)) {
        const localTime = DateTime.fromISO(condition.endTime);
        condition.date.$lte = localTime.plus({ hour: -8 }).toJSDate();
      }

      delete condition.beginTime;
      delete condition.endTime;
      const count = await this.getFindModelCount('Logger', condition);
      const result = await ctx.model.Logger.find(condition, { _id: 0 }, option);
      this.success([ result, count ]);
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = LoggerController;

