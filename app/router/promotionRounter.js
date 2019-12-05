'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.post('/promotion/getProofs', app.middleware.authenticatedMiddleware('用户'),
    controller.homeCreditController.getProofs);

  router.get('/promotion/checkProofsStatus', app.middleware.authenticatedMiddleware('用户'),
    controller.homeCreditController.checkProofsStatus);

  router.post('/promotion/createPromotionProof',
    controller.homeCreditController.createPromotionProof);

  router.post('/promotion/verifyProof', app.middleware.authenticatedMiddleware('客服'),
    controller.homeCreditController.verifyProofs);

  router.post('/wechat/withdrew', app.middleware.authenticatedMiddleware('客服'), controller.wechatController.withdrew);
};
