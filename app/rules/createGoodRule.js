'use strict';

const rule = {
    title: [
        {required: true, message: 'title不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    category: [
        {required: false, message: 'category不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    description: [
        {required: true, message: 'description不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    price: [
        {required: true, message: 'price不能为空'},
        {type: 'string', message: '必须大于0'}
    ],
    inventory: [
        {required: true, message: 'inventory不能为空'},
        {type: 'string', message: '必须大于0'}
    ]
};

module.exports = rule;
