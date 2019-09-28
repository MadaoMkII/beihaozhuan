`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.get('/chart/countByFall',
        app.middleware.authenticatedMiddleware(`User`), controller[`dataAnalyzeController`].countByFall);

    router.post('/advertisement/getAdvDetail',
        app.middleware.authenticatedMiddleware(`User`), controller[`dataAnalyzeController`].advDetail);

    router.get('/chart/getAdvCompare', controller[`dataAnalyzeController`].countAdvForChart);
};
