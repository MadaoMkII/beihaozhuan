'use strict';
const rule = {
  access_token: [
    { required: true, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  openid: [
    { required: true, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  sourceFrom: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  inviteCode: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  redirect: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
};
module.exports = rule;
