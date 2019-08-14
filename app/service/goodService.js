'use strict';
const {Service} = require('egg');

class goodService extends Service {
    async createGood(goodObj) {
        let good = new this.ctx.model.Good(goodObj);
        console.assert(goodObj)
        console.assert(good)
        good.save();
    };

    async getGood(uuid) {
        return await this.ctx.model.Good.findOne({uuid: uuid});
    };

    async getAll() {
        let result = await this.ctx.model.Good.find();
        return result;
    }
}


module.exports = goodService;

