'use strict';
const pageAndUnitRules = require('../pageAndUnitRule');
const rule = {
  title: [
    { required: false, message: 'title不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  promotionType: [
    { required: false, message: 'category不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  categoryUUid: [
    { required: false, message: 'category不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
