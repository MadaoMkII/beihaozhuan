// // // const ALGORITHM = 'AES-256-CBC'; // CBC because CTR isn't possible with the current version of the Node.JS crypto library
// // // const HMAC_ALGORITHM = 'SHA256';
// // // const KEY = Buffer.from('8vApxL1k5GPAsJrM4vxpxLs543PhsJrM', 'utf8'); // This key should be stored in an environment letiable
// // // const HMAC_KEY = Buffer.from('GnJd7EgzjjWj4aY9', 'utf8');
// // // const crypto = require('crypto');
// // // //加密
// // // function genSign(src, key, iv) {
// // //     let sign = '';
// // //     const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
// // //     sign += cipher.update(src, 'utf8', 'hex');
// // //     sign += cipher.final('hex');
// // //     return sign;
// // // }
// // isEmpty = function (obj) {
// //     if (obj === "") return true;
// //     if (obj === {}) return true;
// //     if (obj === []) return true;
// //     if (obj === null) return true;
// //     if (obj === undefined) return true;
// //     if (obj.constructor.name === "Array" || obj.constructor.name === "String") return obj.length === 0;
// //     // for (let key in obj) {
// //     //     if (obj.hasOwnProperty(key) && isEmpty(obj[key])) return true;
// //     // }
// //     return false;
// // };
// // // // 解密
// // // function deSign(sign, key, iv) {
// // //     let src = '';
// // //     const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
// // //     src += cipher.update(sign, 'hex', 'utf8');
// // //     src += cipher.final('utf8');
// // //     return src;
// // // }
// // //
// // // let constant_time_compare = function (val1, val2) {
// // //     let sentinel = ``;
// // //
// // //     if (val1.length !== val2.length) {
// // //         return false;
// // //     }
// // //
// // //
// // //     for (let i = 0; i <= (val1.length - 1); i++) {
// // //         sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
// // //     }
// // //
// // //     return sentinel === 0
// // // };//- 4 * 60 * 60 * 1000
// // // const key = Buffer.from('9vApcLk5G3PAsJrM', 'utf8');
// // // const iv = Buffer.from('FnXL7FczjqWjcaY9', 'utf8');
// // // const sign = genSign('hello world', key, iv);
// // // console.log(sign); // 764a669609b0c9b041faeec0d572fd7a
// // //
// // //
// // // // 解密
// // // // const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8');
// // // // const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8');
// // // const src=deSign('bd7266a9dee6a98a78096d84b2a21c07', key, iv);
// // // console.log(src); // hello world
// //
// // // const EventEmitter = require('events');
// // // const myEE = new EventEmitter();
// // // myEE.on(`asd`, (a)=>{console.log(a)})
// // // myEE.emit(`asd`,{name:123});
// // // const moment = require(`moment`);
// // // require(`moment-timezone`);
// // // let x =moment.tz(new Date(), "Asia/ShangHai").format(`YYYYMMDD`)
// // // let a =Number(x.toString());
// // // console.log(a-10)
// // cleanupRequest = function (...obj) {
// //     let res = {};
// //     for (let objElement of obj) {
// //         if (!this.isEmpty(objElement)) {
// //             Object.keys(objElement).forEach((key) => {
// //                 if (!this.isEmpty(objElement[key])) {
// //                     res[key] = objElement[key];
// //                 }
// //             });
// //         }
// //     }
// //     return res;
// // };
// // //https://lanhuapp.com/web/#/item/project/board/detail?pid=f2b834b5-c7f5-4347-8008-e968b8b808aa&project_id=f2b834b5-c7f5-4347-8008-e968b8b808aa&image_id=9343bd85-8cc7-4005-9ebe-d0ce249005ca
// // let a = {
// //     goodUUid: 'GDcjzjkrd2r00012suf69m3ev41',
// //     additionalInformation: { name: 'play' },
// //     realName: 'JavaScript',
// //     IDNumber: '120101198702051510',
// //     address: 'download.html',
// //     detailAddress: 'en'
// // };
// //
// // function change(...a) {
// //
// //     return a;
// //
// // };
// // let aa = [{name: 1, pipi: "hundouluo"}, {name: 2, pipi: "hundouluo"}];
// // console.log(aa.find((element) => {
// //     return element.name === 2
// // }));
// let {DateTime} = require('luxon');
// let local = DateTime.fromISO(new Date(`2019/01/07`).toISOString());
// let rezoned = local.setZone("Asia/Shanghai");
//
// let a = (obj, key) => {
//     let str0 = '';
//     for (let i in obj) {
//         if (i !== 'sign') {
//             let str1 = '';
//             str1 = i + '=' + obj[i];
//             str0 += str1;
//         }
//
//     }
// }
// let obj = {
//     appid: '',
//     terminalNumber: '',
//     time: parseInt(new Date().getTime() / 1000)
// };
// // let crypto = require('crypto')
// // let fs = require('fs')
// //
// // let encrypted = crypto.publicEncrypt(publicKey, Buffer.from('OurJS.com公钥加密私钥解密测试'))
// // let decrypted = crypto.privateDecrypt(privateKey, encrypted);
// // console.log(decrypted.toString())
//
//
// let encryptSignStr = (obj) => {
//     if (!obj) {
//         return false;
//     }
//     // let {JSDOM} = require(`jsdom`);
//     // let jsDom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
//     // const {window} = jsDom;
//     // global.window = window;
//     // global.navigator = {
//     //     userAgent: `node.js`
//     // };
//     //以上代码后端专用，前端引用也许不需要
//     let {JSEncrypt} = require(`JSEncrypt`);
//     const crypt = new JSEncrypt();
//     let result = ``;
//     Object.keys(obj).sort().forEach((key) => {
//         result = result + `${key}=${obj[key]}&`
//     });
//crypt.setPublicKey();
//     result = result.substring(0, result.length - 1);
//     let encrypted = crypt.encrypt(result);
//
//     console.log(encrypted)
//     return encrypted;
// };
//
// let decryptSignStr = (str) => {
//
//     let {JSDOM} = require(`jsdom`);
//     let jsDom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
//     const {window} = jsDom;
//     global.window = window;
//     global.navigator = {
//         userAgent: `node.js`
//     };
//     //以上代码后端专用，前端引用也许不需要
//     let {JSEncrypt} = require(`JSEncrypt`);
//     const crypt = new JSEncrypt();
//
//     crypt.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----
// MIIBOQIBAAJAfCAhxULGjdShrBVNlLCRwiG2+fuhOsxYlYCUOqTS/N6C3Uh0olEK
// qALY/USsQbiN6AJVpmUs5Lgt1z0zuOWT9wIDAQABAkB8Bm83930GAsx4ceDPDY7W
// 93EpX7C+W6i32X5DCqZ3W0G1NruALeTgfXzcBFvtzm9NbDEBh3skmplbeQP+BbnB
// AiEA3U9as6mE4py9AuQskhRzpxLp8QU8rC3qsG4r4fj6x9kCIQCPlP6/taEePuX1
// Rev9RTtny27vx7PYWISYpIcGMYgoTwIgdl6UR9Yask5dNieuwy9XMHyIThab/gfN
// KDK1G/dcwvkCIA3j2BErvP50D0L/FKlXvTt5Tq4bn6ZaSdmKcRWETSu5AiEAxDJ2
// j8KeXnMzMansiyH+jEF0LtTys+MXtlPYrPTVWKQ=
// -----END RSA PRIVATE KEY-----`);

