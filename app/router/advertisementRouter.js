`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.post('/advertisement/checkAdvertisement', app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].checkAdvertisement);

    router.post('/advertisement/checkFinishAdvertisement', app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].checkFinishAdvertisement);


    router.post('/advertisement/getAdvertisement',
        app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].getAdvertisementList);
    router.post('/advertisement/createAdvertisement',
        app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].createAdvertisement);
    router.post('/advertisement/getAdvertisementByPosition',
        app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].getAdvertisementByPosition);
    router.post('/advertisement/updateAdvertisementList',
        app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].updateAdvertisementList);
    router.post('/advertisement/setAdvertisementActivity',
        app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].setAdvertisementActivity);
    router.post('/advertisement/deleteAdvertisement',
        app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].deleteAdvertisement);

    router.post('/advertisement/deleteAdvertisement',
        app.middleware.authenticatedMiddleware(`User`), controller[`advertisementController`].deleteAdvertisement);

};
