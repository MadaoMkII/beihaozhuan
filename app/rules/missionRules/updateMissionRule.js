const rule = {
    requireAmount: [
        {required: false, message: '不能为空'},
        {type: 'number', min: 1, message: '必须为number ,最小值为1'}
    ],
    reward: [
        {required: false, message: '不能为空'},
        {type: 'number', min: 1, message: '必须为number ,最小值为1'}
    ],
    title: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '必须为字符串'}
    ],
    uuid: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '必须为字符串'}
    ]
};

module.exports = rule;