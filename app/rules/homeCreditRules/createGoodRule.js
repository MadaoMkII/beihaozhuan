'use strict';

const rule = {
  account: [
    { required: true, message: '手机号不能为空' },
    { type: 'string', message: '手机号类型不正确' },
  ],
};

module.exports = rule;
