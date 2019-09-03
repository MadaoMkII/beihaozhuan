'use strict';

const rule = {
    uuid: [
        {required: true, message: 'uuid不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    status: [
        {required: true, message: 'status不能为空'},
        {type: "enum", enum: ['disable', 'enable'], message: '数值仅可为 disable / enable'}
    ]
};

module.exports = rule;