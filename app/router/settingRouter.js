`use strict`;
module.exports = app => {
    const {router, controller} = app;
    // router.post('/setting/setAdvPosition', app.middleware.authenticatedMiddleware(`User`),
    //     controller[`systemSettingController`].setAdvPosition);
    // router.post('/setting/setBannerGood', app.middleware.authenticatedMiddleware(`User`),
    //     controller[`systemSettingController`].setBannerGood);
    router.post('/setting/setSetting', app.middleware.authenticatedMiddleware(`User`),
        controller[`systemSettingController`].setSetting);
    router.post('/setting/getSetting', app.middleware.authenticatedMiddleware(`User`),
        controller[`systemSettingController`].getSetting);
    router.get('/callback', controller[`callBackController`].getCallBackInfo);
    router.get('/', async (ctx) => {
        ctx.redirect('/index.html')
    });
};
