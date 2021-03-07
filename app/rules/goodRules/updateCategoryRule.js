'use strict';
const rule = {
  category: [
    { required: true, message: 'category不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  priority: [
    { required: true, message: 'number不能为空' },
    { type: 'number', message: '类型不正确' },
  ],
  uuid: [
    { required: true, message: 'uuid不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
};
module.exports = rule;
