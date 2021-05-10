'use strict';
module.exports = app => {
  const { router, controller } = app;
  // router.get('/verify/getVerifyImg', controller['captchaController'].getCaptchaImg);
  // router.post('/verify/verifyCaptTxt', controller['captchaController'].verifyCaptchaText);
  router.post('/uploadImgForEndpoint', app.middleware.authenticatedMiddleware('用户'), controller.picController.uploadImages_local);

  router.post('/deleteImages', app.middleware.authenticatedMiddleware('用户'), controller.picController.delImgs);
};
