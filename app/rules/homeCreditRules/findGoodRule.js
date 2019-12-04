'use strict';
const pageAndUnitRules = require('../pageAndUnitRule');
const rule = {
  status: [
    { required: true, message: 'status不能为空' },
    {
      type: 'enum',
      enum: [ '未审核', '审核通过', '审核失败' ],
      message: '数值仅可为 未审核 / 审核通过 / 审核失败',
    },
  ],
  tel_number: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
