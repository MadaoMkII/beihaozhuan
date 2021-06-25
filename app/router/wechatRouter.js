'use strict';
module.exports = app => {
  const { router, controller } = app;
  // router.post('/setting/setAdvPosition', app.middleware.authenticatedMiddleware(`客服`),
  //     controller[`systemSettingController`].setAdvPosition);
  // router.post('/setting/setBannerGood', app.middleware.authenticatedMiddleware(`客服`),
  //     controller[`systemSettingController`].setBannerGood);
  router.post('/wechat/getWithDrewByAdmin', app.middleware.authenticatedMiddleware('运营'),
    controller.wechatController.getWithDrewByAdmin);
  router.get('/wechat/getWithdrewStatus', app.middleware.authenticatedMiddleware('用户'),
    controller.wechatController.getWithdrewStatus);

  router.post('/wechat/getWithDrewByUser', app.middleware.authenticatedMiddleware('用户'),
    controller.wechatController.getWithDrewByUser);

  router.post('/withdrew/createWithdrewConstraint', app.middleware.authenticatedMiddleware('用户'),
    controller.withdrewConstraintController.createWithdrewConstraint);
  router.get('/withdrew/getWithdrewConstraintList', app.middleware.authenticatedMiddleware('用户'),
    controller.withdrewConstraintController.getWithdrewConstraintList);
  router.post('/withdrew/updateWithdrewConstraintList', app.middleware.authenticatedMiddleware('用户'),
    controller.withdrewConstraintController.updateWithdrewConstraintList);
  router.post('/withdrew/deleteWithdrewConstraintList', app.middleware.authenticatedMiddleware('用户'),
    controller.withdrewConstraintController.deleteWithdrewConstraintList);
  router.post('/withdrew/getWithdrewList', app.middleware.authenticatedMiddleware('用户'),
    controller.withdrewConstraintController.getWithdrewList);

  router.post('/withdrew/getWithdrewConstraintList_User', app.middleware.authenticatedMiddleware('用户'),
    controller.withdrewConstraintController.getWithdrewConstraintList_User);
};
