'use strict';
const pageAndUnitRules = require(`../pageAndUnitRule`);
let rule = {
    level: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    beginTime: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    endTime: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    nickName: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    tel_number: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    role: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ]
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
