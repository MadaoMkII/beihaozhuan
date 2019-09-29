`use strict`;
module.exports = app => {
    const {router, controller} = app;
    //router.get('/good/getBannerGood', controller[`goodController`].getBannerGood);

    router.get('/excel/getExcel',controller[`orderTrackerController`].getExcel);

    router.post('/good/createGood', app.middleware.authenticatedMiddleware(`客服`), controller[`goodController`].createGood);
    router.post('/good/updateGood', app.middleware.authenticatedMiddleware(`客服`), controller[`goodController`].updateGood);
    router.post('/order/makeOrder', app.middleware.authenticatedMiddleware(`客服`), controller[`orderTrackerController`].createOrder);
    router.post('/order/findOrder', app.middleware.authenticatedMiddleware(`客服`), controller[`orderTrackerController`].findOrder);
    router.post('/order/getMyOrders', app.middleware.authenticatedMiddleware(`客服`), controller[`orderTrackerController`].getMyOrders);

    router.post('/order/findOrderByUser', app.middleware.authenticatedMiddleware(`客服`), controller[`orderTrackerController`].findOrderByUser);
    router.post('/good/getManyGoods', controller[`goodController`].getManyGoods);
    router.get('/good/getRecommendGood', controller[`goodController`].getRecommendGood);
    router.post('/good/setGoodStatus', app.middleware.authenticatedMiddleware(`客服`), controller[`goodController`].setGoodStatus);
    router.post('/good/delGood', app.middleware.authenticatedMiddleware(`客服`), controller[`goodController`].delGood);
    //router.get('/good/getRecommendGoods', controller[`goodController`].getBannerGood);
};
