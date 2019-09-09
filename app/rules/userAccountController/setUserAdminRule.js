const rule = {
    role: [
        {required: true, message: 'role不能为空'},
        {type: "enum", enum: ['Admin', 'Super_Admin']}
    ],
    realName: [
        {required: false, message: '可以能为空'},
        {type: 'string', message: '必须为字符串'}
    ],
    tel_number: [
        {required: true, message: '可以能为空'},
        {type: 'string', message: '必须为字符串'}
    ]
};

module.exports = rule;