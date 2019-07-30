

const rule = {
    id: [
        {required: true},
        {type: 'number', message: 'id 必须为数字'}
    ],
    password: [
        {required: true},
        {type: 'string', message: 'password 必须为字符串'}
    ]
};

module.exports = rule;