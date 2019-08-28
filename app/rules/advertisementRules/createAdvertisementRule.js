'use strict';

const rule = {
    title: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    channel: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    reward: [
        {required: true, message: '不能为空'},
        {type: 'number', message: '类型不正确'}
    ],
    positionName: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    category: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ]
};

module.exports = rule;
