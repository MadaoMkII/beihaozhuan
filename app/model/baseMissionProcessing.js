module.exports = app => {
    const mongoose = app.mongoose;
    const connection = app.mongooseDB.get('missionConnection');
    let missionProcessingTracker = new app.mongoose.Schema({
        userID: {type: app.mongoose.Schema.Types.ObjectId, ref: 'UserAccount'},
        missionID: {type: app.mongoose.Schema.Types.ObjectId, ref: 'Mission'},
        missionEventName: {type: String, required: true},
        recentAmount: {type: Number, default: 0},
        //effectDay: {type: String, default: app.getFormatDate()}
    }, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at'
        }
    });
};