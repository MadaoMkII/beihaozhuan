'use strict'
const {Service} = require('egg');

class captchaService extends Service {
    async getcaptcha() {

         return require(`svg-captcha`).createMathExpr({size:6,noise:4,color:true,background:'#cc9966' });
    }


}

module.exports = captchaService;