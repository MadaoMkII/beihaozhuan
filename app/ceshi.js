// const ALGORITHM = 'AES-256-CBC'; // CBC because CTR isn't possible with the current version of the Node.JS crypto library
// const HMAC_ALGORITHM = 'SHA256';
// const KEY = Buffer.from('8vApxL1k5GPAsJrM4vxpxLs543PhsJrM', 'utf8'); // This key should be stored in an environment variable
// const HMAC_KEY = Buffer.from('GnJd7EgzjjWj4aY9', 'utf8');
// const crypto = require('crypto');
// //加密
// function genSign(src, key, iv) {
//     let sign = '';
//     const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
//     sign += cipher.update(src, 'utf8', 'hex');
//     sign += cipher.final('hex');
//     return sign;
// }
//
// // 解密
// function deSign(sign, key, iv) {
//     let src = '';
//     const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
//     src += cipher.update(sign, 'hex', 'utf8');
//     src += cipher.final('utf8');
//     return src;
// }
//
// let constant_time_compare = function (val1, val2) {
//     let sentinel = ``;
//
//     if (val1.length !== val2.length) {
//         return false;
//     }
//
//
//     for (let i = 0; i <= (val1.length - 1); i++) {
//         sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
//     }
//
//     return sentinel === 0
// };//- 4 * 60 * 60 * 1000
// const key = Buffer.from('9vApcLk5G3PAsJrM', 'utf8');
// const iv = Buffer.from('FnXL7FczjqWjcaY9', 'utf8');
// const sign = genSign('hello world', key, iv);
// console.log(sign); // 764a669609b0c9b041faeec0d572fd7a
//
//
// // 解密
// // const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8');
// // const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8');
// const src=deSign('bd7266a9dee6a98a78096d84b2a21c07', key, iv);
// console.log(src); // hello world

// const EventEmitter = require('events');
// const myEE = new EventEmitter();
// myEE.on(`asd`, (a)=>{console.log(a)})
// myEE.emit(`asd`,{name:123});
// const moment = require(`moment`);
// require(`moment-timezone`);
// let x =moment.tz(new Date(), "Asia/ShangHai").format(`YYYYMMDD`)
// let a =Number(x.toString());
// console.log(a-10)
let cleanup = (obj) => {
    let res = {};
    Object.keys(obj).forEach((key) => {
        res.key = obj[key]
    });
    return res;
}

let a = {status: 'activity', title: undefined};
cleanup(a)