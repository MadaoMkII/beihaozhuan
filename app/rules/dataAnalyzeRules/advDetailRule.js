'use strict';
const pageAndUnitRules = require(`../pageAndUnitRule`);
const rule = {
    title: [
        {required: false, message: '可以能为空'},
        {type: 'string', message: 'title必须为字符串'}
    ],
    source: [
        {required: false, message: '不能为空'},
        {type: 'string', message: 'title必须为字符串'}
    ]
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
