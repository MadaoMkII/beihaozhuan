'use strict';
const {Service} = require('egg');

class orderTracker extends Service {
    async makeOrder(order) {

        const good = await this.service.goodService.getGood(order.goodUUid);
        if (!good) {
            return this.ctx.throw(400, `can not find good`);
        }
        if (good.price > this.ctx.user.Bcoins) {
            return this.ctx.throw(400, `user cannot offer this good`);
        }

        let newUser = await this.ctx.service.userService.changeUserMoney(this.ctx.user._id, this.ctx.user.Bcoins - good.price);
        console.log(newUser)
        order.goodCategory = good.category;
        order.goodPrice = good.price;
        let consumerTracker = new this.ctx.model.OrderTracker(order);
        consumerTracker.save();
    }
}

module.exports = orderTracker;