`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.get('/chart/countByFall',
        app.middleware.authenticatedMiddleware(`客服`), controller[`dataAnalyzeController`].countByFall);

    router.post('/advertisement/getAdvDetail',
        app.middleware.authenticatedMiddleware(`客服`), controller[`dataAnalyzeController`].advDetail);

    router.get('/chart/getAdvCompare', app.middleware.authenticatedMiddleware(`客服`),
        controller[`dataAnalyzeController`].countAdvForChart);
};
