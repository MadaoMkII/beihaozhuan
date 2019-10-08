'use strict';
const pageAndUnitRules = require(`../pageAndUnitRule`);
const rule = {
    source: [
        {required: false, message: '可以能为空'},
        {type: 'string', message: 'source必须为字符串'}
    ]

};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
