'use strict';
const pageAndUnitRules = require('../pageAndUnitRule');
const rule = {
  type: [
    { required: false, message: 'type不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  category: [
    { required: false, message: 'category不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
