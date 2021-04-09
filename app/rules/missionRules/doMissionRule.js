'use strict';
const rule = {
  type: [
    { required: true, message: 'type不能为空' },
    { type: 'enum', enum: [ '签到任务', '新闻时长任务', '新闻数量任务', '小视频时长任务', '小视频数量任务' ] },
  ],
};
module.exports = rule;
