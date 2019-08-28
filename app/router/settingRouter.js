`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.post('/setting/setAdvPosition', app.middleware.authenticatedMiddleware(`User`),
        controller[`systemSettingController`].setAdvPosition);
};
