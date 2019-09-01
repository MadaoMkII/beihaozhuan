`use strict`;
module.exports = app => {
    const {router, controller} = app;
    //router.get('/good/getBannerGood', controller[`goodController`].getBannerGood);
    router.post('/good/createGood', controller[`goodController`].createGood);
    router.post('/order/makeOrder', app.middleware.authenticatedMiddleware(`User`), controller[`orderTrackerController`].createOrder);
    router.post('/order/findOrder', app.middleware.authenticatedMiddleware(`User`), controller[`orderTrackerController`].findOrder);
    router.post('/order/findOrderByUser', app.middleware.authenticatedMiddleware(`User`), controller[`orderTrackerController`].findOrderByUser);
    router.post('/good/getManyGoods', controller[`goodController`].getManyGoods);
    router.post('/good/setGoodStatus', controller[`goodController`].setGoodStatus);
    //router.get('/good/getRecommendGoods', controller[`goodController`].getBannerGood);
};
