module.exports = app => {
    const mongoose = app.mongoose;
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);
    const connection = app.mongooseDB.get('missionTracker');
    let missionProcessingTracker = new mongoose.Schema({
        userID: {type: app.mongoose.Schema.Types.ObjectId, ref: 'UserAccount'},
        missionID: {type: app.mongoose.Schema.Types.ObjectId, ref: 'Mission'},
        missionEventName: {type: String, required: true},
        recentAmount: {type: Number, default: 0},
        effectDay: {type: String, default: app.getFormatDate()}
    }, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at'
        }
    });
    missionProcessingTracker.set('toJSON', {
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            delete ret.good_id;
            delete ret.password;
            delete ret[`updated_at`];
            //delete ret.password;
            // ret.VIPLevel = vipCoculart(doc.growthPoints);
            // if (doc.created_at && doc.updated_at) {
            //     ret.created_at = new Date(doc.created_at).getTime();
            //     ret.updated_at = new Date(doc.updated_at).getTime();
            // }
            // if (doc.last_login_time) {
            //     ret.last_login_time = new Date(doc.last_login_time).getTime();
            // }
        }
    });
    return connection.model('WeeklyMissionProcessingTracker', missionProcessingTracker, 'WeeklyMissionProcessingTracker');
};