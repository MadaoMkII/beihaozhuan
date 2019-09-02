'use strict';
const pageAndUnitRules = require(`../pageAndUnitRule`);
let rule = {
    uuid: [
        {required: false, message: 'uuid不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    status: [
        {required: false, message: 'status不能为空'},
        {type: "enum", enum: ['disable', 'enable']}
    ]
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
