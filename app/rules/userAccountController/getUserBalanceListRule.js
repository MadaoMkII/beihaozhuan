
const rule = {
    userUUid: [
        {required: true},
        {type: 'string', message: 'userUUid必须为字符串'}
    ]
};

module.exports = rule;