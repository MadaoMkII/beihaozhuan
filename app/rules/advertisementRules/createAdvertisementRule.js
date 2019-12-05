'use strict';

const rule = {
  title: [
    { required: true, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  positionName: [
    { required: true, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  source: [
    { required: true, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  reward: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
    {
      validator(rule, value, callback) {
        if (value && Number(value) <= 1) {
          callback({ message: '不能小于1' }); // 验证通过
        } else {
          callback(); // 验证不通过}
        }
      },
    },
  ],
  activity: [
    { required: true, message: '不能为空' },
    { type: 'enum', enum: [ 'enable', 'disable' ] },
  ],
  height: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
    {
      validator(rule, value, callback) {
        if (value && Number(value) <= 1) {
          callback({ message: '不能小于1' }); // 验证通过
        } else {
          callback(); // 验证不通过}
        }
      },
    },
  ],
  width: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
    {
      validator(rule, value, callback) {
        if (value && Number(value) <= 1) {
          callback({ message: '不能小于1' }); // 验证通过
        } else {
          callback();// 验证不通过}
        }
      },
    },
  ],
};

module.exports = rule;
