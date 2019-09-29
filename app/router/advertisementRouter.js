`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.post('/advertisement/checkAdvertisement', app.middleware.authenticatedMiddleware(`用户`), controller[`advertisementController`].checkAdvertisement);

    router.post('/advertisement/checkFinishAdvertisement', app.middleware.authenticatedMiddleware(`用户`), controller[`advertisementController`].checkFinishAdvertisement);


    router.post('/advertisement/getAdvertisement',
        app.middleware.authenticatedMiddleware(`用户`), controller[`advertisementController`].getAdvertisementList);
    router.post('/advertisement/createAdvertisement',
        app.middleware.authenticatedMiddleware(`运营`), controller[`advertisementController`].createAdvertisement);
    router.post('/advertisement/getAdvertisementByPosition',
        app.middleware.authenticatedMiddleware(`用户`), controller[`advertisementController`].getAdvertisementByPosition);
    router.post('/advertisement/updateAdvertisementList',
        app.middleware.authenticatedMiddleware(`运营`), controller[`advertisementController`].updateAdvertisementList);
    router.post('/advertisement/setAdvertisementActivity',
        app.middleware.authenticatedMiddleware(`运营`), controller[`advertisementController`].setAdvertisementActivity);
    router.post('/advertisement/deleteAdvertisement',
        app.middleware.authenticatedMiddleware(`运营`), controller[`advertisementController`].deleteAdvertisement);

    router.post('/advertisement/deleteAdvertisement',
        app.middleware.authenticatedMiddleware(`运营`), controller[`advertisementController`].deleteAdvertisement);
    router.get('/advertisement/countAdv',
        app.middleware.authenticatedMiddleware(`客服`), controller[`dataAnalyzeController`].countAdv);
};
