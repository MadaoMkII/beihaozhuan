'use strict';
const { Service } = require('egg');

class doubleDecService extends Service {

  async createDoubleDec(goodObj) {
    const good = new this.ctx.model.DoubleDec(goodObj);
    good.save();
  }

  async getManyDoubleDec(conditions, option) {
    // let count = await this.ctx.model.Good.countDocuments(conditions);//estimatedDocumentCount
    return this.ctx.model.DoubleDec.find(conditions, {}, option);
  }


}
module.exports = doubleDecService;
