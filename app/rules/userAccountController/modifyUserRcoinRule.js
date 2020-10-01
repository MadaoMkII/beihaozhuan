'use strict';

const rule = {
  tel_number: [
    { required: true, message: 'tel_number不能为空' },
    { type: 'string', message: '必须为字符串' },
  ],
  amount: [
    { required: true, message: 'amount不能为空' },
    { type: 'string', message: '必须为number' },
  ],
  content: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '必须为字符串' },
  ],
};

module.exports = rule;
