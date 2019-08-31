'use strict';
const helper = require('../extend/helper');
const rule = {
    unit: [
        {required: true, message: 'unit不能为空'},
        {type: 'number', message: '类型不正确或小于1', min: 1},
        {
            validator: function (rule, value, callback, source) {
                if (source) {
                    if (helper.isEmpty(source.page) || helper.isEmpty(source.unit)) {
                        callback({message: 'page 与 unit 必须不为空'});
                    } else {
                        callback();
                    }
                }

            }
        }
    ],
    page: [
        {required: true, message: 'page不能为空'},
        {type: 'number', message: '类型不正确或小于1', min: 1},
        {
            validator: function (rule, value, callback, source) {
                if (source) {
                    if (helper.isEmpty(source.page) || helper.isEmpty(source.unit)) {
                        callback({message: 'page 与 unit 必须不为空'});
                    } else {
                        callback();
                    }
                }
            }
        }
    ]
};

module.exports = rule;
