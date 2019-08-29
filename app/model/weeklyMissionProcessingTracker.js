// let missionProcessingTracker = require(`./baseMissionProcessing`);
// module.exports = app => {
//     const mongoose = app.mongoose;
//     const connection = app.mongooseDB.get('missionConnection');
//     let weeklyMissionProcessingTracker = missionProcessingTracker.getModel(app, mongoose);
//     // let weeklyMissionProcessingTracker = new mongoose.Schema({
//     //     title: {type: String},
//     // }, {
//     //     'timestamps': {
//     //         'createdAt': 'created_at', 'updatedAt': 'updated_at', toObject: {virtuals: true},
//     //         toJSON: {virtuals: true}
//     //     }
//     // });
//     return connection.model('WeeklyMissionProcessingTracker',
//         weeklyMissionProcessingTracker, 'WeeklyMissionProcessingTracker');
// };