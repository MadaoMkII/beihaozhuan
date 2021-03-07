'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.post('/userReward/createUserReward', app.middleware.authenticatedMiddleware('运营'), controller.userRewardServiceController.createUserReward);
  router.post('/userReward/activityUserReward', app.middleware.authenticatedMiddleware('运营'), controller.userRewardServiceController.activityUserReward);
  router.post('/userReward/quickUserList', app.middleware.authenticatedMiddleware('运营'), controller.userRewardServiceController.quickUserList);
  router.post('/userReward/getUserRewardDetail', app.middleware.authenticatedMiddleware('运营'), controller.userRewardServiceController.getUserRewardDetail);
  router.post('/userReward/getUserRewardList', app.middleware.authenticatedMiddleware('运营'), controller.userRewardServiceController.getUserRewardList);
  router.post('/userReward/updateUserReward', app.middleware.authenticatedMiddleware('运营'), controller.userRewardServiceController.updateUserReward);
  router.post('/userReward/deleteUserReward', app.middleware.authenticatedMiddleware('运营'), controller.userRewardServiceController.deleteUserReward);
};
