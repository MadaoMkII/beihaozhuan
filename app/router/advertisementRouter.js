`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.get('/checkAD', app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].checkAD);
    router.post('/advertisement/getAdvertisement',
        app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].getAdvertisementList);
    router.post('/advertisement/createAdvertisement',
        app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].createAdvertisement);
    router.post('/advertisement/getAdvertisementByPosition',
        app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].getAdvertisementByPosition);
    router.post('/advertisement/updateAdvertisementList',
        app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].updateAdvertisementList);
};
