'use strict';
const pageAndUnitRules = require('../pageAndUnitRule');
const rule = {
  return_msg: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  nickName: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  userUUid: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
