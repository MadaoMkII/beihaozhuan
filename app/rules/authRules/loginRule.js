'use strict';

const rule = {
  source: [
    { required: false, message: '' },
    { type: 'string', message: 'OPENID格式不正确' },
  ],
  OPENID: [
    { required: false, message: '' },
    { type: 'string', message: 'OPENID格式不正确' },
  ],
  inviteCode: [
    { required: false, message: '' },
    { type: 'string', message: '格式不正确' },
  ],
  smsVerifyCode: [
    { required: false, message: '' },
    { type: 'string', message: '格式不正确' },
  ],
  tel_number: [
    { required: true, message: '手机号不能为空' },
    { type: 'string', message: '手机号类型不正确' },
    // {
    //     validator: function (rule, value, callback) {
    //         let mainland_reg = /^1[3|4|5|7|8][0-9]{9}$/;
    //         if (mainland_reg.test(value)) {
    //             callback(); // 验证通过
    //         } else {
    //             callback({message: '无法使用该手机号'}); // 验证不通过}
    //         }
    //     }
    // }
  ],
  password: [
    { required: false, message: '手机号不能为空' },
    { type: 'string', message: '密码字段需要是字符串' },
    { // , source, options
      validator(rule, value, callback) {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])[^]{6,16}$/;// /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
        if (value) {
          if (pattern.test(value)) {
            callback(); // 验证通过
            return;
          }
          callback({ message: '密码最少包含一个大小写字母并且为6-16位' }); // 验证不通过
        }
        callback();
      },
    },
  ],
};

module.exports = rule;