//     let decrypted = crypt.decrypt(str);
//
//     delete global.navigator;
//     delete global.window;
//     decrypted = decrypted.substring(0, decrypted.length - 1);
//     console.log(decrypted)
//     return decrypted;
// };
let x = {bbc: "plat", xqa: "cbz", aqa: "cbz"};
// decryptSignStr(`Wkih6fz/aepfvqSXL31FHgnu25WR+1rbrgc+VPXSLs9A9Ir6acoI3j0cz/zUcsV1iUugoN8P5/e8V+mWkQiweA==`);
let pubKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5A/TPEmOQYgT2po11qvjeBUPE
dqUEz1Z7MeHH7KI2p74pYK8RsvYngy1cH/wnMXmsf+Wb3tmlqNGa7atW8wlpSfXX
QV9bFECPEVRnESo8xtN7ZAlJFcdRvBVgfVwC3m9HWpVvKnd9NREXIcg5NHh57q7u
lsGCZJ2VOJm9EIgFEwIDAQAB
-----END PUBLIC KEY-----`;

let privateKey2 = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQC5A/TPEmOQYgT2po11qvjeBUPEdqUEz1Z7MeHH7KI2p74pYK8R
svYngy1cH/wnMXmsf+Wb3tmlqNGa7atW8wlpSfXXQV9bFECPEVRnESo8xtN7ZAlJ
FcdRvBVgfVwC3m9HWpVvKnd9NREXIcg5NHh57q7ulsGCZJ2VOJm9EIgFEwIDAQAB
AoGBALcfBVVXHBiyC7udSfInET+e8l4oGFjUZwJ0csaQnlV+XadSvLTF7wFYwrKm
LcsVGxrzU+2c+ssOdrfjeW0MDEjrbd1xtmayP8Kh2/Pg+9jZqj188tTlLwzUW6iz
KDEpiG5P1f1cbKY+R/BHQIKt7vcd2QMNVctxSkjl1uSvU/ERAkEA7uCuAJsVgmui
NjDscoXyj+QRFWqDnUNCZqSqjYw7/BC36xYg/Xolw/bqg9aTgua96fv9k9hExOBY
eNV3mj63bwJBAMZG7J5/vc3bkVwOS3A5E8j4hwCIFDylbKQ8chdulC3wwDLaSRdE
evUfhAmMev1cc4QiVaXzGKPcS9ko8Gdz2p0CQAftfvjYLMOSTOTdhMtcNKuf1w1N
5qZOeCKt7lcaQ1dfOqtbpaaj6iLxy+CqO2UJwV3FlinU8JtUEruX4gtFb5MCQGgb
l2RFuHhdgH5wdwXOwme0rtYFnXKWfWvi3RkWk7FnhtNssBIKf/EzAhYtb+qWX4US
rhv7f4WSRzUX/NqlBzUCQQCfDpC5/DZ/7RMKbDj7inW2G/3T56jzCdicIAgN0erZ
jcbB7+8VQLjcw5LFYPwgjjz5v6Amw42VY+dBUNWVEH9C
-----END RSA PRIVATE KEY-----`;
const crypto = require('crypto');

