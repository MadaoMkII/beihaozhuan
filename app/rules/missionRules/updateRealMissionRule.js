'use strict';
const idRule = require('../uuidRule');
const rule = {
  status: [
    { required: false, message: 'status不能为空' },
    { type: 'enum', enum: [ 'enable', 'disable', 'deleted' ], message: '\'enable\', \'disable\', \'deleted\' 三选一' },
  ],
  title: [
    { required: false, message: 'title不能为空' },
    { type: 'string', message: 'title需要是字符串' },
  ],
  type: [
    { required: false, message: 'type不能为空' },
    { type: 'enum', enum: [ '签到任务', '新闻时长任务', '新闻数量任务', '小视频时长任务', '小视频数量任务' ] },
  ],
  reward: [
    { required: false, message: 'reward不能为空' },
    { type: 'number', message: 'reward最小值为1' },
  ],
  requireTimes: [
    { required: false, message: 'requireTimes' },
    { type: 'number', message: 'requireTimes需要是字符串' },
  ],
  limit: [
    { required: false, message: 'limit不能为空' },
    { type: 'number', message: 'limit is number' },
  ],
  picUrl: [
    { required: false, message: 'picUrl不能为空' },
    { type: 'string', message: 'picUrl需要是字符串' },
  ],
  extraSwitch: [
    { required: false, message: 'extraSwitch不能为空' },
    { type: 'boolean', message: 'extraSwitch需要是字符串' },
  ],
  extraBonusAmount: [
    { required: false, message: 'extraBonusAmount不能为空' },
    { type: 'number', message: 'extraBonusAmount需要是number' },
  ],
  extraBonusRate: [
    { required: false, message: 'extraBonusRate不能为空' },
    { type: 'number', message: 'extraBonusRate需要是number' },
  ],
};
Object.assign(rule, idRule);
module.exports = rule;
