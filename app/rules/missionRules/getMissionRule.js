'use strict';
const pageAndUnitRules = require(`../pageAndUnitRule`);
const rule = {
    title: [
        {required: false, message: '可以能为空'},
        {type: 'string', message: 'title必须为字符串'}
    ],
    missionType: [
        {required: false, message: 'missionType不能为空'},
        {type: "enum", enum: ['Permanent', 'Weekly', `Daily`], message: '数值仅可为 Daily / Weekly / Permanent'}
    ]
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