let MAX_ENCRYPT_BLOCK = 117 - 31;

/**
 * RSA最大解密密文大小
 */
let MAX_DECRYPT_BLOCK = 128;

function publicEncrypt(obj) {
    let resultStr = ``;
    Object.keys(obj).sort().forEach((key) => {
        resultStr = resultStr + `${key}=${obj[key]}&`
    });
    //得到公钥
    //let publicPem = fs.readFileSync(path.join(__dirname, "../../properties/rsa_public_key.pem"));//替换你自己的路径
    let publicKey = pubKey; //publicPem.toString();
    //加密信息用buf封装
    let buf = Buffer.from(resultStr, "utf-8");
    //buf转byte数组
    let inputLen = buf.byteLength;
    //密文
    let bufs = [];
    //开始长度
    let offSet = 0;
    //结束长度
    let endOffSet = MAX_ENCRYPT_BLOCK;
    //分段加密
    while (inputLen - offSet > 0) {
        if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
            bufs.push(crypto.publicEncrypt({
                key: publicKey,
                padding: crypto.RSA_PKCS1_PADDING
            }, buf.slice(offSet, endOffSet)));
        } else {
            bufs.push(crypto.publicEncrypt({
                key: publicKey,
                padding: crypto.RSA_PKCS1_PADDING
            }, buf.slice(offSet, inputLen)));
        }
        offSet += MAX_ENCRYPT_BLOCK;
        endOffSet += MAX_ENCRYPT_BLOCK;
    }
    let result = Buffer.concat(bufs);
    //密文BASE64编码
    return result.toString("base64");
}

