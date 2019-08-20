'use strict';

const rule = {
    unit: [
        {required: true, message: 'unit不能为空'},
        {type: 'number', message: '类型不正确'},
        {
            validator: function (rule, value, callback, source) {
                if (source) {
                    if (!source.page || !source.unit) {
                        callback({message: 'page 与 unit 必须一起输入'});
                    } else {
                        callback();
                    }
                }

            }
        }
    ],
    page: [
        {required: true, message: 'page不能为空'},
        {type: 'number', message: '类型不正确'},
        {
            validator: function (rule, value, callback, source) {
                if (source) {
                    if (!source.page || !source.unit) {
                        callback({message: 'page 与 unit 必须一起输入'});
                    } else {
                        callback();
                    }
                }
            }
        }
    ]
};

module.exports = rule;
