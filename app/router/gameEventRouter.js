'use strict';
module.exports = app => {
  const { router, controller, middleware } = app;
  const { gameEventController } = controller;
  const { authenticatedMiddleware } = middleware;
  router.post('/gameEvent/createEventGameSetting', authenticatedMiddleware('职员'), gameEventController.createEventGameSetting);
  router.post('/gameEvent/updateEventGameSetting', authenticatedMiddleware('职员'), gameEventController.updateEventGameSetting);
  router.post('/gameEvent/getEventGameSettingList', authenticatedMiddleware('职员'), gameEventController.getEventGameSettingList);
  router.post('/gameEvent/deleteEventGameSetting', authenticatedMiddleware('职员'), gameEventController.deleteEventGameSetting);
  router.post('/gameEvent/setGameEvent', gameEventController.setGameEvent);
  router.post('/gameEvent/initialGameEventByStep', authenticatedMiddleware('职员'), gameEventController.initialGameEventByStep);
  router.post('/gameEvent/completeWatchingMission', authenticatedMiddleware('职员'), gameEventController.completeWatchingMission);
  router.post('/gameEvent/submitScreenshot', authenticatedMiddleware('职员'), gameEventController.submitScreenshot);
  router.post('/gameEvent/approveAuditUploadRecord', authenticatedMiddleware('职员'), gameEventController.approveAuditUploadRecord);
  router.get('/gameEvent/getThisMonthIncoming', authenticatedMiddleware('职员'), gameEventController.getThisMonthIncoming);
  router.post('/gameEvent/getAuditUploadRecordList', authenticatedMiddleware('职员'), gameEventController.getAuditUploadRecordList);
  router.post('/gameEvent/withdrewByCategory', authenticatedMiddleware('职员'), gameEventController.withdrewByCategory);
  router.post('/gameEvent/getMyGameProcess', authenticatedMiddleware('职员'), gameEventController.getMyGameProcess);
  router.post('/images/uploadImages', authenticatedMiddleware('职员'), controller.picController.uploadImages);
  router.post('/gameEvent/getEventGameByCategory', authenticatedMiddleware('职员'), gameEventController.getEventGameByCategory);

  router.post('/gameEvent/getGameSetting', authenticatedMiddleware('职员'), gameEventController.getGameSetting);

  router.post('/gameEvent/getGameProcessByUUid', authenticatedMiddleware('职员'), gameEventController.getGameProcessByUUid);
  router.post('/gameEvent/completeDownload', authenticatedMiddleware('职员'), gameEventController.completeDownload);
  router.get('/gameEvent/getRenderData', gameEventController.getRenderData);
};
