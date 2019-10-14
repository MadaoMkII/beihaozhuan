'use strict';
const Service = require('egg').Service;
require('moment-timezone');
class WeChatService extends Service {

  async signString(signObject) {
    let signStr = '';
    Object.keys(signObject).sort().forEach((key, index) => {
      if (index !== 0) signStr += '&';
      signStr += `${key}=${signObject[key]}`;
    });
    // `jsapi_ticket=${jsapi_ticket}&noncestr=${randomStr}&timestamp=${timeStamp}&url=${url}`;
    const sha1 = require('sha1');
    return [ signStr, sha1(signStr) ];
  }

  async setToken() {
    const requestObj_1 = {
      appid: this.ctx.app.config.wechatConfig.appid,
      secret: this.ctx.app.config.wechatConfig.secret,
      grant_type: 'client_credential',
    };

    const [ result_1 ] = await this.app.requestMethod(requestObj_1,
      'GET', 'https://api.weixin.qq.com/cgi-bin/token');

    if (!this.ctx.helper.isEmpty(result_1.errcode)) {
      this.ctx.throw(400, result_1.errmsg);
    }

    // await this.ctx.model.Setting.findOneAndUpdate({ }, { $set: { access_token: result_1.access_token } }, { upsert: true });

    // '26_EpDz1uSWyf3ZQPW2ZCmN49rx8RlPXSA6z_e8NKSHGbUFCbiJWJFDWvfSLKKIg8FCkz2_XEuxNoEsRgPhy0SEeQU60H2kuceAXVjOHjgzSGGd7PrW9vh5OqwgPaq7AoiYpOB9Wpsd0og6UdMoFDGdAIAYWZ'
    const requestObj_2 = {
      access_token: result_1.access_token,
      type: 'jsapi',
    };
    const [ result_2 ] = await this.app.requestMethod(requestObj_2,
      'GET', 'https://api.weixin.qq.com/cgi-bin/ticket/getticket');

    if (result_2.errcode !== 0) {
      this.ctx.throw(400, result_2.errmsg);
    }
    console.log(result_2);
    // await this.ctx.model.Setting.findOneAndUpdate({ jsapi_ticket: null }, { $set: { jsapi_ticket: result_2.ticket } });
    return result_2.ticket;
  }

}

module.exports = WeChatService;
