'use strict';

const rule = {
  title: [
    { required: true, message: 'title不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  categoryUUid: [
    { required: true, message: 'categoryUUid不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  description: [
    { required: true, message: 'description不能为空' },
    { type: 'string', message: '类型不正确' },
  ],
  price: [
    { required: true, message: 'price不能为空' },
    { type: 'number', message: '类型不正确 必须为string' },
  ],
  inventory: [
    { required: true, message: 'inventory不能为空' },
    { type: 'number', message: '类型不正确 必须为string' },
  ],
  giftExchangeContent: [
    { required: true, message: 'giftExchangeContent不能为空' },
    { type: 'string', message: '类型不正确 必须为string' },
  ],
  exchangeWay: [
    { required: true, message: 'exchangeWay能为空' },
    { type: 'enum', enum: [ 'link', 'pic&word' ] },
  ],
};

module.exports = rule;
