`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.post('/good/create', controller.goodController.creatGood);
    router.post('/good/makeOrder', app.middleware.authenticatedMiddleware(`User`), controller[`orderTrackerController`].createOrder);
    router.get('/good/getAll', controller.goodController.getAll);
};
