module.exports = app => {
    const mongoose = app.mongoose;
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);
    const connection = app.mongooseDB.get('commonConnection');
    const mission = new mongoose.Schema({
        missionType: {required: true, type: String, enum: [`Weekly`, `Daily`, `Permanent`]},
        title: {required: true, type: String, unique: true, sparse: true},
        requireAmount: {required: true, type: Number, default: 0},
        imgUrl: String,
        reward: {required: true, type: Number, default: 0},
        UUid: {required: true, type: String},
        //eventName: {required: true, type: String, default: `defaultEvent`},
        status: {
            type: String, required: true,
            enum: [`activity`, `disable`], default: "disable"
        }
    }, {
        'timestamps': {'createdAt': 'created_at', 'updatedAt': 'updated_at'}
    });
    mission.set('toJSON', {
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
    return connection.model('Mission', mission, 'Mission');
};