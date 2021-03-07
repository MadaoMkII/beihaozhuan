'use strict';
const rule = {
  platform: [
    { required: true, message: 'platform不能为空' },
    { type: 'enum', enum: [ 'H5-Android', 'H5-IOS', 'APP-Android', 'APP-IOS' ] },
  ],
};
module.exports = rule;
