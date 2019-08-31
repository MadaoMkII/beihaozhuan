const rule = {

    userUUid: [
        {required: false, message: '可以能为空'},
        {type: 'string', message: 'smsVerifyCode 必须为字符串'}
    ]
};

module.exports = rule;