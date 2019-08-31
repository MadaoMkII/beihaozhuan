const rule = {
    requireAmount: [
        {required: false, message: '不能为空'},
        {type: 'number', message: '必须为number'}
    ],
    reward: [
        {required: false, message: '不能为空'},
        {type: 'number', message: '必须为number'}
    ],
    title: [
        {required: false, message: '不能为空'},
        {type: 'string', message: '必须为字符串'}
    ],
    missionType: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '必须为字符串'}
    ]
};

module.exports = rule;