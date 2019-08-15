const crypto = require('crypto');
const setting = require(process.cwd() + `/config/cryptoConfig`)();
module.exports = {
    encrypt: function (plain_text) {
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
        const key = Buffer.from(setting.key, 'utf8');
        const iv = Buffer.from(setting.iv, 'utf8');
        let src = '';
        const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        src += cipher.update(cipher_text, 'hex', 'utf8');
        src += cipher.final('utf8');
        return src;
    }
};
