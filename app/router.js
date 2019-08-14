'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // const {router, controller} = app;
    //
    // router.get('/login', controller.home.login);
    // router.post('/getSession', controller[`captchaController`].verifyCaptchaText);
    require('./router/goodRouter')(app);
    require('./router/emailRouter')(app);
    require('./router/imgRouter')(app);
    require('./router/userRouter')(app);

};
