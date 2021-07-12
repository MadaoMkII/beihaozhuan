'use strict';
const rule = {
  tel_number: [
    { required: true, message: '' },
    { type: 'string', message: '格式不正确' },
  ],
  source: [
    { required: false, message: '' },
    { type: 'string', message: '格式不正确' },
  ],
  inviteCode: [
    { required: false, message: '' },
    { type: 'string', message: '格式不正确' },
  ],
  smsVerifyCode: [
    { required: true, message: '' },
    { type: 'string', message: '格式不正确' },
  ],
};

module.exports = rule;
