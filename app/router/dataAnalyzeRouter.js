`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.get('/chart/countByFall',
        app.middleware.authenticatedMiddleware(`User`), controller[`dataAnalyzeController`].countByFall);
    router.get('/chart/countAdv',
        app.middleware.authenticatedMiddleware(`User`), controller[`dataAnalyzeController`].countAdv);
};
