'use strict';
const rule = {
  decision: [
    { required: true, message: 'decision不能为空' },
    { type: 'boolean', message: '类型不正确, 应为boolean' },
  ],
  uuid: [
    { required: true, message: 'uuid不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
};

module.exports = rule;
