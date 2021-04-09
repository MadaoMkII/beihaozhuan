'use strict';

const rule = {
  uuid: [
    { required: true, message: 'uuid不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  status: [
    { required: true, message: 'status不能为空' },
    { type: 'enum', enum: [ 'disable', 'enable' ], message: '类型不正确：\'disable\', \'enable\' 选一' },
  ],
};

module.exports = rule;
