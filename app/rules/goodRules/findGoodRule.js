'use strict';
const pageAndUnitRules = require('../pageAndUnitRule');
const rule = {
  categoryUUid: [
    { required: false, message: 'categoryUUid不能为空' },
    { type: 'string', message: '\'类型不正确：应该是string\'' },
  ],
  status: [
    { required: false, message: 'status不能为空' },
    { type: 'enum', enum: [ 'disable', 'enable' ], message: '类型不正确：\'disable\', \'enable\' 选一' },
  ],
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
