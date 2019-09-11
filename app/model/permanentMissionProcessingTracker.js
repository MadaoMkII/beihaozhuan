module.exports = app => {
    const mongoose = app.mongoose;
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);
    const connection = app.mongooseDB.get('missionTracker');
    let structure = {
        userID: {type: app.mongoose.Schema.Types.ObjectId, ref: 'UserAccount'},
        missionID: {type: app.mongoose.Schema.Types.ObjectId},
        missionEventName: {type: String, required: true},
        recentAmount: {type: Number, default: 0},
        requireAmount: {type: Number, default: 0},
        completed: {type: Boolean, default: false},
        effectDay: {type: String, default: `Permanent`}
    };
    let missionProcessingTracker = new mongoose.Schema(structure, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at'
        }
    });
    missionProcessingTracker.set('toJSON', {
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            delete ret[`updated_at`];
        }
    });
    return connection.model('PermanentMissionProcessingTracker', missionProcessingTracker, 'PermanentMissionProcessingTracker');
};