'use strict';
const rule = {
  id: [
    { required: true, message: 'id不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
};
module.exports = rule;
