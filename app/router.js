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
  require('./router/dataAnalyzeRouter')(app);
  require('./router/settingRouter')(app);
  require('./router/emailRouter')(app);
  require('./router/imgRouter')(app);
  require('./router/userRouter')(app);
  require('./router/advertisementRouter')(app);
  require('./router/missionRouter')(app);
  require('./router/maintenanceRouter')(app);
  require('./router/wechatRouter')(app);
  require('./router/gameEventRouter')(app);
  require('./router/fileRouter')(app);
  require('./router/userRewardRouter')(app);
  require('./router/promotionRouter')(app);

};
