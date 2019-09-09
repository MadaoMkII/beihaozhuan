'use strict';
const pageAndUnitRules = require(`../pageAndUnitRule`);
let rule = {
    role: [
        {required: false, message: 'role不能为空'},
        {type: "enum", enum: ['Admin', 'Super_Admin']}
    ]
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
