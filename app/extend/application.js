'use strict';
const crypto = require('crypto');
const setting = require(process.cwd() + '/config/cryptoConfig')();
module.exports = {
  encrypt(plain_text) {
    if (plain_text === undefined || plain_text === '') {
      return;
    }
    if (!isNaN(plain_text)) {
      plain_text = String(plain_text);
    }
    const key = Buffer.from(setting.key, 'utf8');
    const iv = Buffer.from(setting.iv, 'utf8');
    let sign = '';
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    sign += cipher.update(plain_text, 'utf8', 'hex');
    sign += cipher.final('hex');
    return sign;
  },

  decrypt(cipher_text) {
    if (cipher_text === undefined || cipher_text === '') {
      return;
    }
    const key = Buffer.from(setting.key, 'utf8');
    const iv = Buffer.from(setting.iv, 'utf8');
    let src = '';
    const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    src += cipher.update(cipher_text, 'hex', 'utf8');
    src += cipher.final('utf8');
    return src;
  },
  getFormatDate(date = new Date()) {
    const moment = require('moment');
    require('moment-timezone');
    return moment.tz(date, 'Asia/ShangHai').format('YYYYMMDD');
  },
  getLocalTime(date) {
    const moment = require('moment');
    require('moment-timezone');
    return moment.tz(date, 'Asia/ShangHai').format('YYYY/MM/DD HH:mm:ss');
  },
  getFormatDateForJSON(date = new Date()) {
    const { DateTime } = require('luxon');
    const local = DateTime.fromISO(date.toISOString());
    const rezoned = local.setZone('Asia/Shanghai');
    return rezoned.toFormat('yyyy-MM-dd');
  },
  getFormatWeek(date = new Date()) {
    const { DateTime } = require('luxon');
    const local = DateTime.fromISO(date.toISOString());
    const rezoned = local.setZone('Asia/Shanghai');
    return rezoned.weekYear + '/' + rezoned.weekNumber;
  },
  getLocalTimeForFileName(date) {
    const moment = require('moment');
    require('moment-timezone');
    return moment.tz(date, 'Asia/ShangHai').format('YYYY年MM月DD日 HH时mm分ss秒');
  },
  modifyDate(unit, value, date = new Date()) {
    const { DateTime } = require('luxon');
    const modifier = {};
    modifier[unit] = value;
    const local = DateTime.fromJSDate(date);
    const rezoned = local.setZone('Asia/Shanghai').plus(modifier);
    return rezoned;// rezoned.toJSDate();
  },

  getInviteCode() {
    return (Math.random() / 100000 * Date.now() * 3.1415926).toFixed(0);
  },
  getIP(req) {
    let ip = req.get('x-forwarded-for'); // 获取代理前的ip地址
    if (ip && ip.split(',').length > 0) {
      ip = ip.split(',')[0];
    } else {
      ip = req.ip;
    }
    const ipArr = ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g);
    return ipArr && ipArr.length > 0 ? ipArr[0] : '127.0.0.1';
  },

  requestMethod(JSONObject, method, url, certPath, xml = false) {
    const request_ = require('request');
    let requestObj = {};
    if (method === 'GET') {
      const myURL = new URL(url);
      Object.keys(JSONObject)
        .forEach(key => {
          myURL.searchParams.append(key, JSONObject[key]);
        });
      requestObj = {
        url: myURL.href,
        method,
        json: true, // <--Very important!!!
      };
    }
    if (method === 'POST') {
      if (xml) {
        requestObj = {
          url,
          method,
          json: false, // <--Very important!!!
          body: JSONObject,
          agentOptions: {
            pfx: require('fs').readFileSync(certPath), // '../config/apiclient_cert.p12'
            passphrase: this.config.wechatConfig.mchid,
          },
        };
      } else {
        requestObj = {
          url,
          method,
          json: true, // <--Very important!!!
          body: JSONObject,
        };
      }

    }
    return new Promise((resolve, reject) => {

      request_(requestObj, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve([ body, response ]);
        }
      });
    });
  },


};
