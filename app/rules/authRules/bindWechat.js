'use strict';

const rule = {
    statusString: [
        {required: true, message: ''},
        {type: 'string', message: '格式不正确'},
    ],
    head: [
        {required: false, message: ''},
        {type: 'string', message: '格式不正确'},
    ],
    nickName: [
        {required: false, message: ''},
        {type: 'string', message: '格式不正确'},
    ],
    smsVerifyCode: [
        {required: true, message: ''},
        {type: 'string', message: '格式不正确'},
    ],
    tel_number: [
        {required: true, message: '手机号不能为空'},
        {type: 'string', message: '手机号类型不正确'},
        // {
        //     validator: function (rule, value, callback) {
        //         let mainland_reg = /^1[3|4|5|7|8][0-9]{9}$/;
        //         if (mainland_reg.test(value)) {
        //             callback(); // 验证通过
        //         } else {
        //             callback({message: '无法使用该手机号'}); // 验证不通过}
        //         }
        //     }
        // }
    ]
};

module.exports = rule;
