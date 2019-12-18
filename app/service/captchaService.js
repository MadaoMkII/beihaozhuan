'use strict';
const { Service } = require('egg');

class captchaService extends Service {
  async getcaptcha() {

    return require('svg-captcha').createMathExpr({
      mathMin: 1,
      mathMax: 9,
      noise: 19,
      color: true,
      background: '#C88172',
      mathOperator: '+-',
    });
  }


}

module.exports = captchaService;
