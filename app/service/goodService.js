'use strict';
const {Service} = require('egg');

class goodService extends Service {
    async createGood(goodObj) {
        let good = new this.ctx.model.Good(goodObj);
        good.save();
    };
    async delGood(uuid) {
        return  this.ctx.model.Good.deleteOne({uuid: uuid});
    };
    async getGood(uuid) {
        return  this.ctx.model.Good.findOne({uuid: uuid});
    };

    async getAll() {
        let result = await this.ctx.model.Good.find();
        return result;
    }
}


module.exports = goodService;

