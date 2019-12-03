'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.post('/promotion/getProofs',
    controller.homeCreditController.getProofs);

  router.post('/promotion/createPromotionProof',
    controller.homeCreditController.createPromotionProof);

};

