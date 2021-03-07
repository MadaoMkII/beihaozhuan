'use strict';
module.exports = app => {
  const { router, controller } = app;
  // router.get('/good/getBannerGood', controller[`goodController`].getBannerGood);

  router.get('/excel/getExcel', app.middleware.authenticatedMiddleware('客服'), controller.orderTrackerController.getExcel);

  router.post('/good/createGood', app.middleware.authenticatedMiddleware('运营'), controller.goodController.createGood);
  router.post('/good/updateGood', app.middleware.authenticatedMiddleware('运营'), controller.goodController.updateGood);
  router.post('/order/makeOrder', app.middleware.authenticatedMiddleware('用户'), controller.orderTrackerController.createOrder);
  router.post('/order/findOrder', app.middleware.authenticatedMiddleware('用户'), controller.orderTrackerController.findOrder);
  router.post('/order/getMyOrders', app.middleware.authenticatedMiddleware('用户'), controller.orderTrackerController.getMyOrders);

  router.post('/order/findOrderByUser', app.middleware.authenticatedMiddleware('用户'), controller.orderTrackerController.findOrderByUser);
  router.post('/good/getManyGoods', app.middleware.authenticatedMiddleware('用户'), controller.goodController.getManyGoods);
  router.get('/good/getRecommendGood', app.middleware.authenticatedMiddleware('用户'), controller.goodController.getRecommendGood);
  router.post('/good/setGoodStatus', app.middleware.authenticatedMiddleware('运营'), controller.goodController.setGoodStatus);
  router.post('/good/delGood', app.middleware.authenticatedMiddleware('运营'), controller.goodController.delGood);
  // router.get('/good/getRecommendGoods', controller[`goodController`].getBannerGood);
  router.post('/good/getShowGoods', app.middleware.authenticatedMiddleware('用户'), controller.goodController.getShowGoods);
  // -------------------------2.0----------------------------
  router.post('/good/createCategory', app.middleware.authenticatedMiddleware('运营'),
    controller.goodController.createCategory);
  router.post('/good/updateCategory', app.middleware.authenticatedMiddleware('运营'),
    controller.goodController.updateCategory);
  router.post('/good/deleteCategory', app.middleware.authenticatedMiddleware('运营'),
    controller.goodController.deleteCategory);
  router.post('/good/getCategory', app.middleware.authenticatedMiddleware('运营'),
    controller.goodController.getCategory);

};
