const rule = {
    missionEventName: [
        {required: true, message: '可以能为空'},
        {type: 'string', message: 'missionEventName必须为字符串'}
    ],
    modelName: [
        {required: true, message: 'missionType不能为空'},
        {type: "enum", enum: ['Permanent', 'Weekly', `Daily`], message: '数值仅可为 Daily / Weekly / Permanent'}
    ]
};

module.exports = rule;