function privateDecrypt(date) {
    try {

        //得到私钥
        //let privatePem = fs.readFileSync(path.join(__dirname, "../../properties/rsa_private_key.pem"));
        let privateKey = privateKey2;//privatePem.toString();
        //经过base64编码的密文转成buf
        let buf = Buffer.from(date, "base64");

        //buf转byte数组
        //let inputLen = bytes(buf, "base64");
        let inputLen = buf.byteLength;
        //密文
        let bufs = [];
        //开始长度
        let offSet = 0;
        //结束长度
        let endOffSet = MAX_DECRYPT_BLOCK;
        //分段加密
        while (inputLen - offSet > 0) {
            if (inputLen - offSet > MAX_DECRYPT_BLOCK) {

                bufs.push(crypto.privateDecrypt({
                    key: privateKey,
                    padding: crypto.RSA_PKCS1_PADDING
                }, buf.slice(offSet, endOffSet)));
            } else {

                bufs.push(crypto.privateDecrypt({
                    key: privateKey,
                    padding: crypto.RSA_PKCS1_PADDING
                }, buf.slice(offSet, inputLen)));
            }
            offSet += MAX_DECRYPT_BLOCK;
            endOffSet += MAX_DECRYPT_BLOCK;
        }
        return Buffer.concat(bufs).toString();

    } catch (e) {
        console.log(e);
        return false;
    }
    //解密
}

let compareSign = (obj, signStr) => {
    let resultStr = ``;
    Object.keys(obj).sort().forEach((key) => {
        resultStr = resultStr + `${key}=${obj[key]}&`
    });
    let assert = require('assert');
    assert.strictEqual(privateDecrypt(signStr), resultStr, `解密字符串不匹配`);
};
let t = publicEncrypt(x)
compareSign(x, t)


const request = require('request');
let requestFun = (JSONObject, method, url) => {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: method,
            json: true,   // <--Very important!!!
            body: JSONObject
        }, (error, response, body) => {
            if (error) {
                reject(error)
            } else {
                resolve([response, body]);
            }
        });
    });
};
let urlA = '/wechat/callback?code=011Ohdcc0x3V2B1xMa9c0FVqcc0Ohdc7&state=STATE';

let url = require("url");
let query = url.parse(urlA, true).query;
console.log(query.code)


const myURL = new URL(`https://example.org`);
Object.keys(x).forEach((key) => {
    myURL.searchParams.append(key, x[key]);
});

console.log(myURL.href)
// {
//     method: 'GET',
//         url: '/wechat/callback?code=011Ohdcc0x3V2B1xMa9c0FVqcc0Ohdc7&state=STATE',
//     header: {
//     'x-forwarded-for': '117.13.3.8',
//         host: 'localhost:3000',
//         connection: 'close',
//         'upgrade-insecure-requests': '1',
//         'user-agent': 'Mozilla/5.0 (Linux; Android 9; G8342 Build/47.2.A.10.80; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044904 Mobile Safari/537.36 MMWEBID/5109 MicroMessenger/7.0.1380(0x27000034) Process/tools NetType/WIFI Language/zh_CN',
//         accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,image/wxpic,image/sharpp,image/apng,image/tpg,*/*;q=0.8',
//         'accept-encoding': 'gzip, deflate, br',
//         'accept-language': 'zh-CN,zh-CN;q=0.9,en-US;q=0.8',
//         cookie: 'yhbSen=O5Y6f2-sdk7DI1im9fJH_P59n7BV3DT2AgusYFVLis2oOfJE9ViNSLOi4jOHKDOp04whCzFXWADUZgIp_wiUFURvUJVQ0SLuaKQi9JVLfVmtxaRnvZfRlxKvNaIOEHyuBSgCct4YaCQyMAtuJ296tjD1R2xaJNdPbsVE4dkCaqA_h04Lf53wXtZBbAa2zxBU'
// }
// }
const CryptoJS = require('crypto-js');  //引用AES源码js

const key = CryptoJS.enc.Utf8.parse("12gy122414ABdDEF"); //十六位十六进制数作为秘钥
const iv = CryptoJS.enc.Utf8.parse('AHCdCF12351f3412'); //十六位十六进制数作为秘钥偏移量
let decrypt = function (word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);//
    return decryptedStr.toString();
};
//加密方法
/**
 * @return {string}
 */
let encrypt = function (word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
    return encrypted.ciphertext.toString().toUpperCase();
};
let aaa= encrypt(`abcdseerrreeerr`)
console.log(aaa)
console.log(decrypt(aaa))
