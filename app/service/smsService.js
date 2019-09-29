'use strict';
const {Service} = require('egg');

class smsService extends Service {

    constructor(ctx) {
        super(ctx);
        const SMS = require('submail-sms');
        const appID = this.config.smsConfig.APPID;
        const appKey = this.config.smsConfig.APPKEY;
        this.modelCode = this.config.smsConfig.modelCode;
        this.smsObj = new SMS(appID, appKey);
    };

    async sendSmsMessage(code, telNumber) {
        telNumber = `` + telNumber;
        this.smsObj.setProject(this.modelCode).addRecipient(telNumber, {code: code});
        let result = await this.smsObj.send(null);
        return result[0].status === 'success';
    }

}

module.exports = smsService;
