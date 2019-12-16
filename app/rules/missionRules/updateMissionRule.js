const rule = {
  requireAmount: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '必须为string ,最小值为1' },
  ],
  reward: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '必须为number ,最小值为1' },
    {
      validator(rule, value, callback) {
        if (Number(value) >= 1) {
          callback(); // 验证通过
        } else {
          callback({ message: '无法使用该手机号' }); // 验证不通过}
        }
      },
    },
  ],
  title: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '必须为字符串' },
  ],
  uuid: [
    { required: true, message: '不能为空' },
    { type: 'string', message: '必须为字符串' },
  ],
};

module.exports = rule;
