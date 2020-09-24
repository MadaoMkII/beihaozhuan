'use strict';
const categoryRule = require('../../categoryRule');
const rule = {
  screenshotUrl: [
    { required: true, message: 'screenshotUrl不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],

  uuid: [
    { required: false, message: 'uuid不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
  sub_title: [
    { required: false, message: 'sub_title不能为空' },
    { type: 'enum', enum: [ 'try', 'A', 'B' ],
      message: '类型不正确仅仅可为 \'try\', \'A\', \'B\' ' },
  ],
};
Object.assign(rule, categoryRule);
module.exports = rule;
