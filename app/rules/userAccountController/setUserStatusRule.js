const rule = {
  activity: [
    { required: false, message: 'role不能为空' },
    { type: 'enum', enum: [ 'enable', 'disable' ] },
  ],
  uuid: [
    { required: true, message: '不能为空' },
    { type: 'string', message: '必须为字符串' },
  ],
};

module.exports = rule;
