let baseMissionProcessingTracker = require(`./baseMissionProcessing`);
module.exports = app => {
    const mongoose = app.mongoose;
    let missionProcessingTracker = baseMissionProcessingTracker.getModel(app);
    return mongoose.model('MissionProcessingTracker', missionProcessingTracker, 'MissionProcessingTracker');
};