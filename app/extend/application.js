const crypto = require('crypto');
const setting = require(process.cwd() + `/config/cryptoConfig`)();
module.exports = {
    encrypt: function (plain_text) {
        if (plain_text === undefined || plain_text === "") {
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

    decrypt: function (cipher_text) {
        if (cipher_text === undefined || cipher_text === "") {
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
    getFormatDate: function (date = new Date()) {
        const moment = require(`moment`);
        require(`moment-timezone`);
        return moment.tz(date, "Asia/ShangHai").format(`YYYYMMDD`);
    },
    getLocalTime: function (date) {
        const moment = require(`moment`);
        require(`moment-timezone`);
        return moment.tz(date, "Asia/ShangHai").format(`YYYY/MM/DD HH:mm:ss`);
    },
    getFormatDateForJSON: function (date = new Date()) {
        let {DateTime} = require('luxon');
        let local = DateTime.fromISO(date.toISOString());
        let rezoned = local.setZone("Asia/Shanghai");
        return rezoned.toFormat(`yyyy-MM-dd`);
    },
    getFormatWeek: function (date = new Date()) {
        let {DateTime} = require('luxon');
        let local = DateTime.fromISO(date.toISOString());
        let rezoned = local.setZone("Asia/Shanghai");
        return rezoned.weekYear + `/` + rezoned.weekNumber;
    },
    getLocalTimeForFileName: function (date) {
        const moment = require(`moment`);
        require(`moment-timezone`);
        return moment.tz(date, "Asia/ShangHai").format(`YYYY年MM月DD日 HH时mm分ss秒`);
    },
    getInviteCode: function () {
        return (Math.random() / 100000 * Date.now() * 3.1415926).toFixed(0);
    },
    getIP: function (req) {
        let ip = req.get('x-forwarded-for'); // 获取代理前的ip地址
        if (ip && ip.split(',').length > 0) {
            ip = ip.split(',')[0];
        } else {
            ip = req.ip;
        }
        const ipArr = ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g);
        return ipArr && ipArr.length > 0 ? ipArr[0] : '127.0.0.1';
    }
};
