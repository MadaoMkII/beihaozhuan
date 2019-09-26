'use strict';
const pageAndUnitRules = require(`../pageAndUnitRule`);
const rule = {
    period: [
        {required: true, message: '可以能为空'},
        {type: "enum", enum: ['month', 'week', 'full']}
    ]
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;