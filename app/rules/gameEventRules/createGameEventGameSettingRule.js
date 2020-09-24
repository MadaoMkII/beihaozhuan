'use strict';
const rule = {

  category: [
    { required: true, message: 'category不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
  gameName: [
    { required: true, message: 'gameName不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
  platform: [
    { required: true, message: 'platform不能为空' },
    { type: 'enum', enum: [ '安卓', 'IOS', '通用' ], message: '类型不正确仅仅可为 \'安卓\', \'IOS\', \'通用\'' },
  ],
  gameBannerUrl: [
    { required: true, message: 'gameBannerUrl不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
  downloadUrl: [
    { required: true, message: 'downloadUrl不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
  demoDescription: [
    { required: true, message: 'demoDescription不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
  demoReward: [
    { required: true, message: 'demoReward不能为空' },
    { type: 'number', message: '类型不正确, 应为number' },
  ],
  demoSketchUrl: [
    { required: true, message: 'demoSketchUrl不能为空' },
    { type: 'string', message: '类型不正确, 应为string' },
  ],
  subsequent_A: [
    { required: false, message: 'subsequent_A不能为空' },
    { type: 'object', message: '类型不正确, 应为object' },
  ],
  subsequent_B: [
    { required: false, message: 'subsequent_B不能为空' },
    { type: 'object', message: '类型不正确, 应为object' },
  ],

};

module.exports = rule;
