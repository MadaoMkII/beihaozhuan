'use strict';

const rule = {
    IDNumber: [
        {required: false, message: '身份证号不能为空'},
        {type: 'string', message: '身份证号需要是字符串'},
        { //, source, options
            validator: function (rule, value, callback) {
                const pattern = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;///^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
                if (pattern.test(value)) {
                    callback(); // 验证通过
                    return;
                }
                callback({message: '身份证验证错误'}); // 验证不通过
            },
        },
    ]
};
module.exports = rule;
