'use strict';
const rule = {
  type: [
    { required: false, message: 'sting不能为空' },
    { type: 'enum', enum: [ 'A', 'B', 'C', 'D', 'E' ] },
  ],
};
module.exports = rule;
