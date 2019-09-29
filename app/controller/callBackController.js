'use strict';

const Controller = require('./baseController');

class callBackController extends Controller {

}

let sha1 = (str) => {
    let md5sum = crypto.createHash("sha1");
    md5sum.update(str);
    str = md5sum.digest("hex");
    return str;
};
// let x = ()=>{
//
//    let stringSignTemp=`timestamp=${timestamp}`
//
//     let sign=MD5(stringSignTemp).toUpperCase()="9A0A8659F005D6984697E2CA0A9CF3B7" //注：MD5签名方式
//
//     let sign=hash_hmac("sha256",stringSignTemp,key).toUpperCase()="6A9AE1657590FD6257D693A078E1C3E4BB6BA4DC30B23E0EE2496E54170DACD6"
//
// }


module.exports = callBackController;