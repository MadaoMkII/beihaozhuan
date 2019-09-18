'use strict';
const Service = require('egg').Service;

class WechatService extends Service {

    async checkIfExist(openID) {
        return this.ctx.model.userAccout.findOne({openID: openID});
    }


}

module.exports = WechatService;