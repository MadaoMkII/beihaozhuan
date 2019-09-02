module.exports = app => {
    const mongoose = app.mongoose;
    const connection = app.mongooseDB.get('commonConnection');
    let advertisement = new mongoose.Schema({
        title: {type: String, required: true},
        category: {type: String, required: true},
        channel: {type: String, required: true},
        reward: {type: String, required: true, default: 0},
        activity: {
            type: String,
            enum: ['enable', 'disable'], default: "disable"
        },
        advData: {type: mongoose.Schema.Types.Mixed},
        positionName: {type: String},
        uuid: {
            required: true,
            type: String,
            unique: true,
            sparse: true
        }
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
    advertisement.set('toJSON', {
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

    return connection.model('Advertisement', advertisement, 'Advertisement');
};
