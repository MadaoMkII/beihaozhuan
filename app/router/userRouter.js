module.exports = app => {
    const {router, controller} = app;

    router.get('/user/showMyMoney', app.middleware.authenticatedMiddleware(`用户`), controller[`userAccount`].showMyMoney);
    router.post('/user/getManyUser', app.middleware.authenticatedMiddleware(`客服`), controller[`userAccount`].getManyUser);
    router.post('/user/updateInfo', app.middleware.authenticatedMiddleware(`用户`), controller[`userAccount`].updateUserInfo);
    router.post('/user/register', controller[`authController`].register);
    router.post('/user/bindWechat', controller[`authController`].bindWechat);
    router.post('/user/login', controller[`authController`].login);
    router.get('/user/logout', app.middleware.authenticatedMiddleware(`用户`), controller[`authController`].logout);
    router.get('/user/lottery', controller[`authController`].lottery);
    router.post('/user/getMyTeam', app.middleware.authenticatedMiddleware(`用户`), controller[`userAccount`].getMyTeam);
    //router.get('/index', controller[`home`].index);
    router.get('/checkHealth', (ctx) => {
        ctx.response.body = {
            "success": true,
            "message": "Service is running~"
        };
        ctx.status = 200;
    });
    router.post('/user/getUserBalanceList', app.middleware.authenticatedMiddleware(`用户`), controller[`userAccount`].getUserBalanceList);
    router.post('/user/getUser', app.middleware.authenticatedMiddleware(`用户`), controller[`userAccount`].getUser);
    router.get('/user/isLogin', controller[`userAccount`].isLogin);
    router.post('/user/updateUserPassword', controller[`userAccount`].updateUserPassword);
    router.get('/user/getInfo', app.middleware.authenticatedMiddleware(`用户`), controller['userAccount'].getUserInfo);
    router.post('/user/getManagementUserInfo', app.middleware.authenticatedMiddleware(`运营`), controller[`userAccount`].getManagementUserInfo);
    router.post('/user/setUserAdmin', app.middleware.authenticatedMiddleware(`运营`), controller[`userAccount`].setUserAdmin);
    router.post('/user/updateAdmin', app.middleware.authenticatedMiddleware(`运营`), controller[`userAccount`].updateAdmin);
    router.post('/user/setUserStatus', app.middleware.authenticatedMiddleware(`运营`),
        controller[`userAccount`].setUserOpenStatus);
    router.post('/user/setUserRole', app.middleware.authenticatedMiddleware(`客服`), controller[`userAccount`].setUserRole);

    router.post('/user/disableUserAdminStatus', app.middleware.authenticatedMiddleware(`运营`), controller[`userAccount`].setUserStatus);

    router.get('/user/getInviteLink', app.middleware.authenticatedMiddleware(`用户`), controller[`userAccount`].generatorInviteLink);
    //router.get('/user/signIn', controller[`authController`].signIn_fake);
    router.get('/user/signInReal', app.middleware.authenticatedMiddleware(`用户`), controller[`authController`].signIn);
    //router.post('/user/register_test', controller[`authController`].register_fake);
    router.post('/verify/sendVerifySmsMessage_test', controller[`smsController`].sendVerifySmsMessage_fakes);

    router.get('/wechat/callback', controller[`wechatController`].callback);
    router.get('/biefanle', controller[`authController`].biefanle);
};