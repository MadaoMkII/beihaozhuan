module.exports = app => {
    const mongoose = app.mongoose;

    let advertising = new mongoose.Schema({
        title: {type: String, required: true},
        channel: {type: String, required: true},
        reward: {type: String, required: true, default: 0},
        activity: {type: Boolean, default: false},
        advData: {type: mongoose.Schema.Types.Mixed},
        uuid: {
            required: true,
            type: String,
            unique: true
        }
    }, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at', toObject: {virtuals: true},
            toJSON: {virtuals: true}
        }
    });

    let advertisingPosition = new mongoose.Schema({
        uuid: {
            required: true,
            type: String,
            unique: true
        },
        title: {type: String, required: true},
        location: {type: String, required: true, default: '未分类', unique: true},
        length: {type: Number, required: true, default: 0},
        weight: {type: Number, required: true, default: 0},
        activity: {type: Boolean, default: false},
        advertisingData: {advertising}
    }, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at', toObject: {virtuals: true},
            toJSON: {virtuals: true}
        }
    });

    // goodSchema.set('toObject', {
    //     virtuals: true,
    //     transform: (doc, ret) => {
    //         delete ret.__v;
    //         delete ret._id;
    //         delete ret.id;
    //         delete ret.password;
    //         ret.Bcoins = doc.Bcoins;
    //         // ret.VIPLevel = vipCoculart(doc.growthPoints);
    //         // if (doc.created_at && doc.updated_at) {
    //         //     ret.created_at = new Date(doc.created_at).getTime();
    //         //     ret.updated_at = new Date(doc.updated_at).getTime();
    //         // }
    //         // if (doc.last_login_time) {
    //         //     ret.last_login_time = new Date(doc.last_login_time).getTime();
    //         // }
    //     }
    // });
    advertisingPosition.set('toJSON', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            delete ret.id;
            delete ret.created_at;
            delete ret.updated_at;
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

    return mongoose.model('AdvertisingPosition', advertisingPosition, 'AdvertisingPosition');
};
