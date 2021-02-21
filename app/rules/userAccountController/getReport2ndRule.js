'use strict';

const rule = {
  type: [
    { required: true, message: '不能为空' },
    { type: 'enum', enum: [ '下载总览', '用户详情', '游戏详情', '综合总览' ] },
  ],
};

module.exports = rule;
