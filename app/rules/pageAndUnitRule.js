'use strict';
const helper = require('../extend/helper');
const rule = {
  unit: [
    { required: false, message: 'unit不能为空' },
    { type: 'string', message: '类型不正确或小于1' },
    {
      validator(rule, value, callback, source) {
        if (source) {
          if (helper.isEmpty(source.page) || helper.isEmpty(source.unit)) {
            callback({ message: 'page 与 unit 必须不为空' });
          } else {
            callback();
          }
        }

      },
    },
  ],
  page: [
    { required: false, message: 'page不能为空' },
    { type: 'string', message: '类型不正确或小于1' },
    {
      validator(rule, value, callback, source) {
        // min: 1
        if (source) {
          if (helper.isEmpty(source.page) || helper.isEmpty(source.unit)) {
            callback({ message: 'page 与 unit 必须不为空' });
          } else {
            callback();
          }
        }
      },
    },
  ],
};

module.exports = rule;
