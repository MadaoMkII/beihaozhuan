'use strict';
//我们可以近似的理解一个中间件就是一个迷你controller
let getPrivilege = (privilegeName, userPrivilege) => {
    let privilege = 0;
    switch (privilegeName) {
        case 'Admin':
            privilege = 30;
            break;
        case 'Super_Admin':
            privilege = 50;
            break;
        case 'User':
            privilege = 10;
            break;
        case 'All':
            privilege = 0;
            break;
        default:
            privilege = -1;

    }
    return (userPrivilege - privilege) >= 0;
};
module.exports = (options) => {

    return async function authenticated(ctx,next) {

        if (!getPrivilege(options, 20)) {
            ctx.response.body = {
                code: 403,
                msg: "Insufficient privilege"
            };
            ctx.response.status = 403;

        } else {
            await next();
        }

    }
};


