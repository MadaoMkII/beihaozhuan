'use strict';
const rule = {
  username: [
    { required: false, message: 'username不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
};

module.exports = rule;
