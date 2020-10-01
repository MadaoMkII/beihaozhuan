'use strict';

const rule = {
  tel_number: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  nickName: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  activity: [
    { required: false, message: '不能为空' },
    { type: 'enum', enum: [ 'enable', 'disable' ] },
  ],
  hasVerifyWechat: [
    { required: false, message: '不能为空' },
    { type: 'enum', enum: [ 'enable', 'disable' ] },
  ],
};

module.exports = rule;
