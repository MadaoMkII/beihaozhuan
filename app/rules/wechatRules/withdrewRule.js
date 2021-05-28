'use strict';
const rule = {
  constraintId: [
    { required: false, message: '不能为空' },
    { type: 'string' },
  ],
};
module.exports = rule;
