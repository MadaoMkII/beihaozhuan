const rule = {

    userUUid: [
        {required: true},
        {type: 'string', message: 'smsVerifyCode 必须为字符串'}
    ]
};

module.exports = rule;