const moment = require(`moment`);
module.exports = app => {
    const mongoose = app.mongoose;
    let missionProcessingTracker = new mongoose.Schema({
        userID: {type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount'},
        missionID: {type: mongoose.Schema.Types.ObjectId, ref: 'Mission'},
        recentAmount: {type: Number, default: 0},
        effectDay: {type: Date, default: moment().format('l')}
    }, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at'
        }
    });
    missionProcessingTracker.set('toJSON', {
        virtuals: true,
        transform: (origin, show) => {
            delete show.__v;
            delete show._id;
            delete show.id;
            delete show.created_at;
            delete show.updated_at;
            delete show.userID;
            //delete ret.password;
            // ret.Bcoins = doc.Bcoins;
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
    return mongoose.model('MissionProcessingTracker', missionProcessingTracker, 'MissionProcessingTracker');
};