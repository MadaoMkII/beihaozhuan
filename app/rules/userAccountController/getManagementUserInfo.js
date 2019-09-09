const rule = {
    uuid: [
        {required: true, message: '可以能为空'},
        {type: 'string', message: '必须为字符串'}
    ]
};

module.exports = rule;