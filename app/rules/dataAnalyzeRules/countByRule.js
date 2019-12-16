'use strict';

const rule = {
  by: [
    { required: true, message: 'status不能为空' },
    {
      type: 'enum',
      enum: [ 'increaseBcoin', 'userRegister', 'consumeBcoin' ],
      message: '数值仅可为 increaseBcoin / consumeBcoin / userRegister',
    },
  ],
  period: [
    { required: true, message: 'status不能为空' },
    {
      type: 'enum',
      enum: [ 'month', 'day', 'full' ],
      message: '数值仅可为month  / day / full',
    },
  ],
};

module.exports = rule;
