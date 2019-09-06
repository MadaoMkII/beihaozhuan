'use strict';
const pageAndUnitRules = require(`../pageAndUnitRule`);
let rule = {
    orderUUid: [
        {required: false, message: 'uuid不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    title: [
        {required: false, message: 'status不能为空'},
        {type: "enum", enum: ['disable', 'enable']}
    ]
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
