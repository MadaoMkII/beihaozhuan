'use strict';
const categoryRule = require('../categoryRule');
const rule = {
  description_short: [
    { required: true, message: 'description_short不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
  expectEarning: [
    { required: true, message: 'expectEarning不能为空' },
    { type: 'number', message: '类型不正确, 应为number' },
  ],
  videoTutorialUrl: [
    { required: true, message: 'videoTutorialUrl不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
  firstWatchEarning: [
    { required: true, message: 'firstWatchEarning不能为空' },
    { type: 'number', message: '类型不正确, 应为number' },
    // {
    //   validator(rule, a, value, callback) {
    //     console.log(rule);
    //     console.log(a);
    //     console.log(value);console.log(callback);
    //     // if (mainland_reg.test(value)) {
    //     //   callback(); // 验证通过
    //     // } else {
    //     //   callback({ message: '无法使用该手机号' }); // 验证不通过}
    //     // }
    //   },
    // },
  ],
  registerReward: [
    { required: false, message: 'registerReward不能为空' },
    { type: 'number', message: '类型不正确, 应为number' },
  ],
};
Object.assign(rule, categoryRule);
module.exports = rule;
