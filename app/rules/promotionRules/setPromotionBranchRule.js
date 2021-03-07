'use strict';
const rule = {
  uuid: [
    { required: false, message: 'categoryUUid不能为空' },
    { type: 'string', message: '需要是字符串' }],
  stepNumber: [
    { required: false, message: 'stepNumber不能为空' },
    { type: 'number', message: '需要是字符串' }],
  promotionUUid: [
    { required: true, message: 'promotionUUid不能为空' },
    { type: 'string', message: '需要是字符串' }],
  branchTitle: [
    { required: false, message: 'branchTitle不能为空' },
    { type: 'string', message: '需要是字符串' }],
  allowUpload: [
    { required: false, message: 'allowUpload不能为空' },
    { type: 'boolean', message: '需要是字符串' }],
  description: [
    { required: false, message: 'allowUpload不能为空' },
    { type: 'string', message: '需要是字符串' }],
  promotionReward: [
    { required: true, message: 'promotionReward不能为空' },
    { type: 'number', message: '需要是字符串' }],
  downloadLink: [
    { required: true, message: 'allowUpload不能为空' },
    { type: 'string', message: '需要是字符串' }],
};
module.exports = rule;
