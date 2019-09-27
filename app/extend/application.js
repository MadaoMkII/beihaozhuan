const crypto = require('crypto');
const setting = require(process.cwd() + `/config/cryptoConfig`)();
module.exports = {
    encrypt: function (plain_text) {
        if (!plain_text || plain_text === "") {
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
        if (!cipher_text || cipher_text === "") {
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
    getFormatDate: function () {
        const moment = require(`moment`);
        require(`moment-timezone`);
        return moment.tz(new Date(), "Asia/ShangHai").format(`YYYYMMDD`);
    },
    getLocalTime: function (date) {
        const moment = require(`moment`);
        require(`moment-timezone`);
        return moment.tz(date, "Asia/ShangHai").format(`YYYY/MM/DD HH:mm:ss`);
    },
    getFormatDateForJSON: function (date) {
        let {DateTime} = require('luxon');
        let local = DateTime.fromISO(date.toISOString());
        let rezoned = local.setZone("Asia/Shanghai");
        return rezoned.toFormat(`yyyy-MM-dd`);
    },
    getFormatWeek: function () {
        let {DateTime} = require('luxon');
        let local = DateTime.fromISO(new Date().toISOString());
        let rezoned = local.setZone("Asia/Shanghai");
        return rezoned.weekYear + `/` + rezoned.weekNumber;
    },
    getLocalTimeForFileName: function (date) {
        const moment = require(`moment`);
        require(`moment-timezone`);
        return moment.tz(date, "Asia/ShangHai").format(`YYYY年MM月DD日 HH时mm分ss秒`);
    },
    getInviteCode: function () {
        return (Math.random() / 100000 * Date.now() * 3.1415926).toFixed(0)
    }
};
