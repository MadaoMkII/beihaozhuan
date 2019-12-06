'use strict';
const rule = {
  type: [
    { required: false, message: '不能为空' },
    { type: 'string' },
  ],
};
module.exports = rule;
