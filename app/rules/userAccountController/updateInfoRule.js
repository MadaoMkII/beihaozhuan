const rule = {
  gender: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '必须为字符串' },
  ],
  nickName: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '必须为字符串' },
  ],
  birthday: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '必须为字符串' },
  ],
  location: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '必须为字符串' },
  ],
  job: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '必须为字符串' },
  ],
  educationLevel: [
    { required: false, message: '不能为空' },
    { type: 'string', message: '必须为字符串' },
  ],
};

module.exports = rule;
