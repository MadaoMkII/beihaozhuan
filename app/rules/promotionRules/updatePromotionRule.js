'use strict';
const rule = {
  uuid: [
    { required: true, message: 'uuid不能为空' },
    { type: 'string', message: '需要是字符串' }],
  title: [
    { required: false, message: 'title不能为空' },
    { type: 'string', message: '需要是字符串' }],
  categoryUUid: [
    { required: false, message: 'categoryUUid不能为空' },
    { type: 'string', message: '需要是字符串' }],
  promotionType: [
    { required: false, message: 'promotionType不能为空' },
    { type: 'enum', enum: [ '普通试玩', '时长试玩' ] }],
  platform: [
    { required: false, message: 'platform不能为空' },
    { type: 'enum', enum: [ 'H5-Android', 'H5-IOS', 'APP-Android', 'APP-IOS' ] },
  ],
  status: [
    { required: false, message: 'status不能为空' },
    { type: 'enum', enum: [ 'disable', 'enable' ] },
  ],
  description: [
    { required: false, message: 'description不能为空' },
    { type: 'string', message: '需要是字符串' }],
  reward: [
    { required: false, message: 'reward不能为空' },
    { type: 'number', message: '需要是字符串' }],
  priority: [
    { required: false, message: 'priority不能为空' },
    { type: 'number', message: '需要是字符串' }],
  mainlyShowPicUrl: [
    { required: false, message: 'mainlyShowPicUrl不能为空' },
    { type: 'string', message: '需要是字符串' }],
  link: [
    { required: false, message: 'title不能为空' },
    { type: 'string', message: '需要是字符串' }],
};
module.exports = rule;
