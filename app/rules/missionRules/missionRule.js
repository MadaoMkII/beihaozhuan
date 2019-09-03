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
        {type: 'number', min: 1, message: '必须为number ,最小值为1'}
    ],
    imgUrl: [
        {required: false, message: 'imgUrl'},
        {type: 'string', message: 'imgUrl需要是字符串'},
    ],
    reward: [
        {required: true, message: 'reward不能为空'},
        {type: 'number', min: 1, message: '必须为number ,最小值为1'}
    ]
};
module.exports = rule;
