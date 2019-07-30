module.exports = app => {
    const {router, controller} = app;
    router.get('/verify/getImg', controller['captchaController'].getCaptchaImg);
    router.post('/verify/verifyCaptTxt', controller['captchaController'].verifyCaptchaText);
    router.post('/uploadImgForEndpoint', controller.picController.uploadImgs);
    router.get('/', controller.home.main);
    router.get('/deleteImage', controller.picController.deleteImg);
};