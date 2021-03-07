'use strict';
const { DateTime } = require('luxon');
module.exports = {
  // 解密方法
  /**
     * @return {Date}
     */
  getAbsoluteDate(useHour = false, date = new Date()) {
    if (!useHour) {
      date.setHours(0);
    }
    date.setMinutes(0, 0, 0);
    return date;
  },
  sleep: ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  randomString(length) {
    const chars = '012345678abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },
  diffTime(date_A, date_B = new Date(), unit = 'hours') {
    const lastTime = DateTime.fromJSDate(new Date(date_A));
    const nowDate = DateTime.fromJSDate(new Date(date_B));
    return nowDate.diff(lastTime, unit)[unit].toFixed(2);
  },
  getDateByPeriod(period) {
    let beginDate;
    const end = DateTime.fromISO(this.getAbsoluteDate().toISOString());
    switch (period) {
      case 'month':
        beginDate = end.plus({ months: -1 }).toJSDate();
        break;
      case 'week':
        beginDate = end.plus({ week: -1 }).toJSDate();
        break;
      case 'full':
        beginDate = undefined;
        break;
    }
    return beginDate;
  },
};
