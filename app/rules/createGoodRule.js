'use strict';

const rule = {
    category: [
        {required: true, message: 'category不能为空'},
        {type: 'string', message: '手机号类型不正确'}
    ],
    price: [
        {required: true, message: 'price不能为空'},
        {type: 'number', min: 0}
    ],
    inventory: [
        {required: true, message: 'inventory不能为空'},
        {type: 'number', min: 0}
    ]
};

module.exports = rule;
