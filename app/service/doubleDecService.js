'use strict';
const { Service } = require('egg');

class doubleDecService extends Service {

  async createDoubleDec(tel_number_verify, goodObj) {

    await this.ctx.model.DoubleDec.findOneAndUpdate({ tel_number_verify },
      { $set: goodObj }, { new: true, upsert: true });
  }

  async getManyDoubleDec(conditions, option) {
    // let count = await this.ctx.model.Good.countDocuments(conditions);//estimatedDocumentCount
    return this.ctx.model.DoubleDec.find(conditions, {}, option);
  }


}
module.exports = doubleDecService;
