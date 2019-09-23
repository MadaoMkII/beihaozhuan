'use strict';
const Service = require('egg').Service;
require(`moment-timezone`);

class UsersBcoinRecordService extends Service {

    async recordBcoinChange(amount, reason) {

        let bcoinRecordObj = {
            amount: amount,
            reason: reason
        };
        let bcoinRecord = new this.ctx.model.UsersBcoinRecord(bcoinRecordObj);
        bcoinRecord.save();
    }

}

module.exports = UsersBcoinRecordService;