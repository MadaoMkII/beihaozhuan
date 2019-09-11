`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.post('/mission/createMission', controller[`missionController`].createMission);
    router.post('/mission/getMissions', controller[`missionController`].getMissions);
    router.post('/mission/updateMission', controller[`missionController`].updateMission);
    router.post('/mission/setMissionStatus', app.middleware.authenticatedMiddleware(`User`),
        controller[`missionController`].setMissionStatus);
    router.get('/mission/check', controller[`missionController`].checkMissions);

    router.get('/mission/getUserDailyMissionProcessing', app.middleware.authenticatedMiddleware(`User`),
        controller[`missionProcessingTrackerController`].getUserDailyMissionProcessing);
    router.get('/mission/getUserWeeklyMissionProcessing', app.middleware.authenticatedMiddleware(`User`),
        controller[`missionProcessingTrackerController`].getUserWeeklyMissionProcessing);
    router.get('/mission/getUserWeeklyMissionProcessing', app.middleware.authenticatedMiddleware(`User`),
        controller[`missionProcessingTrackerController`].getUserWeeklyMissionProcessing);
    router.get('/mission/getUserPermanentMissionProcessing', app.middleware.authenticatedMiddleware(`User`),
        controller[`missionProcessingTrackerController`].getUserPermanentMissionProcessing);
    router.post('/mission/completeMission', app.middleware.authenticatedMiddleware(`User`),
        controller[`missionProcessingTrackerController`].completeMission);
};
