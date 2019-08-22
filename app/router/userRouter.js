module.exports = app => {
    const {router, controller} = app;
    router.post('/getUsers', controller[`userAccount`].getManyUser);
    router.post('/user/updateInfo', app.middleware.authenticatedMiddleware(`User`), controller[`userAccount`].updateUserInfo);
    router.post('/user/register', controller[`authController`].register);
    router.post('/user/login', controller[`authController`].login);
    router.get('/user/logout', controller[`authController`].logout);
    router.get('/index', controller[`home`].index);
    router.get('/checkHealth', (ctx) => {

        ctx.response.body = {
            "success": true,
            "message": "Service is running~"
        };
        ctx.status = 200;
    });
    router.post('/user/updateUserPassword', controller[`userAccount`].updateUserPassword);
    router.get('/user/getInfo', app.middleware.authenticatedMiddleware(`User`), controller['userAccount'].getUserInfo);
};