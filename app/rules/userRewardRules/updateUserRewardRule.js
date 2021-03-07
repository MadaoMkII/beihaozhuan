'use strict';
const rule = {
  title: [
    { required: true, message: 'title不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  singleReward: [
    { required: true, message: 'singleReward不能为空' },
    { type: 'number', message: '类型不正确' },
  ],
  guests: [
    { required: true, message: 'guests不能为空' },
    { type: 'array', message: '类型不正确' },
  ],
  uuid: [
    { required: true, message: 'uuid不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
};

module.exports = rule;
