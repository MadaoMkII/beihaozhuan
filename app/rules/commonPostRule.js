

const rule = {
    id: [
        {required: false, message: '可以能为空'},
        {type: 'number', message: 'id 必须为数字'}
    ],
    smsVerifyCode: [
        {required: false, message: '可以能为空'},
        {type: 'string', message: 'smsVerifyCode 必须为字符串'}
    ],
    password: [
        {required: false, message: '可以能为空'},
        {type: 'string', message: 'password 必须为字符串'}
    ]
};

module.exports = rule;