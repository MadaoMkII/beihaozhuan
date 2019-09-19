


module.exports = {
    //解密方法
    /**
     * @return {string}
     */

    randomString: function (length) {
        let chars = '012345678!%^&$#@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
};
