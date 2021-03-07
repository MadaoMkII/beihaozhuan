'use strict';
const rule = {
  title: [
    { required: true, message: 'title不能为空' },
    { type: 'string', message: '需要是字符串' }],
  categoryUUid: [
    { required: true, message: 'categoryUUid不能为空' },
    { type: 'string', message: '需要是字符串' }],
  promotionType: [
    { required: true, message: 'promotionType不能为空' },
    { type: 'enum', enum: [ '普通试玩', '时长试玩' ] }],
  platform: [
    { required: true, message: 'platform不能为空' },
    { type: 'enum', enum: [ 'H5-Android', 'H5-IOS', 'APP-Android', 'APP-IOS' ] },
  ],
  description: [
    { required: false, message: 'description不能为空' },
    { type: 'string', message: '需要是字符串' }],
  reward: [
    { required: true, message: 'reward不能为空' },
    { type: 'number', message: '需要是字符串' }],
  priority: [
    { required: true, message: 'priority不能为空' },
    { type: 'number', message: '需要是字符串' }],
};
module.exports = rule;
