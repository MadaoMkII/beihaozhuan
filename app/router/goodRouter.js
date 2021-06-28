'use strict';
module.exports = app => {
  const { router, controller } = app;
  // router.get('/good/getBannerGood', controller[`goodController`].getBannerGood);

  // router.get('/excel/getExcel', app.middleware.authenticatedMiddleware('客服'), controller.orderTrackerController.getExcel);

  router.post('/good/createGood', app.middleware.authenticatedMiddleware('运营'), controller.goodController.createGood);
  router.post('/good/updateGood', controller.goodController.updateGood);
  // router.post('/order/makeOrder', app.middleware.authenticatedMiddleware('用户'), controller.orderTrackerController.createOrder);
  // router.post('/order/findOrder', app.middleware.authenticatedMiddleware('用户'), controller.orderTrackerController.findOrder);
  // router.post('/order/getMyOrders', app.middleware.authenticatedMiddleware('用户'), controller.orderTrackerController.getMyOrders);
  //
  // router.post('/order/findOrderByUser', app.middleware.authenticatedMiddleware('用户'), controller.orderTrackerController.findOrderByUser);
  router.post('/good/getManyGoods', app.middleware.authenticatedMiddleware('用户'), controller.goodController.getManyGoods);
  router.get('/good/getRecommendGood', app.middleware.authenticatedMiddleware('用户'), controller.goodController.getRecommendGood);
  router.post('/good/setGoodStatus', app.middleware.authenticatedMiddleware('运营'), controller.goodController.setGoodStatus);
  router.post('/good/delGood', app.middleware.authenticatedMiddleware('运营'), controller.goodController.delGood);
  router.post('/good/getGoodDetailForAdmin', app.middleware.authenticatedMiddleware('用户'),
    controller.goodController.getGoodDetailForAdmin);
  router.post('/good/getGoodDetailForUser', app.middleware.authenticatedMiddleware('用户'),
    controller.goodController.getGoodDetailForUser);
  router.post('/good/getShowGoods', app.middleware.authenticatedMiddleware('用户'), controller.goodController.getShowGoods);
  // -------------------------2.0----------------------------
  router.post('/category/createCategory', app.middleware.authenticatedMiddleware('运营'),
    controller.goodController.createCategory);
  router.post('/category/updateCategory', app.middleware.authenticatedMiddleware('运营'),
    controller.goodController.updateCategory);
  router.post('/category/deleteCategory', app.middleware.authenticatedMiddleware('运营'),
    controller.goodController.deleteCategory);
  router.post('/category/getCategoryList', app.middleware.authenticatedMiddleware('用户'),
    controller.goodController.getCategory);


  router.post('/order/makeOrder', app.middleware.authenticatedMiddleware('用户'),
    controller.orderTrackerController.makeOrder);


  router.post('/order/getMyOrders', app.middleware.authenticatedMiddleware('用户'),
    controller.orderTrackerController.getMyOrders);

  router.post('/order/getOneMyOrder', app.middleware.authenticatedMiddleware('用户'),
    controller.orderTrackerController.getOneMyOrder);
  router.post('/good/getGoodListForUser', app.middleware.authenticatedMiddleware('用户'),
    controller.goodController.getGoodListForUser);

};
