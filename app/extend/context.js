let {DateTime} = require('luxon');
module.exports = {
    //解密方法
    /**
     * @return {Date}
     */
    getAbsoluteDate: function (useHour = false, date = new Date()) {
        if (!useHour) {
            date.setHours(0);
        }
        date.setMinutes(0, 0, 0);
        return date;
    },
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    randomString: function (length) {
        let chars = '012345678!%^&$#@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    },
    getDateByPeriod: function (period) {
        let beginDate;
        let end = DateTime.fromISO(this.getAbsoluteDate().toISOString());
        switch (period) {

            case `month`:
                beginDate = end.plus({months: -1}).toJSDate();

                break;
            case `week`:
                beginDate = end.plus({week: -1}).toJSDate();

                break;
            case `full`:
                beginDate = undefined;
                break;
        }
        return beginDate;
    }
};
