'use strict';
const rule = {
  promotionBranchUUid: [
    { required: true, message: 'promotionBranchUUid不能为空' },
    { type: 'string', message: '需要是字符串' }],
  screenshotUrls: [
    { required: true, message: 'screenshotUrls不能为空' },
    { type: 'array', message: '需要是字符串数组' }],
};
module.exports = rule;
