'use strict';
module.exports = app => {
  const { router, controller } = app;
  const checker = app.middleware.authenticatedMiddleware;
  const { userPromotionController, promotionController } = controller;
  // router.post('/promotion/createPromotion', checker('用户'), promotionController.createPromotion);
  // router.post('/promotion/addPromotionBranch', checker('用户'), promotionController.addPromotionBranch);
  // router.post('/promotion/updatePromotionBranch', checker('用户'), promotionController.updatePromotionBranch);
  router.get('/userPromotion/getMainPageData', checker('用户'), promotionController.getMainPageData);
  //
  // router.post('/userPromotion/submitUserPromotionService', checker('用户'), promotionController.submitUserPromotionService);
  // router.post('/userPromotion/approvePromotion', checker('用户'), userPromotionController.approvePromotion);
  router.post('/userPromotion/checkDownloadLink', checker('用户'), promotionController.checkDownloadLink);

  router.post('/userReward/getPromotionDetail', checker('用户'), promotionController.getPromotionDetail);

  // router.post('/promotion/getProofs', app.middleware.authenticatedMiddleware('用户'),
  //     controller.homeCreditController.getProofs);
  //
  // router.get('/promotion/checkProofsStatus', app.middleware.authenticatedMiddleware('用户'),
  //     controller.homeCreditController.checkProofsStatus);
  //
  // router.get('/promotion/getDoubleDecInviteLink', app.middleware.authenticatedMiddleware('用户'),
  //     controller.homeCreditController.getDoubleDecInviteLink);
  //
  // router.get('/promotion/setDownload', app.middleware.authenticatedMiddleware('用户'),
  //     controller.homeCreditController.setDownload);
  //
  // router.post('/promotion/createPromotionProof',
  //     controller.homeCreditController.createPromotionProof);
  //
  // router.post('/promotion/verifyProof', app.middleware.authenticatedMiddleware('客服'),
  //     controller.homeCreditController.verifyProofs);


};
