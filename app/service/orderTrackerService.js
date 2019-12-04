'use strict';
const { Service } = require('egg');

class orderTrackerService extends Service {


  async getExcel(conditions, option) {
    const searcher = {};
    Object.keys(conditions).forEach(key => {
      if (key === 'title') {
        searcher.title = { $regex: `.*${conditions.title}.*` };
      } else {
        searcher[key] = conditions[key];
      }
    });
    // .populate({path: `goodUUid`, model: this.ctx.model.Good})
    const allData = this.ctx.model.OrderTracker.find({}, { _id: 0 });
  }

  async findOrder(conditions, option) {
    const searcher = {};
    Object.keys(conditions).forEach(key => {
      if (key === 'title') {
        searcher.title = { $regex: `.*${conditions.title}.*` };
      } else {
        searcher[key] = conditions[key];
      }
    });
    //
    return this.ctx.model.OrderTracker.find(searcher, {}, option).populate({
      path: 'goodID',
      model: this.ctx.model.Good, select: '-_id insuranceLink',
    });
  }

  async makeOrder(order) {
    const good = await this.service.goodService.getGood(order.goodUUid);
    if (!good) {
      return this.ctx.throw(400, 'can not find good');
    }
    if (good.price > this.ctx.user.Bcoins) {
      return this.ctx.throw(400, 'user cannot offer this good');
    }
    // const balanceRecord = {
    //   category: '购买商品',
    //   income: '消费',
    //   amount: -good.price,
    //   createTime: new Date(),
    // };
    const promise_1 = this.ctx.service.userService.setUserBcionChange(this.ctx.user.uuid, '购买商品',
      '消费', -good.price, this.ctx.user.Bcoins - good.price);

    order.goodCategory = good.category;
    order.goodPrice = good.price;
    order.title = good.title;
    order.goodID = good._id;
    order.mainlyShowPicUrl = good.mainlyShowPicUrl;
    order.orderUUid = 'ORD' + require('cuid')();
    order.redeemCode = this.ctx.helper.randomNumber(8);

    const consumerTracker = new this.ctx.model.OrderTracker(order);
    const promise_2 = consumerTracker.save();
    Promise.all([ promise_1, promise_2 ]).catch(error => {
      this.app.logger.error(error, this.ctx);
    });
    return order;
  }
}

module.exports = orderTrackerService;
