module.exports = app => {
    const {router, controller} = app;
    router.post('/user/getManyUser', controller[`userAccount`].getManyUser);
    router.post('/user/updateInfo', app.middleware.authenticatedMiddleware(`User`), controller[`userAccount`].updateUserInfo);
    router.post('/user/register', controller[`authController`].register);
    router.post('/user/login', controller[`authController`].login);
    router.get('/user/logout', controller[`authController`].logout);
    //router.get('/index', controller[`home`].index);
    router.get('/checkHealth', (ctx) => {
        ctx.response.body = {
            "success": true,
            "message": "Service is running~"
        };
        ctx.status = 200;
    });
    router.post('/user/getUserBalanceList', controller[`userAccount`].getUserBalanceList);
    router.post('/user/getUser', controller[`userAccount`].getUser);
    router.get('/user/isLogin', controller[`userAccount`].isLogin);
    router.get('/user/updateUserPassword', controller[`userAccount`].updateUserPassword);
    router.get('/user/getInfo', app.middleware.authenticatedMiddleware(`User`), controller['userAccount'].getUserInfo);
    router.post('/user/getManagementUserInfo', controller[`userAccount`].getManagementUserInfo);
    router.post('/user/setUserAdmin', app.middleware.authenticatedMiddleware(`User`), controller[`userAccount`].setUserAdmin);
    router.post('/user/updateAdmin', app.middleware.authenticatedMiddleware(`User`), controller[`userAccount`].updateAdmin);
    router.post('/user/disableUserAdminStatus', app.middleware.authenticatedMiddleware(`User`),
        controller[`userAccount`].setUserStatus);
    router.post('/user/setUserRole', app.middleware.authenticatedMiddleware(`User`), controller[`userAccount`].setUserRole);


    router.get('/user/getInviteLink', app.middleware.authenticatedMiddleware(`User`), controller[`userAccount`].generatorInviteLink);
    router.get('/user/signIn', controller[`authController`].signIn_fake);

    router.post('/user/register_test', controller[`authController`].register_fake);
    router.post('/verify/sendVerifySmsMessage_test', controller[`smsController`].sendVerifySmsMessage_fakes);

    router.get('/weChatCallback', controller[`wechatController`].callback);
};