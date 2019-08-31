`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.post('/mission/createMission', controller[`missionController`].createMission);
    router.post('/mission/getMissions', controller[`missionController`].getMissions);
    router.post('/mission/updateMission', controller[`missionController`].updateMission);
    router.get('/mission/check', controller[`missionController`].checkMissions);

    router.get('/mission/getUserMissionProcessing', app.middleware.authenticatedMiddleware(`User`),
        controller[`missionProcessingTrackerController`].getUserMissionProcessing);

};
