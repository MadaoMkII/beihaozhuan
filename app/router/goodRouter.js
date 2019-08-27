`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.post('/good/createGood', controller[`goodController`].createGood);
    router.post('/order/makeOrder', app.middleware.authenticatedMiddleware(`User`), controller[`orderTrackerController`].createOrder);
    router.post('/order/findOrder', app.middleware.authenticatedMiddleware(`User`), controller[`orderTrackerController`].findOrder);
    router.post('/good/findOrderByUser', app.middleware.authenticatedMiddleware(`User`), controller[`orderTrackerController`].findOrderByUser);
    router.post('/good/getManyGoods', controller[`goodController`].getManyGoods);
};
