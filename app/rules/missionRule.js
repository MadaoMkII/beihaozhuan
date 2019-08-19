'use strict';
const rule = {
    missionType: [
        {required: true, message: 'missionType不能为空'},
        {type: 'string', message: 'missionType需要是字符串'},
    ],
    title: [
        {required: true, message: 'title不能为空'},
        {type: 'string', message: 'title需要是字符串'},
    ],
    requireAmount: [
        {required: true, message: 'requireAmount不能为空'},
        {type: 'number', message: 'requireAmount需要是数字'},
    ],
    imgUrl: [
        {required: false, message: 'imgUrl'},
        {type: 'string', message: 'imgUrl需要是字符串'},
    ],
    reward: [
        {required: true, message: 'reward不能为空'},
        {type: 'number', message: 'reward需要是数字'},
    ],
    eventName: [
        {required: true, message: 'eventName不能为空'},
        {type: 'string', message: 'eventName需要是数字'},
    ]
};
module.exports = rule;
