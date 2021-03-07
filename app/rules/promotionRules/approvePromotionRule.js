'use strict';
const rule = {
  uuid: [
    { required: true, message: 'uuid不能为空' },
    { type: 'string', message: '需要是字符串' }],
  decision: [
    { required: true, message: 'decision不能为空' },
    { type: 'enum', enum: [ '审核通过', '审核未通过' ] }],
};
module.exports = rule;
