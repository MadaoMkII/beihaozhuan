module.exports = app => {
    const mongoose = app.mongoose;
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);
    const missionTracker = new mongoose.Schema({
        missionType: String,
        requireAmount: {required: true, type: Number, default: 0},
        recentAmount: {required: true, type: Number, default: 0},
        title: String,
        imgUrl: String,
        good_id: {type: mongoose.Schema.Types.ObjectId, ref: `Good`},
        missionUUid: String,
        user_id: {required: true, type: mongoose.Schema.Types.ObjectId, ref: `UserAccount`}
    }, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at'
        }
    });
    missionTracker.set('toJSON', {
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
     mongoose.model('DailyMissionTracker', missionTracker, 'DailyMissionTracker');
    return mongoose.model('MissionTracker', missionTracker, 'MissionTracker');
};