'use strict';
const {Service} = require('egg');

class orderTrackerService extends Service {

    async findOrder(order, option) {
        let searcher = {};
        if (order) {
            if (order.title) {
                searcher.title = {$regex: `.*${order.title}.*`}
            }
            if (order.orderUUid) {
                searcher.orderUUid = order.orderUUid;
            }
        }
        return this.ctx.model.OrderTracker.find(searcher, {}, option);
    };

    async makeOrder(order) {
        const good = await this.service.goodService.getGood(order.goodUUid);
        if (!good) {
            return this.ctx.throw(400, `can not find good`);
        }
        if (good.price > this.ctx.user.Bcoins) {
            return this.ctx.throw(400, `user cannot offer this good`);
        }
        let balanceRecord = {
            category: `shopping`,
            income: false,
            amount: good.price,
            createTime: new Date()
        };
        let newUser = await this.ctx.service.userService.changeBcoin(this.ctx.user._id,
            this.ctx.user.Bcoins - good.price, balanceRecord);
        order.goodCategory = good.category;
        order.goodPrice = good.price;
        order.title = good.title;
        order.orderUUid = `ORD` + require('cuid')();
        let consumerTracker = new this.ctx.model.OrderTracker(order);
        consumerTracker.save();
        return order;
    }
}

module.exports = orderTrackerService;