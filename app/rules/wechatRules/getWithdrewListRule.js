'use strict';
const pageAndUnitRules = require('../pageAndUnitRule');
const rule = {
  title: [
    { required: false, message: 'title不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  source: [
    { required: false, message: 'source不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  tel_number: [
    { required: false, message: 'tel_number不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
