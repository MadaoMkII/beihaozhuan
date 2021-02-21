'use strict';
module.exports = app => {
  const { router, controller, middleware } = app;
  const { gameEventController } = controller;
  const { authenticatedMiddleware } = middleware;
  router.post('/gameEvent/createEventGameSetting', authenticatedMiddleware('客服'), gameEventController.createEventGameSetting);
  router.post('/gameEvent/updateEventGameSetting', authenticatedMiddleware('客服'), gameEventController.updateEventGameSetting);
  router.post('/gameEvent/getEventGameSettingList', authenticatedMiddleware('用户'), gameEventController.getEventGameSettingList);
  router.post('/gameEvent/deleteEventGameSetting', authenticatedMiddleware('客服'), gameEventController.deleteEventGameSetting);
  router.post('/gameEvent/setGameEvent', authenticatedMiddleware('客服'), gameEventController.setGameEvent);
  router.post('/gameEvent/initialGameEventByStep', authenticatedMiddleware('用户'), gameEventController.initialGameEventByStep);
  router.post('/gameEvent/completeWatchingMission', authenticatedMiddleware('用户'), gameEventController.completeWatchingMission);
  router.post('/gameEvent/submitScreenshot', authenticatedMiddleware('用户'), gameEventController.submitScreenshot);
  router.post('/gameEvent/approveAuditUploadRecord', authenticatedMiddleware('客服'), gameEventController.approveAuditUploadRecord);
  router.get('/gameEvent/getThisMonthIncoming', authenticatedMiddleware('用户'), gameEventController.getThisMonthIncoming);
  router.post('/gameEvent/getAuditUploadRecordList', authenticatedMiddleware('客服'), gameEventController.getAuditUploadRecordList);
  router.post('/gameEvent/withdrewByCategory', authenticatedMiddleware('用户'), gameEventController.withdrewByCategory);
  router.post('/gameEvent/getMyGameProcess', authenticatedMiddleware('用户'), gameEventController.getMyGameProcess);
  router.post('/images/uploadImages', authenticatedMiddleware('用户'), controller.picController.uploadImages);
  router.post('/gameEvent/getEventGameByCategory', authenticatedMiddleware('用户'), gameEventController.getEventGameByCategory);

  router.post('/gameEvent/getGameSetting', authenticatedMiddleware('用户'), gameEventController.getGameSetting);

  router.post('/gameEvent/getGameProcessByUUid', authenticatedMiddleware('用户'), gameEventController.getGameProcessByUUid);
  router.post('/gameEvent/completeDownload', authenticatedMiddleware('用户'), gameEventController.completeDownload);
  router.get('/gameEvent/getRenderData', gameEventController.getRenderData);

  router.post('/gameEvent/recordDownload', authenticatedMiddleware('用户'), gameEventController.recordDownload);
};
