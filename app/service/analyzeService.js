'use strict';
const {Service} = require('egg');
let {DateTime} = require('luxon');

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

    async countByMonth(condition) {

        const resultArray = [];
        let matcher = {content: condition};

        let aggregateResult = await this.ctx.model.DataAnalyze.aggregate([
            {
                "$project": {
                    "YearBy": {"$year": {date: "$absoluteDate", timezone: "+0700"}},
                    "MonthBy": {"$month": {date: "$absoluteDate", timezone: "+0700"}},
                    "amount": 1,
                    "content": 1
                }
            },
            {$match: matcher},
            {
                "$group": {
                    "_id": {year: "$YearBy", month: "$MonthBy"},
                    "total": {"$sum": "$amount"}
                }
            }]);

        let categories = [];
        let innerIndex = 0;
        let total = 0;
        let daysOfMonth = 12;
        aggregateResult = aggregateResult.sort((a, b) => {
            return a._id - b._id;
        });
        for (let index = 1; index <= daysOfMonth; index++) {
            if (!this.ctx.helper.isEmpty(aggregateResult[innerIndex]) && index === aggregateResult[innerIndex]._id) {
                resultArray.push(aggregateResult[innerIndex].total);
                total += aggregateResult[innerIndex].total;
                innerIndex++;
            } else {
                resultArray.push(0);
            }
            categories.push(`${index}x`);
        }
        console.log(resultArray)
        return {
            total: total,
            categories: categories,
            series: [
                {seriesData: resultArray}
            ]
        };
    }

    async countByDays(condition) {

        const resultArray = [];
        let local = DateTime.fromISO(new Date().toISOString());
        let rezoned = local.setZone("Asia/Shanghai");
        let matcher = {MonthNew: rezoned.month};
        matcher.content = condition;
        console.log(matcher)
        let aggregateResult = await this.ctx.model.DataAnalyze.aggregate([
            {
                "$project": {
                    "MonthNew": {"$month": {date: "$absoluteDate", timezone: "+0700"}},
                    "DogDay": {"$dayOfMonth": {date: "$absoluteDate", timezone: "+0700"}},
                    "amount": 1,
                    "content": 1
                }
            },
            {$match: matcher},
            {
                "$group": {
                    "_id": "$DogDay",
                    "total": {"$sum": "$amount"}
                }
            }]);
        console.log(aggregateResult)
        aggregateResult = aggregateResult.sort((a, b) => {
            return a._id - b._id;
        });
        let categories = [];
        let innerIndex = 0;
        let total = 0;
        let daysOfMonth = new Date(rezoned.year, rezoned.month, 0).getDate();
        for (let index = 1; index <= daysOfMonth; index++) {
            if (aggregateResult[innerIndex] && index === aggregateResult[innerIndex]._id) {
                resultArray.push(aggregateResult[innerIndex].total);
                total += aggregateResult[innerIndex].total;
                innerIndex++;
            } else {
                resultArray.push(0);
            }
            categories.push(`${index}号`);
        }
        console.log(resultArray)
        return {
            total: total,
            categories: categories,
            series: [
                {seriesData: resultArray}
            ]
        };
    }

    async countByHours(condition) {
        const resultArray = [];
        let matcher = {content: condition};

        let aggregateResult = await ctx.model.DataAnalyze.aggregate([
            {
                "$project": {
                    "hourNew": {"$hour": {date: "$absoluteDate", timezone: "+0700"}},
                    "amount": 1
                }
            },
            {$match: matcher},
            {
                "$group": {
                    "_id": "$hourNew",
                    "total": {"$sum": "$amount"}
                }
            }]);
        aggregateResult = aggregateResult.sort((a, b) => {
            return a._id - b._id;
        });
        let innerIndex = 0;
        let total = 0;
        let categories = [];
        for (let index = 0; index < 24; index++) {
            if (index === aggregateResult[innerIndex]._id) {
                resultArray.push(aggregateResult[innerIndex].total);
                total += aggregateResult[innerIndex].total;
                innerIndex++;
            } else {
                resultArray.push(0);
            }
            let temp = index + 1;
            categories.push(`${temp}:00`)
        }

        return {
            total: total,
            categories: categories,
            series: [
                {seriesData: resultArray}
            ]
        };
    }

    async dataIncrementRecord(content, amount, type) {
        let date = this.ctx.getAbsoluteDate(true);
        let x = await this.ctx.model.DataAnalyze.findOneAndUpdate({
            absoluteDate: date,
            content: content,
            type: type
        }, {$inc: {amount: amount}}, {upsert: true, new: true});
        console.log(x)
    };


}

module.exports = analyzeService;