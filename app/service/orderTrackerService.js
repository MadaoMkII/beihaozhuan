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
  async getOneMyOrder(condition) {
    const result = await this.ctx.model.OrderTrack.findOne({ _id: condition.id },
      { title: 1, content: 1, price: 1,
        creator: 1, mainlyShowPicUrl: 1, created_at: 1, good_id: 1,
      });
    if (this.isEmpty(result)) {
      this.ctx.throw(400, '这条记录不存在');
    }
    if (!result.creator._id.equals(this.ctx.user._id)) {
      this.ctx.throw(400, '不是本人创建的');
    }

    result.id = result._id;
    delete result._id;
    delete result.creator;
    result._doc.exchangeWay = result.good_id.exchangeWay;
    result._doc.description = result.good_id.description;
    result._doc.giftExchangeContent = result.good_id.giftExchangeContent;
    result._doc.status = '已完成';
    delete result._doc.good_id;
    delete result._doc.creator;
    // result.contentReview = result.content.replace(/(<([^>]+)>)/ig, '').substring(0, 30);
    return result;
  }
  async getMyOrders(condition, option) {
    let result = await this.ctx.model.OrderTrack.find({ creator: this.ctx.user._id },
      { title: 1, content: 1, price: 1, created_at: 1, mainlyShowPicUrl: 1 }, option);
    result = result.map(e => {
      return {
        contentReview: e.content.replace(/(<([^>]+)>)/ig, '').substring(0, 30),
        title: e.title,
        price: e.price,
        id: e._id,
        created_at: this.app.getLocalTime(e.created_at),
        status: '已完成',
        mainlyShowPicUrl: e.mainlyShowPicUrl,
      };
    });
    return result;
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
      mainlyShowPicUrl: good.mainlyShowPicUrl,
    };
    const consumerTracker = new this.ctx.model.OrderTrack(orderObj);
    consumerTracker.save();
    return good.giftExchangeContent;
  }
}

module.exports = orderTrackerService;
