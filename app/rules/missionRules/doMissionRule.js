'use strict';
const rule = {
  type: [
    { required: true, message: 'type不能为空' },
    { type: 'enum', enum: [ '签到任务', '新闻时长任务', '新闻数量任务', '小视频时长任务', '小视频数量任务' ] },
  ],
  noncestr: [
    { required: true, message: 'noncestr不能为空' },
    { type: 'string', message: 'noncestr需要是字符串' },
  ],
  timestamp: [
    { required: true, message: 'timestamp不能为空' },
    { type: 'string', message: 'timestamp需要是字符串' },
  ],
  sign: [
    { required: true, message: 'sign不能为空' },
    { type: 'string', message: 'sign需要是字符串' },
  ],
};
module.exports = rule;
