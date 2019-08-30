const rule = {
    title: [
        {required: false, message: '可以能为空'},
        {type: 'string', message: 'title必须为字符串'}
    ]
};

module.exports = rule;