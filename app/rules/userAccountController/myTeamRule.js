'use strict';
const pageAndUnitRules = require(`../pageAndUnitRule`);
let rule = {
    uuid: [
        {required: false, message: 'sting不能为空'},
        {type: "string", message: 'sting不能为空'}
    ]
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;