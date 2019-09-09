module.exports = app => {
    const {router, controller} = app;
    router.get('/verify/getVerifyImg', controller['captchaController'].getCaptchaImg);
    router.post('/verify/verifyCaptTxt', controller['captchaController'].verifyCaptchaText);
    router.post('/uploadImgForEndpoint', controller.picController.uploadImgs);

    router.post('/deleteImages', controller.picController.delImgs);
};