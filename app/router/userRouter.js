module.exports = app => {
    const {router, controller} = app;
    router.post('/user/updateInfo', controller[`userAccount`].updateUserInfo);
    router.post('/user/register', controller[`authController`].register);
    router.post('/user/login', controller[`authController`].login);
    router.get('/user/logout', controller[`authController`].logout);
    router.get('/index', controller[`home`].index);
    router.get('/getAll', controller[`userAccount`].getAll);
    router.get('/user/getInfo', app.middleware.authenticatedMiddleware(`User`), controller['userAccount'].getUserInfo);
};