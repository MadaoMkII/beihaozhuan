'use strict';
const rule = {
  promotionBranchUUid: [
    { required: true, message: 'promotionBranchUUid不能为空' },
    { type: 'string', message: '需要是字符串' }],
};
module.exports = rule;
