'use strict';
const rule = {
  type: [
    { required: true, message: 'type不能为空' },
    { type: 'enum', enum: [ '商品', '试玩' ], message: '类型不正确：\'商品\', \'试玩\'选一' },
  ],
  category: [
    { required: true, message: 'category不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  priority: [
    { required: true, message: 'number不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
};
module.exports = rule;
