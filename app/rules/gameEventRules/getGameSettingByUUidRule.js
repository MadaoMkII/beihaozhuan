'use strict';
const categoryRule = require('../categoryRule');
const rule = {
  uuid: [
    { required: true, message: 'uuid不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
};
Object.assign(rule, categoryRule);
module.exports = rule;
