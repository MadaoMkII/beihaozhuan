`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.get('/checkAD', app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].checkAD);
    router.get('/createAD', app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].createAD);

};
