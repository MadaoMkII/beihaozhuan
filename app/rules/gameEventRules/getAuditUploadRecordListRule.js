'use strict';
const helper = require('../../extend/helper');
const rule = {
  sub_title: [
    { required: false, message: 'sub_title不能为空' },
    {
      type: 'enum', enum: [ 'A', 'B', 'try' ],
      message: '类型不正确仅仅可为 \'A\', \'B\', \'try\' ',
    },
  ],
  status: [
    { required: false, message: 'status不能为空' },
    {
      type: 'enum', enum: [ '审核未通过', '审核通过', '未审核' ],
      message: '类型不正确仅仅可为 \'审核未通过\', \'审核通过\', \'未审核\'',
    },
  ],
  missionUUid: [
    { required: false, message: 'missionUUid不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
  tel_number: [
    { required: false, message: 'tel_number不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
  unit: [
    { required: false, message: 'unit不能为空' },
    { type: 'string', message: '类型不正确或3小于1' },
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
    { type: 'string', message: '类型不正确或小于1111' },
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
