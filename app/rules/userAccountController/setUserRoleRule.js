const rule = {
    role: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '必须为字符串'}
    ],
    uuid: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '必须为字符串'}
    ]
};

module.exports = rule;