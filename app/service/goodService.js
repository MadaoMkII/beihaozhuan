'use strict';
const {Service} = require('egg');

class goodService extends Service {
    async createGood(goodObj) {
        let good = new this.ctx.model.Good(goodObj);
        good.save();
    };

    async delGood(uuid) {
        return this.ctx.model.Good.deleteOne({uuid: uuid});
    };

    async getGood(uuid) {

        return this.ctx.model.Good.findOne({uuid: uuid});
    };

    async getManyGood(conditions, option) {

        return this.ctx.model.Good.find(conditions, {}, option);
    }
}


module.exports = goodService;

