'use strict';
const rule = {
    title: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    positionName: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    source: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    activity: [
        {required: false, message: '不能为空'},
        {type: "enum", enum: ['enable', 'disable']}
    ],
    uuid: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ]
};
module.exports = rule;
