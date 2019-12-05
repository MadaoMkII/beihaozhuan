'use strict';
const rule = {
  role: [
    { required: false, message: 'role不能为空' },
    { type: 'enum', enum: [ '客服', '运营' ] },
  ],
  uuid: [
    { required: true, message: 'uuid不能为空' },
    { type: 'string', message: 'uuid必须为字符串' },
  ],
  tel_number: [
    { required: false, message: 'tel_number不能为空' },
    { type: 'string', message: 'tel_number必须为字符串' },
    {
      validator(rule, value, callback) {
        const mainland_reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (mainland_reg.test(value)) {
          callback(); // 验证通过
        } else {
          callback({ message: '无法使用该手机号' }); // 验证不通过}
        }
      },
    },
  ],
  realName: [
    { required: false, message: 'realName不能为空' },
    { type: 'string', message: 'realName必须为字符串' },
  ],
};
module.exports = rule;
