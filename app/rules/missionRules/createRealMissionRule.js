'use strict';
const rule = {
  title: [
    { required: true, message: 'title不能为空' },
    { type: 'string', message: 'title需要是字符串' },
  ],
  type: [
    { required: true, message: 'type不能为空' },
    { type: 'enum', enum: [ '签到任务', '新闻时长任务', '新闻数量任务', '小视频时长任务', '小视频数量任务' ] },
  ],
  reward: [
    { required: true, message: 'reward不能为空' },
    { type: 'number', message: 'reward最小值为1' },
  ],
  requireTimes: [
    { required: false, message: 'requireTimes' },
    { type: 'number', message: 'requireTimes需要是字符串' },
  ],
  limit: [
    { required: true, message: 'limit不能为空' },
    { type: 'number', message: 'limit is number' },
  ],
  picUrl: [
    { required: true, message: 'picUrl不能为空' },
    { type: 'string', message: 'picUrl需要是字符串' },
  ],
  extraSwitch: [
    { required: true, message: 'extraSwitch不能为空' },
    { type: 'boolean', message: 'extraSwitch需要是boolean' },
  ],
  extraBonusAmount: [
    { required: true, message: 'extraBonusAmount不能为空' },
    { type: 'number', message: 'extraBonusAmount需要是number' },
  ],
  extraBonusRate: [
    { required: true, message: 'extraBonusRate不能为空' },
    { type: 'number', message: 'extraBonusRate需要是number，且最小值必须大于1', min: 1 },
  ],
};
module.exports = rule;
