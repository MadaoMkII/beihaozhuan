'use strict';
const rule = {
  uuid: [
    { required: true, message: 'uuid不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
};
module.exports = rule;