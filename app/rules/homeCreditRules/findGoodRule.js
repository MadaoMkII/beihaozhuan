'use strict';
const pageAndUnitRules = require('../pageAndUnitRule');
const rule = {
  status: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  tel_number: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
