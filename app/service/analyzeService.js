'use strict';
const {Service} = require('egg');
let {DateTime} = require('luxon');

class analyzeService extends Service {

    async recordAdvIncrease(advID, userID, amount, type = "click") {
        let date = this.ctx.getAbsoluteDate();
        await this.ctx.model.AdvRecord.findOneAndUpdate({
            advertisementID: advID,
            absoluteDate: date,
            userID: userID,
            type: type
        }, {
            $inc: {amount: amount}
        }, {upsert: true});
    };

    async countByMonth(condition) {

        const resultArray = [];
        let matcher = {content: condition};

        let start = DateTime.fromISO('2019-06-18');
        let end = DateTime.fromISO(this.ctx.getAbsoluteDate().toISOString());
        let diffInMonths = end.diff(start, 'months').months;
        diffInMonths = Math.abs(diffInMonths);
        diffInMonths = Math.ceil(diffInMonths);

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
        aggregateResult = aggregateResult.sort((a, b) => {
            let aDate = DateTime.local(a._id.year, a._id.month, 1);
            let bDate = DateTime.local(b._id.year, b._id.month, 1);
            return aDate.diff(bDate, "months");
        });

        console.log(aggregateResult)
        let dateTime = start;
        for (let index = 0; index <= diffInMonths; index++) {

            if (!this.ctx.helper.isEmpty(aggregateResult[innerIndex]) &&
                dateTime.month === aggregateResult[innerIndex]._id.month &&
                dateTime.year === aggregateResult[innerIndex]._id.year) {
                resultArray.push(aggregateResult[innerIndex].total);
                total += aggregateResult[innerIndex].total;
                innerIndex = innerIndex < aggregateResult.length - 1 ? innerIndex + 1 : innerIndex;
            } else {
                resultArray.push(0);
            }
            categories.push(`${dateTime.year}/${dateTime.month}`);
            dateTime = dateTime.plus({months: 1});
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
        let local = DateTime.fromISO(new Date().toISOString());
        let rezoned = local.setZone("Asia/Shanghai");
        let matcher = {DogDay: rezoned.day};
        matcher.content = condition;
        let aggregateResult = await this.ctx.model.DataAnalyze.aggregate([
            {
                "$project": {
                    "DogDay": {"$dayOfMonth": {date: "$absoluteDate", timezone: "+0700"}},
                    "hourNew": {"$hour": {date: "$absoluteDate", timezone: "+0700"}},
                    "amount": 1,
                    content: 1,
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
        console.log(aggregateResult)
        let innerIndex = 0;
        let total = 0;
        let categories = [];
        for (let index = 0; index < 24; index++) {
            if (!this.ctx.helper.isEmpty(aggregateResult[innerIndex]) && index === aggregateResult[innerIndex]._id) {
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