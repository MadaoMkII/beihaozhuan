`use strict`;
const fs = require('fs');
const path = require('path');
module.exports = app => {
    const {router, controller} = app;
    // router.post('/setting/setAdvPosition', app.middleware.authenticatedMiddleware(`客服`),
    //     controller[`systemSettingController`].setAdvPosition);
    // router.post('/setting/setBannerGood', app.middleware.authenticatedMiddleware(`客服`),
    //     controller[`systemSettingController`].setBannerGood);
    router.post('/setting/setSetting', app.middleware.authenticatedMiddleware(`客服`),
        controller[`systemSettingController`].setSetting);

    router.post('/setting/setRecommendGood', app.middleware.authenticatedMiddleware(`客服`),
        controller[`systemSettingController`].setRecommendGood);

    router.post('/setting/getSetting', app.middleware.authenticatedMiddleware(`客服`),
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
    router.get('/missionSignIn', async (ctx) => {
        ctx.response.type = 'html';
        ctx.body = fs.readFileSync(path.resolve(__dirname, '../public/missionSignIn.html'));
        // ctx.redirect('/index.html')
    });
    router.get('/missionAward', async (ctx) => {
        ctx.response.type = 'html';
        ctx.body = fs.readFileSync(path.resolve(__dirname, '../public/missionAward.html'));
        // ctx.redirect('/index.html')
    });
};
