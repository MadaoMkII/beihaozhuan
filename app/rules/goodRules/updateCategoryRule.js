'use strict';
const rule = {
  category: [
    { required: false, message: 'category不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  priority: [
    { required: false, message: 'priority不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  uuid: [
    { required: true, message: 'uuid不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
};
module.exports = rule;
