'use strict';
const pageAndUnitRules = require(`../pageAndUnitRule`);
let rule = {
    role: [
        {required: false, message: 'role不能为空'},
        {type: "enum", enum: ['运营', '客服']}
    ]
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
