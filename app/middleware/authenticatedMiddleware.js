'use strict';
// 我们可以近似的理解一个中间件就是一个迷你controller
const getPrivilege = privilegeName => {
  let privilege = 0;
  switch (privilegeName) {
    case '超管':
      privilege = 40;
      break;
    case '运营':
      privilege = 30;
      break;
    case '客服':
      privilege = 20;
      break;
    case '用户':
      privilege = 10;
      break;
    case 'All':
      privilege = 0;
      break;
    default:
      privilege = -1;

  }
  return privilege;
};
module.exports = options => {

  return async function authenticated(ctx, next) {

    if (ctx.helper.isEmpty(ctx.user) || getPrivilege(options) > getPrivilege(ctx.user.role)) {
      ctx.response.body = {
        code: 403,
        msg: '未登录或者权限不足', // 'Insufficient privilege',
      };
      ctx.response.status = 401;

    } else {
      await next();
    }

  };
};

