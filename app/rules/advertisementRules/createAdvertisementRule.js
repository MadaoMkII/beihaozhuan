'use strict';

const rule = {
    title: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    positionName: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    source: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'}
    ],
    reward: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'},
        {
            validator: function (rule, value, callback) {
                if (Number(value) >= 1) {
                    callback(); // 验证通过
                } else {
                    callback({message: '不能小于1'}); // 验证不通过}
                }
            }
        }
    ],
    activity: [
        {required: true, message: '不能为空'},
        {type: "enum", enum: ['enable', 'disable']}
    ],
    length: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'},
        {
            validator: function (rule, value, callback) {
                if (Number(value) >= 1) {
                    callback(); // 验证通过
                } else {
                    callback({message: '不能小于1'}); // 验证不通过}
                }
            }
        }
    ],
    width: [
        {required: true, message: '不能为空'},
        {type: 'string', message: '类型不正确'},
        {
            validator: function (rule, value, callback) {
                if (Number(value) >= 1) {
                    callback(); // 验证通过
                } else {
                    callback({message: '不能小于1'}); // 验证不通过}
                }
            }
        }
    ]
};

module.exports = rule;
