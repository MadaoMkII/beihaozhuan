`use strict`;
const fs = require('fs');
const path = require('path');
module.exports = app => {
    const {router, controller} = app;
    // router.post('/setting/setAdvPosition', app.middleware.authenticatedMiddleware(`User`),
    //     controller[`systemSettingController`].setAdvPosition);
    // router.post('/setting/setBannerGood', app.middleware.authenticatedMiddleware(`User`),
    //     controller[`systemSettingController`].setBannerGood);
    router.post('/setting/setSetting', app.middleware.authenticatedMiddleware(`User`),
        controller[`systemSettingController`].setSetting);

    router.post('/setting/setRecommendGood', app.middleware.authenticatedMiddleware(`User`),
        controller[`systemSettingController`].setRecommendGood);

    router.post('/setting/getSetting', app.middleware.authenticatedMiddleware(`User`),
        controller[`systemSettingController`].getSetting);
    router.get('/callback', controller[`callBackController`].getCallBackInfo);

    router.get('/setting/getMemberNumber', controller[`systemSettingController`].getMemberNumber);

    router.get('/getSquare', controller[`systemSettingController`].getSquare);

    router.get('/index', async (ctx) => {
        ctx.response.type = 'html';
        ctx.body = fs.readFileSync(path.resolve(__dirname, '../public/index.html'));
        // ctx.redirect('/index.html')
    });
    router.get('/admin', async (ctx) => {
        ctx.response.type = 'html';
        ctx.body = fs.readFileSync(path.resolve(__dirname, '../public/admin.html'));
        // ctx.redirect('/index.html')
    });
    router.get('/', async (ctx) => {
        ctx.response.type = 'html';
        ctx.body = fs.readFileSync(path.resolve(__dirname, '../public/prepare.html'));
        // ctx.redirect('/index.html')
    });
};
