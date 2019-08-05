'use strict';
const rule = {
    gender: [{required: false, message: '密码不能为空'}, {type: "enum", enum: ['male', 'female']}]
};
module.exports = rule;
