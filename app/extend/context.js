module.exports = {
    //解密方法
    /**
     * @return {Date}
     */
    getAbsoluteDate: function (date = new Date()) {
        date.setHours(0);
        date.setMinutes(0, 0, 0);
        return date;
    },
    randomString: function (length) {
        let chars = '012345678!%^&$#@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
};
