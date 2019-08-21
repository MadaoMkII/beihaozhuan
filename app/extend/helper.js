'use strict';

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
        if (obj === "") return true;
        if (obj === {}) return true;
        if (obj === []) return true;
        if (obj === null) return true;
        if (obj === undefined) return true;
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
    cleanupRequest: function (avoidPropertyArray, ...obj) {
        let res = {};
        for (let objElement of obj) {
            if (!this.isEmpty(objElement)) {
                Object.keys(objElement).forEach((key) => {
                    if (!this.isEmpty(objElement[key]) && !avoidPropertyArray.includes(key)) {
                        res[key] = objElement[key];
                    }
                });
            }
        }
        return res;
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
    errorCode: {
        200: '服务器成功返回请求的数据。',
        201: '新建或修改数据成功。',
        202: '一个请求已经进入后台排队（异步任务）。',
        204: '删除数据成功。',
        400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
        401: '用户没有权限（令牌、用户名、密码错误）。',
        403: '用户得到授权，但是访问是被禁止的。',
        404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
        406: '请求的格式不可得。',
        410: '请求的资源被永久删除，且不会再得到的。',
        422: '当创建一个对象时，发生一个验证错误。',
        500: '服务器发生错误，请检查服务器。',
        502: '网关错误。',
        503: '服务不可用，服务器暂时过载或维护。',
        504: '网关超时。',
        NOTLOGIN: 'notLoginError',
        PERMISSION: 'permissionError',
        CONNECTIONTIMEOUT: 'connectionTimeoutError',
        FORMAT: 'formatError',
        FOUND: 'notFoundError',
    },


};
