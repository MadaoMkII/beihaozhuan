'use strict';
const pageAndUnitRules = require(`../pageAndUnitRule`);
const rule = {
    period: [
        {required: true, message: '可以能为空'},
        {type: "enum", enum: ['month', 'week', 'full']}
    ],
    userUUid: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ]
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;