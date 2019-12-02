'use strict';
const {Service} = require('egg');

class doubleDecService extends Service {

    async createDoubleDec(goodObj) {
        let good = new this.ctx.model.DoubleDec(goodObj);
        good.save();
    };




}
module.exports = doubleDecService;