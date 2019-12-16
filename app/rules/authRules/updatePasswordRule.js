'use strict';

const rule = {

  password: [
    { required: true, message: '手机号不能为空' },
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
