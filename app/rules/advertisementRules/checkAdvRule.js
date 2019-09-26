'use strict';
const rule = {

    sign: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    uuid: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    userUUid: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    timeStamp: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ]
};
module.exports = rule;
