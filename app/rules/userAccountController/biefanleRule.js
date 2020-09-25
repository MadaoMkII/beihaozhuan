'use strict';

const rule = {

  day: [
    { required: true, message: '不能为空' },
    { type: 'enum', enum: [ '本年', '本半年', '本季度', '本周', '本月', '本日', '昨日' ] },
  ],
};

module.exports = rule;
