let missionProcessingTracker = require(`./baseMissionProcessing`);
module.exports = app => {
    const mongoose = app.mongoose;
    let weeklyMissionProcessingTracker = missionProcessingTracker.getModel(app);
    // let weeklyMissionProcessingTracker = new mongoose.Schema({
    //     title: {type: String},
    // }, {
    //     'timestamps': {
    //         'createdAt': 'created_at', 'updatedAt': 'updated_at', toObject: {virtuals: true},
    //         toJSON: {virtuals: true}
    //     }
    // });
    return mongoose.model('WeeklyMissionProcessingTracker',
        weeklyMissionProcessingTracker, 'WeeklyMissionProcessingTracker');
};