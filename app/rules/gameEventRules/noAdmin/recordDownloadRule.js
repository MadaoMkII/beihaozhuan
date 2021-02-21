'use strict';
// const categoryRule = require('../../categoryRule');
const rule = {
  name: [
    { required: true, message: 'name不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
  gameUUid: [
    { required: true, message: 'gameUUid不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
};
// Object.assign(rule, categoryRule);
module.exports = rule;
