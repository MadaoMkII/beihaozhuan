'use strict';
module.exports = app => {
  const { router, controller } = app;
  const checker = app.middleware.authenticatedMiddleware;
  const { promotionController } = controller;
  router.post('/promotion/createPromotion', checker('用户'), promotionController.createPromotion);
  router.post('/promotion/addPromotionBranch', checker('用户'), promotionController.addPromotionBranch);
  router.post('/promotion/updatePromotionBranch', checker('用户'), promotionController.updatePromotionBranch);
  router.post('/userReward/deletePromotionBranch', checker('用户'), promotionController.deletePromotionBranch);
  router.post('/promotion/getPromotionList', checker('用户'), promotionController.getPromotionList);

  router.get('/userPromotion/getMainPageData', checker('用户'), promotionController.getMainPageData);
  router.post('/userPromotion/submitUserPromotionProve', checker('用户'), promotionController.submitUserPromotionProve);
  // router.post('/userPromotion/approvePromotion', checker('用户'), userPromotionController.approvePromotion);
  router.post('/userPromotion/checkDownloadLink', checker('用户'), promotionController.checkDownloadLink);
  router.post('/userReward/getPromotionDetail', checker('用户'), promotionController.getPromotionDetail);
  router.post('/promotion/updatePromotion', checker('用户'), promotionController.updatePromotion);
  router.post('/promotion/deletePromotion', checker('用户'), promotionController.deletePromotion);
  router.post('/userPromotion/getCheckUserPromotionBranchLabel', checker('用户'), promotionController.getCheckUserPromotionBranchLabel);
  router.post('/userPromotion/getCheckUserPromotionList', checker('用户'), promotionController.getCheckUserPromotionList);


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
