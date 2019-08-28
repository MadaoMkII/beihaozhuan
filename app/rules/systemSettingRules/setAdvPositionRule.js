'use strict';
const rule = {
    location: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '需要是字符串'},
    ],
    adv_ID: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '需要是字符串'},
    ],
    length: [
        {required: true, message: '不能为空'},
        {type: 'number', message: '需要是数字'},
    ],
    weight: [
        {required: true, message: '不能为空'},
        {type: 'number', message: '需要是数字'},
    ],
    activity: [
        {required: true, message: '不能为空'},
        {type: 'boolean', message: 'boolean only'},
    ]
};
module.exports = rule;
