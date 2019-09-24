'use strict';
const {Service} = require('egg');

class analyzeService extends Service {

    async recordBcoinChange(userID, amount, reason) {
        let date = this.ctx.getAbsoluteDate();
        let bcoinRecordObj = {
            userID: userID,
            amount: amount,
            reason: reason
        };
        if (reason === `广告收益`) {
            await this.ctx.model.UsersBcoinRecord.findOneAndUpdate({absoluteDate: date},
                {$set: {userID: userID, reason: reason}, $inc: {amount: amount}}, {upsert: true});
        } else {
            bcoinRecordObj.absoluteDate = date;
            let bcoinRecord = new this.ctx.model.UsersBcoinRecord(bcoinRecordObj);
            bcoinRecord.save();
        }
    };

    async userIncrementRecord() {
        let date = this.ctx.getAbsoluteDate();
        this.ctx.model.DataAnalyze.findOneAndUpdate({absoluteDate:date},{$set:{}});
    };


}

module.exports = analyzeService;