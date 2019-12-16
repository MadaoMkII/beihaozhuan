'use strict';

const rule = {
  id: [
    { required: true, message: '手机号不能为空' },
    { type: 'string', message: '手机号类型不正确' },
  ],
  status: [
    { required: true, message: 'status不能为空' },
    {
      type: 'enum',
      enum: [ '未审核', '审核通过', '审核不通过' ],
      message: '数值仅可为 未审核 / 审核通过 / 审核不通过',
    },
  ],
};

module.exports = rule;
