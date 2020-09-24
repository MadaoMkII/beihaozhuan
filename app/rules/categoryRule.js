'use strict';
const rule = {
  category: [
    { required: true, message: 'category不能为空' },
    { type: 'enum', enum: [ 'STEP1', 'STEP2', 'STEP3', 'STEP4', 'STEP5', 'STEP6' ],
      message: '类型不正确仅仅可为 \'STEP1\', \'STEP2\', \'STEP3\', \'STEP4\', \'STEP5\', \'STEP6\' ' },
  ],
};

module.exports = rule;
