const CryptoJS = require('crypto-js');  //引用AES源码js

const key = CryptoJS.enc.Utf8.parse("1234122414ABCDEF"); //十六位十六进制数作为秘钥
const iv = CryptoJS.enc.Utf8.parse('AHCdCF12351f3412'); //十六位十六进制数作为秘钥偏移量
module.exports = {
    //解密方法
    /**
     * @return {string}
     */
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
    randomString: function (length) {
        let chars = '012345678!%^&$#@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
};
