'use strict';
const CryptoJS = require('crypto-js');  //引用AES源码js
const key = CryptoJS.enc.Utf8.parse("12gy122414ABdDEF"); //十六位十六进制数作为秘钥
const iv = CryptoJS.enc.Utf8.parse('AHCdCF12351f3412');
module.exports = {
    /**
     * 产生随机数
     *
     * @param {Number} n - 指定n位数
     * @return {String} see 返回指定长度的字符串
     */
    randomNumber(n) {
        let str = '';

        for (let i = 0; i < n; i++) {
            str += Math.floor(Math.random() * 10);
        }

        return str;
    },
    isEmpty: function (obj) {
        if (obj === undefined) return true;
        if (obj === "") return true;
        if (obj === {}) return true;
        if (obj === []) return true;
        if (obj === null) return true;
        if (obj.constructor.name === "Array" || obj.constructor.name === "String") return obj.length === 0;
        // for (let key in obj) {
        //     if (obj.hasOwnProperty(key) && isEmpty(obj[key])) return true;
        // }
        return false;
    },
    passwordEncrypt: function (password) {

        return require('crypto').createHash('md5').update(password + this.ctx.app.config.saltword).digest('hex');
    },

    /**
     * @description 设置下一步按钮的可点击状态
     * @param {Array} avoidPropertyArray
     * 需要设置状态的按钮的对应jQuery对象
     * @param {Object} obj
     * true表示可用，false表示不可以
     **/

    decrypt: function (word) {
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
        let decryptedStr = decrypt.toString();//CryptoJS.enc.Utf8
        return decryptedStr.toString();
    },
//加密方法
    /**
     * @return {string}
     */
    encrypt: function (word) {
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
        return encrypted.ciphertext.toString().toUpperCase();
    },

    // encrypt: function (plain_text) {
    //     let cipher = crypto.createCipheriv('aes192', this.app.config.secretKey);
    //     let enc = cipher.update(plain_text, 'utf8', 'hex');
    //     enc += cipher.final('hex');
    //
    //     return enc;
    // },
    // decrypt: function (cipher_text) {
    //     let decipher = crypto.createDecipheriv('aes192', this.app.config.secretKey);
    //     let dec = decipher.update(cipher_text, 'hex', 'utf8');
    //     dec += decipher.final('utf8');
    //     return dec
    //
    // },
    // operatorGenerator: function (unit, page, DESC = false) {
    //
    //     // let operator = {sort: {updated_at: -1}};
    //     let operator = {};
    //     if (DESC) {
    //         operator.sort = {updated_at: -1};
    //     }
    //     if (unit && page) {
    //         if (page < 1 || unit < 1) {
    //             this.throw(400, `page or unit can not less than 1`);
    //         }
    //         operator.skip = (parseInt(page) - 1) * parseInt(unit);
    //         operator.limit = parseInt(unit);
    //     }
    //     return operator;
    // },

    errorCode: {
        200:
            '服务器成功返回请求的数据。',
        201:
            '新建或修改数据成功。',
        202:
            '一个请求已经进入后台排队（异步任务）。',
        204:
            '删除数据成功。',
        400:
            '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
        401:
            '用户没有权限（令牌、用户名、密码错误）。',
        403:
            '用户得到授权，但是访问是被禁止的。',
        404:
            '发出的请求针对的是不存在的记录，服务器没有进行操作。',
        406:
            '请求的格式不可得。',
        410:
            '请求的资源被永久删除，且不会再得到的。',
        422:
            '当创建一个对象时，发生一个验证错误。',
        500:
            '服务器发生错误，请检查服务器。',
        502:
            '网关错误。',
        503:
            '服务不可用，服务器暂时过载或维护。',
        504:
            '网关超时。',
        NOTLOGIN:
            'notLoginError',
        PERMISSION:
            'permissionError',
        CONNECTIONTIMEOUT:
            'connectionTimeoutError',
        FORMAT:
            'formatError',
        FOUND:
            'notFoundError',
    }
    ,


}
;
