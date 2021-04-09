'use strict';

const rule = {
  title: [
    { required: true, message: 'title不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  categoryUUid: [
    { required: true, message: 'categoryUUid不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  description: [
    { required: true, message: 'description不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  price: [
    { required: true, message: 'price不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  inventory: [
    { required: true, message: 'inventory不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  giftExchangeContent: [
    { required: true, message: 'giftExchangeContent不能为空' },
    { type: 'string', message: '类型不正确：应该是string' },
  ],
  exchangeWay: [
    { required: true, message: 'exchangeWay能为空' },
    { type: 'enum', enum: [ 'link', 'pic&word' ], message: '类型不正确：link\', \'pic&word\'选一' },
  ],
};

module.exports = rule;
