module.exports = app => {
    const mongoose = app.mongoose;
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);

    let systemSetting = new mongoose.Schema({
        uuid: {
            required: true,
            type: String,
            unique: true
        },
        goodSetting: {
            recommendGoods_ID: [{type: mongoose.Schema.Types.ObjectId, ref: 'Good'}],
        },
        advPosition: [{
            location: {type: String, required: true, default: '未分类', unique: true},
            advPositionInfo: {
                adv_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Good'},
                title: {type: String, required: true},
                length: {type: Number, required: true, default: 0},
                weight: {type: Number, required: true, default: 0},
                activity: {type: Boolean, default: false}
            }
        }]
    }, {
        'timestamps': {'createdAt': 'created_at', 'updatedAt': 'updated_at'}
    });


    systemSetting.set('toObject', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            delete ret.id;
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
    systemSetting.set('toJSON', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            delete ret.id;
            delete ret.password;
            delete ret.updated_at;
            delete ret.create_at;
            //ret.Bcoins = doc.Bcoins;
            // if (doc.created_at && doc.updated_at) {
            //     ret.created_at = new Date(doc.created_at).getTime();
            //     ret.updated_at = new Date(doc.updated_at).getTime();
            // }
            // if (doc.last_login_time) {
            //     ret.last_login_time = new Date(doc.last_login_time).getTime();
            // }
        }
    });
    return mongoose.model('SystemSetting', systemSetting, 'SystemSetting');
};

