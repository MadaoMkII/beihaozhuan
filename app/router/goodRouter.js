`use strict`;
module.exports = app => {
    const {router, controller} = app;
    //router.get('/good/getBannerGood', controller[`goodController`].getBannerGood);

    router.get('/excel/getExcel',controller[`orderTrackerController`].getExcel);

    router.post('/good/createGood', app.middleware.authenticatedMiddleware(`User`), controller[`goodController`].createGood);
    router.post('/good/updateGood', app.middleware.authenticatedMiddleware(`User`), controller[`goodController`].updateGood);
    router.post('/order/makeOrder', app.middleware.authenticatedMiddleware(`User`), controller[`orderTrackerController`].createOrder);
    router.post('/order/findOrder', app.middleware.authenticatedMiddleware(`User`), controller[`orderTrackerController`].findOrder);
    router.post('/order/getMyOrders', app.middleware.authenticatedMiddleware(`User`), controller[`orderTrackerController`].getMyOrders);

    router.post('/order/findOrderByUser', app.middleware.authenticatedMiddleware(`User`), controller[`orderTrackerController`].findOrderByUser);
    router.post('/good/getManyGoods', controller[`goodController`].getManyGoods);
    router.get('/good/getRecommendGood', controller[`goodController`].getRecommendGood);
    router.post('/good/setGoodStatus', app.middleware.authenticatedMiddleware(`User`), controller[`goodController`].setGoodStatus);
    router.post('/good/delGood', app.middleware.authenticatedMiddleware(`User`), controller[`goodController`].delGood);
    //router.get('/good/getRecommendGoods', controller[`goodController`].getBannerGood);
};
