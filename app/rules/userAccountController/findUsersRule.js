'use strict';

const rule = {
    tel_number: [
        {required: false, message: 'title不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    nickName: [
        {required: false, message: 'category不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    activity: [
        {required: false, message: 'description不能为空'},
        {type: 'boolean', message: '类型不正确'}
    ],
    hasVerifyWechat: [
        {required: false, message: '不能为空'},
        {type: 'boolean', message: '必须大于0'}
    ]
};

module.exports = rule;
