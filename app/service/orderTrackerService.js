'use strict';
const BaseService = require('./baseService');
class orderTrackerService extends BaseService {


  // async getExcel(conditions, option) {
  //   const searcher = {};
  //   Object.keys(conditions).forEach(key => {
  //     if (key === 'title') {
  //       searcher.title = { $regex: `.*${conditions.title}.*` };
  //     } else {
  //       searcher[key] = conditions[key];
  //     }
  //   });
  //   // .populate({path: `goodUUid`, model: this.ctx.model.Good})
  //   const allData = this.ctx.model.OrderTracker.find({}, { _id: 0 });
  // }
  //
  // async findOrder(conditions, option) {
  //   const searcher = {};
  //   Object.keys(conditions).forEach(key => {
  //     if (key === 'title') {
  //       searcher.title = { $regex: `.*${conditions.title}.*` };
  //     } else {
  //       searcher[key] = conditions[key];
  //     }
  //   });
  //   //
  //   return this.ctx.model.OrderTracker.find(searcher, {}, option).populate({
  //     path: 'goodID',
  //     model: this.ctx.model.Good, select: '-_id insuranceLink',
  //   });
  // }
  async getMyOrders(condition, option) {
    const result = await this.ctx.model.OrderTrack.find({ creator: this.ctx.uesr._id },
      { title: 1, content: 1, price: 1 }, option);
  }

  async makeOrder(condition) {
    const { user } = this.ctx;
    const good = await this.ctx.model.Good.findOne({ uuid: condition.uuid });
    if (this.isEmpty(good)) {
      this.ctx.throw(400, '找不到这个商品');
    }
    if (good.price > this.ctx.user.Bcoins) {
      this.ctx.throw(400, '余额不足');
    }

    const modifyObj = {
      tel_number: user.tel_number,
      content: `用户消费-${good.title}`,
      category: '用户消费-购买商品',
      amount: -good.price,
    };
    await this.ctx.service.userService.modifyUserRcoin(modifyObj);

    const orderObj = {
      good_id: good._id,
      title: good.title,
      content: good.giftExchangeContent,
      price: good.price,
      creator: user._id,
      tel_number: user.tel_number,

    };
    const consumerTracker = new this.ctx.model.OrderTrack(orderObj);
    consumerTracker.save();
  }
}

module.exports = orderTrackerService;
