'use strict';
const pageAndUnitRules = require('../pageAndUnitRule');
const rule = {
  title: [
    { required: false, message: '可以能为空' },
    { type: 'string', message: 'title必须为字符串' },
  ],
  extraSwitch: [
    { required: false, message: '可以能为空' },
    { type: 'boolean', message: 'extraSwitch必须为字符串' },
  ],
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
