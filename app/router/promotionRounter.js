'use strict';
module.exports = app => {
    const {router, controller} = app;
    router.get('/test',
        controller.homeCreditController.xab);

    router.post('/createPromotionProof',
        controller.homeCreditController.createPromotionProof);

};

