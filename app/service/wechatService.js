'use strict';
const Service = require('egg').Service;
require('moment-timezone');
class WeChatService extends Service {
  async toQueryString(obj) {
    return Object.keys(obj)
      .filter(key => key !== 'sign' && obj[key] !== void 0 && obj[key] !== '')
      .sort()
      .map(key => key + '=' + obj[key])
      .join('&');
  }
  async getSign(params, type = 'MD5') {
    const str = await this.toQueryString(params) + '&key=' + this.ctx.app.config.wechatConfig.key;
    let signedStr = '';
    switch (type) {
      case 'MD5':
        signedStr = String(require('md5')(str)).toUpperCase();
        break;
      case 'SHA1':
        signedStr = String(require('sha1')(str)).toUpperCase();
        break;
      default:
        throw new Error('signType Error');
    }
    return [ str, signedStr ];
  }
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

  async withdrew(amount, desc, ip, partner_trade_no) {
    const inputObj = {
      mch_appid: this.ctx.app.config.wechatConfig.appid,
      mchid: this.ctx.app.config.wechatConfig.mchid,
      nonce_str: this.ctx.randomString(32),
      partner_trade_no,
      openid: this.ctx.user.OPENID,
      check_name: 'NO_CHECK',
      re_user_name: '',
      amount,
      desc,
      spbill_create_ip: ip,
    };
    const [ str, signedStr ] = await this.getSign(inputObj);
    inputObj.sign = signedStr;
    console.log(str);
    const xml2js = require('xml2js');
    const builder = new xml2js.Builder({ headless: true, rootName: 'xml' });
    const xml = builder.buildObject(inputObj);

    const path = require('path');
    const appDir = path.dirname(__filename).replace('app\\service', '');

    const [ result ] = await this.ctx.app.requestMethod(xml, 'POST',
      'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
      path.resolve(appDir + '//config/apiclient_cert.p12'), true);
    const parser = new xml2js.Parser({ explicitArray: false, explicitRoot: false });
    return await parser.parseStringPromise(result);
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
