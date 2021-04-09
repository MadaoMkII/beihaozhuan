'use strict';
const uuidRule = require('../uuidRule');
const rule = {
  title: [
    { required: false, message: 'title不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  categoryUUid: [
    { required: false, message: 'categoryUUid不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  description: [
    { required: false, message: 'description不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  price: [
    { required: false, message: 'price不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  inventory: [
    { required: false, message: 'inventory不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  giftExchangeContent: [
    { required: false, message: 'giftExchangeContent不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  exchangeWay: [
    { required: false, message: 'exchangeWay能为空' },
    { type: 'enum', enum: [ 'link', 'pic&word' ], message: '类型不正确：link\', \'pic&word\'选一' },
  ],
};
Object.assign(rule, uuidRule);
module.exports = rule;
