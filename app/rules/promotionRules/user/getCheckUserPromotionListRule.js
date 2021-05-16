'use strict';
const pageAndUnitRules = require('../../pageAndUnitRule');
const rule = {
  promotionBranchUUid: [
    { required: true, message: 'promotionBranchUUid不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  tel_number: [
    { required: false, message: 'tel_number不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  status: [
    { required: false, message: 'status不能为空' },
    { type: 'enum', enum: [ '已下载', '已完成', '审核未通过', '审核通过', '审核中' ] },
  ],
  source: [
    { required: false, message: 'source不能为空' },
    { type: 'enum', enum: [ 'H5-通用', 'H5-安卓', 'H5-IOS', 'Android', 'IOS' ] },
  ],
};
Object.assign(rule, pageAndUnitRules);
module.exports = rule;
