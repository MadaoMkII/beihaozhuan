'use strict';
const {Service} = require('egg');

class advertisementService extends Service {

    async createAdvertisement(advertising) {
        advertising.uuid = `ADV` + require('cuid')();
        let advertisingObj = new this.ctx.model.Advertisement(advertising);
        advertisingObj.save();
    };





}

module.exports = advertisementService;