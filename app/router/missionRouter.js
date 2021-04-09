'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.post('/mission/createMission', app.middleware.authenticatedMiddleware('运营'), controller.missionController.createMission);
  router.post('/mission/getMissions', controller.missionController.getMissions);
  router.post('/mission/updateMission', app.middleware.authenticatedMiddleware('运营'), controller.missionController.updateMission);
  router.post('/mission/setMissionStatus', app.middleware.authenticatedMiddleware('运营'),
    controller.missionController.setMissionStatus);

  // router.get('/mission/check', controller[`missionController`].checkMissions);

  router.get('/mission/getUserDailyMissionProcessing', app.middleware.authenticatedMiddleware('用户'),
    controller.missionProcessingTrackerController.getUserDailyMissionProcessing);
  router.get('/mission/getUserWeeklyMissionProcessing', app.middleware.authenticatedMiddleware('用户'),
    controller.missionProcessingTrackerController.getUserWeeklyMissionProcessing);
  router.get('/mission/getUserWeeklyMissionProcessing', app.middleware.authenticatedMiddleware('用户'),
    controller.missionProcessingTrackerController.getUserWeeklyMissionProcessing);
  router.get('/mission/getUserPermanentMissionProcessing', app.middleware.authenticatedMiddleware('用户'),
    controller.missionProcessingTrackerController.getUserPermanentMissionProcessing);
  router.post('/mission/completeMission', app.middleware.authenticatedMiddleware('用户'),
    controller.missionProcessingTrackerController.completeMission);


  router.post('/mission/finishMission', app.middleware.authenticatedMiddleware('用户'),
    controller.missionProcessingTrackerController.finishMission);


  router.post('/mission/createRealMission', app.middleware.authenticatedMiddleware('用户'),
    controller.realMissionController.createRealMission);
  router.post('/mission/doMission', app.middleware.authenticatedMiddleware('用户'),
    controller.realMissionController.doMission);
};
