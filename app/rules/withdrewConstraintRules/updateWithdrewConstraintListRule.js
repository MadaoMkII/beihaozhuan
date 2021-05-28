'use strict';
const rule = {
  title: [
    { required: true, message: 'title不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  amount: [
    { required: true, message: 'singleReward不能为空' },
    { type: 'number', message: '类型不正确' },
  ],
  withdrewConstraintTimes: [
    { required: true, message: 'singleReward不能为空' },
    { type: 'number', message: '类型不正确' },
  ],
  onlyOneTime: [
    { required: true, message: 'singleReward不能为空' },
    { type: 'boolean', message: '类型不正确' },
  ],
  description: [
    { required: true, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  id: [
    { required: true, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
};

module.exports = rule;
